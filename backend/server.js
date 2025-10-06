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

app.post("/api/ai/ask", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query?.trim()) return res.status(400).json({ message: "Query is required" });

    // Proper embedding (sentence-level)
    const output = await embedder(query, { pooling: "mean", normalize: true });
    const queryVec = Array.from(output.data);

    // Load stored sections
    const sections = await Section.find({ embedding: { $exists: true, $ne: [] } }).lean();
    const results = [];

    for (const s of sections) {
      const sectionVec = s.embedding;
      const score = cosineSimilarity(queryVec, sectionVec);
      results.push({ section: s, score });
    }

    results.sort((a, b) => b.score - a.score);
    const topScore = results[0]?.score || 0;
    let matchedSections = [];

    if (topScore < 0.55) {
      // Fallback keyword search
      const tokens = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      const orConditions = tokens.flatMap(word => [
        { sectionNumber: { $regex: word, $options: "i" } },
        { sectionName: { $regex: word, $options: "i" } },
        { description: { $regex: word, $options: "i" } },
        { lawType: { $regex: word, $options: "i" } },
        { tags: { $regex: word, $options: "i" } },
      ]);
      matchedSections = await Section.find({ $or: orConditions }).limit(3);
    } else {
      matchedSections = results.slice(0, 3).map(r => r.section);
    }

    res.json({ query, matchedSections });
  } catch (err) {
    console.error("askAI error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// Health check
app.get("/", (req, res) => res.send({ status: "API is running" }));
