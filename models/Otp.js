import mongoose from 'mongoose';

const OtpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: { expires: 300 } } // 300 seconds = 5 min mein auto delete
});

export default mongoose.models.Otp || mongoose.model('Otp', OtpSchema);