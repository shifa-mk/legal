import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import Section from "./models/section.js"; // adjust the path to your model


// Your route files
import authRoutes from "./routes/authroutes.js";
import sectionRoutes from "./routes/sectionRoutes.js";

dotenv.config();
console.log("JWT_SECRET from env:", process.env.JWT_SECRET);

const app = express();
app.use(express.json()); // parse JSON body

// ✅ Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Error:", err));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/sections", sectionRoutes);


app.post("/api/ai/ask", async (req, res) => {
  try {
    const { prompt } = req.body; // keep the same field for frontend compatibility

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ message: "Query is required" });
    }

    // 🔍 Search MongoDB for sections
    const sections = await Section.find({
      $or: [
        { sectionName: { $regex: prompt, $options: "i" } },
        { description: { $regex: prompt, $options: "i" } },
        { lawType: { $regex: prompt, $options: "i" } }
      ]
    }).limit(10);

    if (!sections.length) {
      return res.json({
        prompt,
        matchedSections: [],
        message: "No matching section found."
      });
    }

    // ✅ Return all matched sections
    res.json({
      prompt,
      matchedSections: sections
    });
  } catch (err) {
    console.error("askAI error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.send({ status: "API is running" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
