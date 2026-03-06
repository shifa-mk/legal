import Section from "../models/sectionModel.js";
import { embedQuery } from "../utils/embedding.js";

export const askAI = async (req, res) => {
  try {
    console.log("🔥 AI ROUTE HIT");
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ message: "Query is required" });
    }

    // 1️⃣ Generate embedding
    const queryVector = await embedQuery(query);

    // 2️⃣ Vector search (WITH SCORE)
    const vectorResults = await Section.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector,
          numCandidates: 50,
          limit: 5,
        },
      },
      {
        $project: {
          sectionNumber: 1,
          sectionName: 1,
          lawType: 1,
          description: 1,
          punishment: 1,
          investigationSteps: 1,
          requiredDocuments: 1,
          relatedSections: 1,
          referenceLink: 1,
          notesForPolice: 1,
          importantCases: 1,
          score: { $meta: "vectorSearchScore" } // ✅ ADD THIS
        },
      },
    ]);

    console.log("VECTOR RESULTS:", vectorResults);

    res.json({
      matchedSections: vectorResults, // ✅ send directly
    });

  } catch (err) {
    console.error("askAI error:", err);
    res.status(500).json({ message: "Server error" });
  }
};