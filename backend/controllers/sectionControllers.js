import Section from "../models/section.js";

// Get all sections
export const getSections = async (req, res) => {
  try {
    const sections = await Section.find();
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get section by ID
export const getSectionById = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    if (!section) return res.status(404).json({ message: "Section not found" });
    res.json(section);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new section
export const createSection = async (req, res) => {
  try {
    const section = new Section(req.body);
    const savedSection = await section.save();
    res.status(201).json(savedSection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update section
export const updateSection = async (req, res) => {
  try {
    const updatedSection = await Section.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSection) return res.status(404).json({ message: "Section not found" });
    res.json(updatedSection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete section
export const deleteSection = async (req, res) => {
  try {
    const deletedSection = await Section.findByIdAndDelete(req.params.id);
    if (!deletedSection) return res.status(404).json({ message: "Section not found" });
    res.json({ message: "Section deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search sections
export const searchSections = async (req, res) => {
  try {
    const query = req.query.q;
    const results = await Section.find({
      $or: [
        { sectionNumber: { $regex: query, $options: "i" } },
        { sectionName: { $regex: query, $options: "i" } },
        { lawType: { $regex: query, $options: "i" } },
      ],
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get section by sectionNumber
export const getSectionByNumber = async (req, res) => {
  try {
    const section = await Section.findOne({ sectionNumber: req.params.number });
    if (!section) return res.status(404).json({ message: "Section not found" });
    res.json(section);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
