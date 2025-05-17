
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
    const rate = await Puntuacion.findOne({
      user_id: userId, location_id: locationId
    });
    if (rate) {
       const updated = await Puntuacion.findOneAndUpdate(
      {
         user_id: userId
        location: locationId
       },
      { 
        score: score
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return NextResponse.json({ message: 'Puntuación actualizada', puntuacion: updated }, { status: 200 });
    } 
    else { 
      const newPuntuacion = new Puntuacion({ userId, locationId, score })
      const savePuntuacion = await newPuntucion.save();

  return NextResponse.json({ message: 'Puntuación registrada', puntuacion: savePuntuacion }, { status: 200 });
    }
    

   
  } catch (error) {
    return NextResponse.json({ message: 'Error al registrar puntuación', error: error.message }, { status: 500 });
  }
}

/*
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
*/