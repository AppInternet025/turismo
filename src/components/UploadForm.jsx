"use client"; 

import React, { useState } from "react";

const UploadForm = () => {
  // Estado de las imágenes seleccionadas, previsualización y mensajes
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [message, setMessage] = useState("");
  const [showChooseButton, setShowChooseButton] = useState(true); // Estado para mostrar/ocultar el botón

  // Función para manejar la selección de archivos
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validImages = [];
    const previews = [];

    // Validar cada archivo
    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setMessage("Solo se permiten archivos de imagen.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // Tamaño máximo de 5MB
        setMessage("La imagen es demasiado pesada. Máximo 5MB.");
        return;
      }
      validImages.push(file);
      previews.push(URL.createObjectURL(file)); // Previsualizar la imagen
    });

    if (validImages.length === 0) {
      setMessage("No hay archivos válidos para subir.");
    } else {
      setImages(validImages);
      setPreviewImages(previews);
      setShowConfirmation(true); // Mostrar la confirmación después de seleccionar archivos
      setMessage("");
      setShowChooseButton(false); // Ocultar el botón de elegir archivo
    }
  };

  // Función para cancelar el proceso de subida
  const handleCancel = () => {
    setImages([]);
    setPreviewImages([]);
    setShowConfirmation(false); // Ocultar la confirmación
    setShowChooseButton(true); // Mostrar el botón de elegir archivo
  };

  // Función para confirmar y subir las imágenes a Cloudinary
  const handleConfirmUpload = async () => {
    if (images.length === 0) {
      setMessage("Selecciona al menos una imagen válida para subir.");
      return;
    }

    try {
      const urls = [];
      for (let i = 0; i < images.length; i++) {
        const formData = new FormData();
        formData.append("file", images[i]);
        formData.append("upload_preset", "hxlmnpnj"); // Ajusta el preset según tu configuración en Cloudinary

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/drzxn88tz/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();
        urls.push(data.secure_url); // Obtener URL segura de la imagen subida
      }

      setMessage(`Fotos subidas correctamente: ${urls.length}`);
      setImages([]);
      setPreviewImages([]);
      setShowConfirmation(false); // Ocultar la confirmación después de subir las imágenes
      setShowChooseButton(true); // Mostrar el botón de elegir archivo nuevamente
    } catch (error) {
      setMessage("Error al subir imágenes.");
    }
  };

  // UI principal
  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-lg">
      {/* Input para seleccionar archivos */}
      {showChooseButton && (
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="mb-6 block w-full text-sm text-gray-500 file:py-2 file:px-4 file:border file:border-blue-500 file:rounded-lg file:bg-blue-500 file:text-white hover:file:bg-blue-600"
        />
      )}
      
      {/* Confirmación para subir imágenes */}
      {showConfirmation && (
        <div className="mt-6 p-6 border border-gray-300 rounded-md shadow-lg">
          <p className="text-lg font-semibold text-center text-gray-700">
            ¿Deseas subir estas imágenes?
          </p>
          <div className="mt-4 grid grid-cols-3 gap-4 justify-center">
            {previewImages.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`preview-${index}`}
                className="w-24 h-24 object-cover rounded-md border-2 border-gray-300"
              />
            ))}
          </div>
          <div className="mt-6 flex justify-around">
            <button
              onClick={handleCancel}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-200"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmUpload}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
      
      {/* Mensajes de error o éxito */}
      <p className="mt-4 text-center text-red-500 font-semibold">{message}</p>
    </div>
  );
};

export default UploadForm;
