// src/app/page.js
'use client'; // <-- Necesario por useState, useEffect, onClick

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
// Ajusta la ruta si es necesario, pero con @/* debería funcionar
import MapDisplay from '@/components/MapDisplay';

export default function AdminLugaresClient() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLocations = async () => {
    setLoading(true);
    setError('');
    try {
      // Las llamadas a API ahora son relativas al dominio actual
      const { data } = await axios.get('/api/locations');
      setLocations(data);
    } catch (err) {
      console.error('Error al cargar los lugares:', err);
      setError(err.response?.data?.message || err.message || 'No se pudieron cargar los lugares.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este lugar?')) {
      try {
        await axios.delete(`/api/locations/${id}`);
        // Optimista: remover localmente y luego refrescar por si acaso
         setLocations(currentLocations => currentLocations.filter(loc => loc._id !== id));
        // O simplemente refrescar todo:
        // fetchLocations();
      } catch (err) {
        console.error('Error al eliminar el lugar:', err);
        alert(err.response?.data?.message || err.message || 'No se pudo eliminar el lugar.');
        // Si falló, podríamos volver a cargar para restaurar el estado
        // fetchLocations();
      }
    }
  };

  // El JSX es muy similar al de pages/index.js anterior
  return (
    <div> {/* Envuelve en un div o fragmento */}
      <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
        <h1 className="text-3xl font-bold">Administración de Lugares</h1>
        <Link href="/admin-add-lugar" className="btn btn-primary">
          Agregar Nuevo Lugar
        </Link>
      </div>

      {/* Mostrar Mapa */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Mapa de Lugares</h2>
        <div className="bg-white p-1 rounded shadow overflow-hidden"> {/* overflow-hidden ayuda */}
          {/* Asegúrate que el contenedor o MapDisplay tengan tamaño */}
           <MapDisplay locations={locations} />
        </div>
      </div>

      {/* Mostrar Tabla de Lugares */}
      <h2 className="text-2xl font-semibold mb-4">Listado de Lugares</h2>
      {loading && <p className="text-center my-4">Cargando lugares...</p>}
      {error && <p className="text-red-600 bg-red-100 p-3 rounded my-4 text-center">Error: {error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                 {/* ... (igual que antes: th para Foto, Nombre, Desc, Lat, Lng, Acciones) ... */}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Descripción</th> {/* Ocultar en móvil */}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latitud</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Longitud</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {locations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 whitespace-nowrap text-sm text-gray-500 text-center">
                    No hay lugares registrados.
                  </td>
                </tr>
              ) : (
                locations.map((location) => (
                  <tr key={location._id}>
                    {/* ... (igual que antes: td para imagen, datos, botones editar/eliminar) ... */}
                    <td className="px-6 py-4 whitespace-nowrap">
                       <Image
                        src={location.photoUrl || '/placeholder-image.png'}
                        alt={location.name || 'Lugar sin nombre'}
                        width={50}
                        height={50}
                        className="h-12 w-12 rounded object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src='/placeholder-image.png'; }}
                        unoptimized={true} // Considera optimizar si son pocas imágenes o de un dominio conocido
                       />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{location.name}</td>
                     <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-xs truncate hidden sm:table-cell" title={location.description}>
                      {location.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.ubi_lat?.toFixed(6) ?? 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.ubi_lng?.toFixed(6) ?? 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Link href={`/edit/${location._id}`} className="text-indigo-600 hover:text-indigo-900">
                         Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(location._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}