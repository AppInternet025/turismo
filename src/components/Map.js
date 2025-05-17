import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Importa los assets de Leaflet (necesario para los iconos)
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-shadow.png';

const Map = () => {
  const mapRef = useRef(null);
  const [drawnRoutePoints, setDrawnRoutePoints] = useState([]);
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [currentRouteToSimulate, setCurrentRouteToSimulate] = useState(null);
  const [simulationPosition, setSimulationPosition] = useState(0);
  const [simulationIntervalId, setSimulationIntervalId] = useState(null);

  useEffect(() => {
    // Inicializar el mapa al montar el componente
    if (!mapRef.current) {
      mapRef.current = L.map('mapid').setView([-42.4833, -73.7667], 13); // Coordenadas de Castro como centro
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);

      // Evento para dibujar puntos en el mapa
      mapRef.current.on('click', handleMapClick);
    }

    // Cargar las rutas guardadas al montar el componente
    loadSavedRoutes();

    return () => {
      // Limpiar el mapa al desmontar el componente
      if (mapRef.current) {
        mapRef.current.remove();
      }
      // Limpiar el intervalo de simulación si existe
      if (simulationIntervalId) {
        clearInterval(simulationIntervalId);
      }
    };
  }, []);

  useEffect(() => {
    // Redibujar la ruta dibujada cuando cambian los puntos
    if (mapRef.current && drawnRoutePoints.length > 1) {
      L.polyline(drawnRoutePoints).addTo(mapRef.current);
    } else if (mapRef.current && drawnRoutePoints.length === 1) {
      L.marker(drawnRoutePoints[0]).addTo(mapRef.current);
    }
  }, [drawnRoutePoints]);

  useEffect(() => {
    // Mostrar las rutas guardadas en el mapa
    if (mapRef.current && savedRoutes.length > 0) {
      savedRoutes.forEach(route => {
        if (route.coordinates && route.coordinates.length > 1) {
          L.polyline(route.coordinates, { color: 'blue' }).addTo(mapRef.current).bindPopup(route.name || 'Ruta Guardada');
        } else if (route.coordinates && route.coordinates.length === 1) {
          L.marker(route.coordinates[0]).addTo(mapRef.current).bindPopup(route.name || 'Punto Guardado');
        }
      });
    }
  }, [savedRoutes]);

  useEffect(() => {
    // Simular el movimiento GPS a lo largo de la ruta seleccionada
    if (mapRef.current && currentRouteToSimulate && currentRouteToSimulate.coordinates.length > 1) {
      if (simulationIntervalId) {
        clearInterval(simulationIntervalId);
      }
      const interval = setInterval(() => {
        setSimulationPosition((prevPosition) => {
          const newPosition = prevPosition + 1;
          if (newPosition < currentRouteToSimulate.coordinates.length) {
            // Remover el marcador anterior
            mapRef.current.eachLayer(layer => {
              if (layer instanceof L.Marker && layer._simulated) {
                mapRef.current.removeLayer(layer);
              }
            });
            // Añadir el nuevo marcador
            L.marker(currentRouteToSimulate.coordinates[newPosition], { _simulated: true }).addTo(mapRef.current).bindPopup('Simulación GPS');
            return newPosition;
          } else {
            clearInterval(interval);
            setSimulationIntervalId(null);
            return 0; // Reiniciar la simulación
          }
        });
      }, 1000); // Intervalo de 1 segundo
      setSimulationIntervalId(interval);
      setSimulationPosition(0); // Reiniciar la posición de la simulación
    } else if (simulationIntervalId) {
      clearInterval(simulationIntervalId);
      setSimulationIntervalId(null);
    }
  }, [currentRouteToSimulate, mapRef]);

  const handleMapClick = (e) => {
    setDrawnRoutePoints([...drawnRoutePoints, [e.latlng.lat, e.latlng.lng]]);
  };

  const handleSaveRoute = async (routeName) => {
    if (drawnRoutePoints.length < 2) {
      alert('Por favor, dibuja al menos dos puntos para guardar una ruta.');
      return;
    }

    const response = await fetch('/api/routes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: routeName, coordinates: drawnRoutePoints }),
    });

    if (response.ok) {
      alert('Ruta guardada correctamente.');
      setDrawnRoutePoints([]);
      loadSavedRoutes(); // Recargar las rutas guardadas
    } else {
      alert('Hubo un error al guardar la ruta.');
    }
  };

  const loadSavedRoutes = async () => {
    const response = await fetch('/api/routes');
    if (response.ok) {
      const data = await response.json();
      setSavedRoutes(data);
    } else {
      console.error('Error al cargar las rutas guardadas.');
    }
  };

  const handleSimulateRoute = (route) => {
    setCurrentRouteToSimulate(route);
  };

  return (
    <div className="relative w-full h-96">
      <div id="mapid" className="w-full h-full z-0"></div>
      <div className="absolute top-2 left-2 bg-white p-4 rounded shadow-md z-10">
        <h2 className="text-lg font-semibold mb-2">Crear Nueva Ruta</h2>
        <button onClick={() => setDrawnRoutePoints([])} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-2">
          Limpiar Ruta
        </button>
        <input
          type="text"
          placeholder="Nombre de la ruta"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
          id="routeName"
        />
        <button onClick={() => handleSaveRoute(document.getElementById('routeName').value)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Guardar Ruta
        </button>
      </div>
      <div className="absolute top-2 right-2 bg-white p-4 rounded shadow-md z-10 max-h-48 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-2">Rutas Guardadas</h2>
        <ul>
          {savedRoutes.map(route => (
            <li key={route._id} className="flex items-center justify-between py-1">
              <span>{route.name || 'Ruta sin nombre'}</span>
              <button onClick={() => handleSimulateRoute(route)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm">
                Simular
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Map;