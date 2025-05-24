import mongoose from 'mongoose';

const puntuacionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  location_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  score: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });

puntuacionSchema.index({ user_id: 1, location_id: 1 }, { unique: true });

export default mongoose.models.Puntuacion || mongoose.model('Puntuacion', puntuacionSchema);
