import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/utils/mongodb';
import Puntuacion from '@/models/Puntuacion';

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function POST(request) {
  await connectToDatabase();
  const { userId, locationId, score } = await request.json();

  if (![userId, locationId].every(isValidObjectId) || score < 1 || score > 5) {
    return NextResponse.json({ message: 'Datos inválidos' }, { status: 400 });
  }

  try {
    const updated = await Puntuacion.findOneAndUpdate(
      { user_id: userId, location_id: locationId },
      { score },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return NextResponse.json({ message: 'Puntuación registrada', puntuacion: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error en servidor', error: error.message }, { status: 500 });
  }
}

export async function GET() {
  await connectToDatabase();
  try {
    const ranking = await Puntuacion.aggregate([
      {
        $group: {
          _id: '$location_id',
          promedio: { $avg: '$score' },
          total: { $sum: 1 }
        }
      },
      { $sort: { promedio: -1, total: -1 } },
      { $limit: 10 }
    ]);
    return NextResponse.json(ranking);
  } catch (error) {
    return NextResponse.json({ message: 'Error al obtener ranking', error: error.message }, { status: 500 });
  }
}
