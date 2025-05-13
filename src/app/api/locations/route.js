// src/app/api/locations/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/utils/mongodb";
import Location from '@/models/Location'; // Asegúrate que la ruta sea correcta

// --- GET: Obtener todos los lugares ---
export async function GET(request) {
  try {
    await dbConnect();
    const locations = await Location.find({}).sort({ createdAt: -1 }); // Ordenar por más reciente
    return NextResponse.json(locations, { status: 200 });
  } catch (error) {
    console.error('API GET Error:', error);
    return NextResponse.json({ message: 'Error del servidor al obtener lugares', error: error.message }, { status: 500 });
  }
}

// --- POST: Crear un nuevo lugar ---
export async function POST(request) {
  let requestBody;
  try {
    requestBody = await request.json();
    // console.log("Datos recibidos en POST:", requestBody); // Log para debug
  } catch (error) {
    console.error('API POST - Error parseando JSON:', error);
    return NextResponse.json({ message: 'Cuerpo de la petición inválido (no es JSON)' }, { status: 400 });
  }

  try {
    await dbConnect();

    // Validación básica extra (aunque Mongoose también valida)
    const { name, photoUrl, description, ubi_lat, ubi_lng } = requestBody;
    if (!name || !photoUrl || !description || ubi_lat == null || ubi_lng == null) {
         return NextResponse.json({ message: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const newLocation = new Location({
        name,
        photoUrl,
        description,
        ubi_lat: Number(ubi_lat), // Asegurar que sean números
        ubi_lng: Number(ubi_lng)
    });

    const savedLocation = await newLocation.save();
    return NextResponse.json(savedLocation, { status: 201 });

  } catch (error) {
    console.error('API POST Error:', error);
    if (error.name === 'ValidationError') {
      // Extraer mensajes de error de Mongoose
      const errors = Object.values(error.errors).map(el => el.message);
      return NextResponse.json({ message: 'Error de Validación', errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error del servidor al crear el lugar', error: error.message }, { status: 500 });
  }
}