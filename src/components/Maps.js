"use client";
import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { initialCities } from '../app/mark-cities/cities';

const containerStyle = {
  width: '100%',
  height: '900px',
};

const center = {
  lat: -42.4813983,
  lng: -73.7701668
};

const MapWithUserComments = () => {
  const [cities, setCities] = useState(initialCities);
  const [selectedCity, setSelectedCity] = useState(null);
  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;

    setCities((prevCities) =>
      prevCities.map((city) =>
        city.id === selectedCity.id
          ? { ...city, comments: [...city.comments, newComment] }
          : city
      )
    );

    setNewComment('');
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={9}>
        {cities.map((city) => (
          <Marker
            key={city.id}
            position={{ lat: city.lat, lng: city.lng }}
            onClick={() => setSelectedCity(city)}
          />
        ))}

        {selectedCity && (
          <InfoWindow
            position={{ lat: selectedCity.lat, lng: selectedCity.lng }}
            onCloseClick={() => setSelectedCity(null)}
          >
            <div style={{ backgroundColor: 'grey'}}>
              <h3>{selectedCity.name}</h3>
              <ul>
                {selectedCity.comments.map((c, i) => (
                  <li key={i}>🗨️ {c}</li>
                ))}
              </ul>
              <br />
              <input 
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe un comentario"
              />
              
              <button onClick={handleCommentSubmit}>Enviar</button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapWithUserComments;
