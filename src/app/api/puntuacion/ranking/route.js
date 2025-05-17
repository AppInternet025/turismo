// src/puntuacion/api/ranking/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/mongodb'
import Puntuacion from '@/puntuacion/Puntuaciones';
import Location from '@/models/Location';

export async function GET() {
  try {
    await connectToDatabase();

    const ranking = await Puntuacion.aggregate([
      {
        $group: {
          _id: '$location',
          promedio: { $avg: '$score' },
          total: { $sum: 1 }
        }
      },
      {
        $sort: { promedio: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'locations',
          localField: '_id',
          foreignField: '_id',
          as: 'location'
        }
      },
      {
        $unwind: '$location'
      },
      {
        $project: {
          _id: 0,
          locationId: '$location._id',
          nombre: '$location.name',
          promedio: { $round: ['$promedio', 1] },
          total
        }
      }
    ]);

    return NextResponse.json(ranking, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error al obtener ranking', error: error.message }, { status: 500 });
  }
}
