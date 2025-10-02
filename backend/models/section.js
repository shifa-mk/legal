import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  sectionNumber: { type: String, required: true },
  lawType: String,
  sectionName: { type: String, required: true },
  description: String,
  punishment: String,
  investigationSteps: [String],
  requiredDocuments: [String],
  relatedSections: [String],
  referenceLink: String,
  notesForPolice: String,
  importantCases: [
    {
      caseName: String,
      citation: String,
      summary: String
    }
  ]
});


const Section = mongoose.model("Section", sectionSchema);
export default Section;

