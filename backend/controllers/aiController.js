import Section from "../models/sectionModel.js"; // adjust path if needed

export const askAI = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || !query.trim()) {
      return res.status(400).json({ message: "Query is required" });
    }

    // 🔍 MongoDB text + regex search
    const sections = await Section.find({
      $or: [
        { sectionName: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { lawType: { $regex: query, $options: "i" } }
      ]
    }).limit(10);

    if (!sections.length) {
      return res.json({
        query,
        matchedSections: [],
        message: "No matching section found."
      });
    }

    // ✅ Send back the full section details
    res.json({
      query,
      matchedSections: sections
    });

  } catch (err) {
    console.error("askAI error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
