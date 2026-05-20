import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String], // Array of strings for choices
    required: true
  },
  correct: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true, // E.g., 'Reasoning', 'General Awareness', 'Quantitative Aptitude'
  }
}, { timestamps: true });

// Agar model pehle se bana hai toh use use karega, nahi toh naya banayega (Next.js optimization)
export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);