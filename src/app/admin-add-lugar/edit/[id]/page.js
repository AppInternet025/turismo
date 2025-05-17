// src/app/edit/[id]/page.js
'use client'; // Necesario para hooks, fetch, form, router

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; // ¡Importante: de 'next/navigation'!
import axios from 'axios';
import Link from 'next/link';
import LocationForm from '@/components/LocationForm';

export default function EditLocationPage() {
  const router = useRouter();
  const params = useParams(); // Hook para obtener parámetros de ruta
  const id = params?.id; // Obtiene el ID de la URL

  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchLocation = async () => {
      if (!id) {
         setLoading(false);
         setError("No se proporcionó un ID de lugar.");
         return;
      };
      setLoading(true);
      setError('');
      try {
        const { data } = await axios.get(`/api/locations/${id}`);
        setLocation(data);
      } catch (err) {
        console.error('Error al cargar el lugar:', err);
        setError(err.response?.data?.message || err.message || 'No se pudo cargar la información del lugar.');
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id]); // Re-ejecutar si el ID cambia

  const handleUpdateLocation = async (formData) => {
    setSubmitError('');
    if (!id) return; // No hacer nada si no hay ID

    try {
      await axios.put(`/api/locations/${id}`, formData);
      alert('¡Lugar actualizado con éxito!');
      router.push('/'); // Volver al listado
    } catch (error) {
      console.error('Error al actualizar el lugar:', error);
       const errorMessage = error.response?.data?.message || error.message || 'No se pudo actualizar el lugar.';
        let errorsToShow = errorMessage;
       if(error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
           errorsToShow += `\nDetalles: ${error.response.data.errors.join(', ')}`;
       }
       setSubmitError(errorsToShow);
      // throw new Error(errorMessage); // Para que el form lo atrape si es necesario
    }
  };

  if (loading) return <p className="text-center mt-10 text-lg">Cargando datos del lugar...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">Error: {error}</p>;
  if (!location) return <p className="text-center mt-10">Lugar no encontrado.</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Editar Lugar: <span className="font-normal">{location.name}</span></h1>
        <Link href="/" className="btn btn-secondary">
          Volver al Listado
        </Link>
      </div>
       {submitError && (
         <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
            <p className="font-semibold">Error al guardar:</p>
            <p className="whitespace-pre-wrap">{submitError}</p>
        </div>
      )}
      {/* Pasa los datos iniciales y la función de submit al formulario */}
      <LocationForm
        onSubmit={handleUpdateLocation}
        initialData={location}
        isEditing={true}
      />
    </div>
  );
}