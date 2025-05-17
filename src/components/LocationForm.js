// src/components/LocationForm.js
'use client'; // <-- ¡IMPORTANTE para componentes interactivos!

// frontend/components/LocationForm.js
import { useState, useEffect } from 'react';

function LocationForm({ onSubmit, initialData = {}, isEditing = false }) {
  const [formData, setFormData] = useState({
    name: '',
    photoUrl: '',
    description: '',
    ubi_lat: '',
    ubi_lng: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Poblar el formulario si hay datos iniciales (para editar)
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        name: initialData.name || '',
        photoUrl: initialData.photoUrl || '',
        description: initialData.description || '',
        ubi_lat: initialData.ubi_lat !== undefined ? String(initialData.ubi_lat) : '',
        ubi_lng: initialData.ubi_lng !== undefined ? String(initialData.ubi_lng) : '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Limpiar error específico al cambiar el campo
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio.';
    if (!formData.photoUrl.trim()) newErrors.photoUrl = 'La URL de la foto es obligatoria.';
    // Validación básica de URL (puedes mejorarla)
    try {
      new URL(formData.photoUrl);
    } catch (_) {
      newErrors.photoUrl = 'La URL de la foto no es válida.';
    }
    if (!formData.description.trim()) newErrors.description = 'La descripción es obligatoria.';

    const lat = parseFloat(formData.ubi_lat);
    const lng = parseFloat(formData.ubi_lng);

    if (isNaN(lat)) {
        newErrors.ubi_lat = 'La latitud debe ser un número.';
    } else if (lat < -90 || lat > 90) {
        newErrors.ubi_lat = 'La latitud debe estar entre -90 y 90.';
    }

    if (isNaN(lng)) {
        newErrors.ubi_lng = 'La longitud debe ser un número.';
    } else if (lng < -180 || lng > 180) {
        newErrors.ubi_lng = 'La longitud debe estar entre -180 y 180.';
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      setErrors({}); // Limpiar errores generales antes de enviar
      try {
        // Llama a la función onSubmit pasada como prop
        await onSubmit({
          ...formData,
          ubi_lat: parseFloat(formData.ubi_lat), // Asegura que se envíen como números
          ubi_lng: parseFloat(formData.ubi_lng),
        });
        // Resetear formulario solo si no es edición (o si quieres resetear siempre)
        if (!isEditing) {
          setFormData({ name: '', photoUrl: '', description: '', ubi_lat: '', ubi_lng: '' });
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        // Mostrar error general o errores específicos de la API si los devuelve el backend
         setErrors({ form: error.message || 'Ocurrió un error al guardar.' });
         if (error.response?.data?.errors) {
            // Si el backend devuelve errores específicos por campo
             const backendErrors = error.response.data.errors.reduce((acc, msg) => {
                // Intenta mapear mensajes a campos si es posible (requiere ajuste según respuesta del backend)
                if (msg.toLowerCase().includes('nombre')) acc.name = msg;
                else if (msg.toLowerCase().includes('foto')) acc.photoUrl = msg;
                else if (msg.toLowerCase().includes('descripción')) acc.description = msg;
                else if (msg.toLowerCase().includes('latitud')) acc.ubi_lat = msg;
                else if (msg.toLowerCase().includes('longitud')) acc.ubi_lng = msg;
                else if(!acc.form) acc.form = msg; // Error general si no se mapea
                return acc;
            }, {});
             setErrors(prev => ({ ...prev, ...backendErrors }));
         } else if (error.response?.data?.message) {
            setErrors({ form: error.response.data.message });
         }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto p-6 bg-white rounded shadow-md">
       {errors.form && <p className="text-red-500 text-sm mb-4">{errors.form}</p>}
      <div>
        <label htmlFor="name" className="label">Nombre del Lugar</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`input-field ${errors.name ? 'border-red-500' : ''}`}
          aria-describedby="name-error"
        />
        {errors.name && <p id="name-error" className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="photoUrl" className="label">URL de la Foto</label>
        <input
          type="url"
          id="photoUrl"
          name="photoUrl"
          value={formData.photoUrl}
          onChange={handleChange}
          placeholder="https://ejemplo.com/imagen.jpg"
          className={`input-field ${errors.photoUrl ? 'border-red-500' : ''}`}
           aria-describedby="photoUrl-error"
        />
         {errors.photoUrl && <p id="photoUrl-error" className="text-red-500 text-xs mt-1">{errors.photoUrl}</p>}
      </div>

      <div>
        <label htmlFor="description" className="label">Descripción</label>
        <textarea
          id="description"
          name="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
          className={`input-field ${errors.description ? 'border-red-500' : ''}`}
          aria-describedby="description-error"
        ></textarea>
        {errors.description && <p id="description-error" className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="ubi_lat" className="label">Latitud (Ubi_Lat)</label>
          <input
            type="number"
            step="any" // Permite decimales
            id="ubi_lat"
            name="ubi_lat"
            value={formData.ubi_lat}
            onChange={handleChange}
            placeholder="-90 a 90"
             className={`input-field ${errors.ubi_lat ? 'border-red-500' : ''}`}
             aria-describedby="ubi_lat-error"
          />
           {errors.ubi_lat && <p id="ubi_lat-error" className="text-red-500 text-xs mt-1">{errors.ubi_lat}</p>}
        </div>
        <div>
          <label htmlFor="ubi_lng" className="label">Longitud (Ubi_Lng)</label>
          <input
            type="number"
            step="any" // Permite decimales
            id="ubi_lng"
            name="ubi_lng"
            value={formData.ubi_lng}
            onChange={handleChange}
            placeholder="-180 a 180"
            className={`input-field ${errors.ubi_lng ? 'border-red-500' : ''}`}
            aria-describedby="ubi_lng-error"
          />
          {errors.ubi_lng && <p id="ubi_lng-error" className="text-red-500 text-xs mt-1">{errors.ubi_lng}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full disabled:opacity-50"
      >
        {loading ? 'Guardando...' : (isEditing ? 'Actualizar Lugar' : 'Agregar Lugar')}
      </button>
    </form>
  );
}

export default LocationForm;