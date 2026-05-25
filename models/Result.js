import mongoose from "mongoose";

const ResultSchema = new mongoose.Schema({
  // Abhi auth nahi hai toh hum placeholder 'Guest' use karenge
  userEmail: { type: String, default: "guest@example.com" },
  score: { type: Number, required: true },
  correct: { type: Number, required: true },
  wrong: { type: Number, required: true },
  attempted: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  // Section wise breakdown save karne ke liye
  sectionStats: { type: Object },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Result || mongoose.model("Result", ResultSchema);
