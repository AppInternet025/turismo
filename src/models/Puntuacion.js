import mongoose from 'mongoose';

const puntuacionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  score: { type: Number, min: 1, max: 5, required: true }
}, { timestamps: true });

puntuacionSchema.index({ user: 1, location: 1 }, { unique: true }); 

export default mongoose.models.Puntuacion || mongoose.model('Puntuacion', puntuacionSchema);
