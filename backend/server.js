// server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import Section from "./models/section.js";
import { pipeline } from "@xenova/transformers";
import cosineSimilarity from "cosine-similarity";

// Routes
import authRoutes from "./routes/authroutes.js";
import sectionRoutes from "./routes/sectionRoutes.js";

dotenv.config();


const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// Preload embedder
let embedder;
(async () => {
  embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  console.log("✅ Embedding model loaded");

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})();

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/sections", sectionRoutes);

// ... in your Express/Node.js route file (e.g., api/ai.js)

import { embedQuery, loadEmbedder } from './utils/embedding.js'; // Adjust path as needed


// You should call this once when your server starts
// loadEmbedder(); 

app.post("/api/ai/ask", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ message: "Query is required." });
  }

  try {
    // 1. Generate the 768-D query vector
    const queryVector = await embedQuery(query); 
    
    // 2. Perform the Vector Search using the correct 768-D vector
    const matchedSections = await Section.aggregate([
      {
        // ASSUMES you have created a MongoDB Atlas Vector Search Index on 'embedding'
        $vectorSearch: {
          queryVector: queryVector,
          path: "embedding",
          numCandidates: 50, // Number of initial candidates to check
          limit: 3,           // Number of top results to return
          index: "vector_index", // <-- REPLACE with your actual index name
        },
      },
      {
        $project: {
          // Include all the fields you need for the frontend and the score
          _id: 1, 
          sectionNumber: 1, 
          lawType: 1, 
          sectionName: 1, 
          description: 1,
          punishment: 1, 
          investigationSteps: 1, 
          requiredDocuments: 1, 
          relatedSections: 1, 
          referenceLink: 1, 
          notesForPolice: 1, 
          importantCases: 1, 
          score: { $meta: "vectorSearchScore" }, // Get the relevance score
        },
      },
      // You can add more stages here (e.g., to filter out low scores)
    ]);

    if (matchedSections.length === 0) {
      return res.json({ message: "No relevant sections found." });
    }

    // 3. Send the highly relevant sections back to the frontend
    res.json({ matchedSections: matchedSections });

  } catch (error) {
    console.error("Vector search failed:", error);
    res.status(500).json({ message: "Server error during AI search." });
  }
});


// Health check
app.get("/", (req, res) => res.send({ status: "API is running" }));
