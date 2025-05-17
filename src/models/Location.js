// src/lib/models/Location.js
import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    photoUrl: {
      type: String,
      required: [true, 'La URL de la foto es obligatoria'],
      trim: true,
      // Validación simple de URL (puedes mejorarla)
      match: [/^(http|https):\/\/[^ "]+$/, 'URL de foto inválida.']
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
    },
    ubi_lat: {
      type: Number,
      required: [true, 'La latitud es obligatoria'],
      min: [-90, 'Latitud inválida (mínimo -90)'],
      max: [90, 'Latitud inválida (máximo 90)'],
    },
    ubi_lng: {
      type: Number,
      required: [true, 'La longitud es obligatoria'],
      min: [-180, 'Longitud inválida (mínimo -180)'],
      max: [180, 'Longitud inválida (máximo 180)'],
    },
  },
  {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
  }
);

// Evita recompilar el modelo si ya existe (importante en entornos serverless/dev)
export default mongoose.models.Location || mongoose.model('Location', locationSchema);