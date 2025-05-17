// src/app/add/page.js
'use client'; // Necesario para el formulario y el router

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // ¡Importante: de 'next/navigation'!
import axios from 'axios';
import Link from 'next/link';
import LocationForm from '@/components/LocationForm'; // Ajusta si es necesario

export default function AddLocationPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState('');

  const handleAddLocation = async (formData) => {
    setSubmitError('');
    try {
      // La URL es relativa al dominio
      await axios.post('/api/locations', formData);
      alert('¡Lugar agregado con éxito!'); // O usa una notificación toast
      router.push('/'); // Redirige a la página principal
    } catch (error) {
      console.error('Error al agregar el lugar:', error);
      const errorMessage = error.response?.data?.message || error.message || 'No se pudo agregar el lugar.';
       // Extraer errores específicos si existen
       let errorsToShow = errorMessage;
       if(error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
           errorsToShow += `\nDetalles: ${error.response.data.errors.join(', ')}`;
       }
       setSubmitError(errorsToShow);
       // Lanzar error para que el formulario lo pueda atrapar si está configurado para ello
       // throw new Error(errorMessage);
       // O simplemente mostrar el error arriba del form
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Agregar Nuevo Lugar</h1>
        <Link href="/" className="btn btn-secondary">
          Volver al Listado
        </Link>
      </div>
      {submitError && (
         <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
            <p className="font-semibold">Error al guardar:</p>
            <p className="whitespace-pre-wrap">{submitError}</p> {/* whitespace-pre-wrap para respetar saltos de línea */}
        </div>
      )}
      {/* Pasar la función de submit al formulario */}
      <LocationForm onSubmit={handleAddLocation} isEditing={false} />
    </div>
  );
}