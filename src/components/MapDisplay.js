// frontend/components/MapDisplay.js
'use client';

import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapDisplay = ({ locations }) => {
  const mapStyles = {
    height: "400px", // Puedes ajustar la altura
    width: "100%"
  };

  // Calcula un centro razonable. Podría ser el promedio o el primer lugar.
   // O una ubicación fija si no hay lugares.
   const defaultCenter = {
     lat: locations?.[0]?.ubi_lat || 19.4326, // Centro de CDMX como fallback
     lng: locations?.[0]?.ubi_lng || -99.1332
   };

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return <div className="text-red-500 p-4 bg-red-100 border border-red-400 rounded">Error: Falta la clave API de Google Maps (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY).</div>;
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={locations?.length > 0 ? 10 : 5} // Zoom más cercano si hay lugares
        center={defaultCenter}
      >
        {locations && locations.map((location) => (
          <Marker
            key={location._id} // Usa el _id de MongoDB como key
            position={{ lat: location.ubi_lat, lng: location.ubi_lng }}
            title={location.name} // Muestra el nombre al pasar el mouse
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default MapDisplay;