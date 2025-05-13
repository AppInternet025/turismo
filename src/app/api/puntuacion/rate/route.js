
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/utils/mongodb';
import Puntuacion from '@/puntuacion/Puntuaciones';

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function POST(request) {
  const { userId, locationId, score } = await request.json();

  if (![userId, locationId].every(isValidObjectId) || score < 1 || score > 5) {
    return NextResponse.json({ message: 'Datos inválidos' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const updated = await Puntuacion.findOneAndUpdate(
      { user: userId, location: locationId },
      { score },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ message: 'Puntuación registrada', puntuacion: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error al registrar puntuación', error: error.message }, { status: 500 });
  }
}


export async function DELETE(request) {
  const { userId, locationId } = await request.json();

  if (![userId, locationId].every(isValidObjectId)) {
    return NextResponse.json({ message: 'IDs inválidos' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    await Puntuacion.findOneAndDelete({ user: userId, location: locationId });

    return NextResponse.json({ message: 'Puntuación eliminada' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error al eliminar puntuación', error: error.message }, { status: 500 });
  }
}
