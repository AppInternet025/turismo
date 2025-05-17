// src/app/api/locations/[id]/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/utils/mongodb";
import Location from '@/models/Location';
import mongoose from 'mongoose'; // Para validar ObjectId

// --- Helper para validar ObjectId ---
function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

// --- GET: Obtener un lugar por ID ---
export async function GET(request, { params }) {
  const { id } = params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ message: 'ID inválido' }, { status: 400 });
  }

  try {
    await dbConnect();
    const location = await Location.findById(id);

    if (!location) {
      return NextResponse.json({ message: 'Lugar no encontrado' }, { status: 404 });
    }
    return NextResponse.json(location, { status: 200 });
  } catch (error) {
    console.error(`API GET /${id} Error:`, error);
    return NextResponse.json({ message: 'Error del servidor al obtener el lugar', error: error.message }, { status: 500 });
  }
}

// --- PUT: Actualizar un lugar por ID ---
export async function PUT(request, { params }) {
  const { id } = params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ message: 'ID inválido' }, { status: 400 });
  }

  let requestBody;
   try {
     requestBody = await request.json();
   } catch (error) {
     console.error('API PUT - Error parseando JSON:', error);
     return NextResponse.json({ message: 'Cuerpo de la petición inválido (no es JSON)' }, { status: 400 });
   }

  try {
    await dbConnect();
    const location = await Location.findById(id);

    if (!location) {
      return NextResponse.json({ message: 'Lugar no encontrado para actualizar' }, { status: 404 });
    }

    // Actualizar campos proporcionados
    const { name, photoUrl, description, ubi_lat, ubi_lng } = requestBody;
    if (name) location.name = name;
    if (photoUrl) location.photoUrl = photoUrl;
    if (description) location.description = description;
    if (ubi_lat != null) location.ubi_lat = Number(ubi_lat);
    if (ubi_lng != null) location.ubi_lng = Number(ubi_lng);

    // runValidators: true asegura que las validaciones del schema se ejecuten al actualizar
    const updatedLocation = await location.save({ validateBeforeSave: true });

    return NextResponse.json(updatedLocation, { status: 200 });
  } catch (error) {
    console.error(`API PUT /${id} Error:`, error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(el => el.message);
      return NextResponse.json({ message: 'Error de Validación al actualizar', errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error del servidor al actualizar el lugar', error: error.message }, { status: 500 });
  }
}

// --- DELETE: Eliminar un lugar por ID ---
export async function DELETE(request, { params }) {
  const { id } = params;

   if (!isValidObjectId(id)) {
    return NextResponse.json({ message: 'ID inválido' }, { status: 400 });
  }

  try {
    await dbConnect();
    const deletedLocation = await Location.findByIdAndDelete(id);

    if (!deletedLocation) {
      return NextResponse.json({ message: 'Lugar no encontrado para eliminar' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Lugar eliminado correctamente' }, { status: 200 }); // O 204 No Content si prefieres
  } catch (error) {
    console.error(`API DELETE /${id} Error:`, error);
    return NextResponse.json({ message: 'Error del servidor al eliminar el lugar', error: error.message }, { status: 500 });
  }
}