'use client';
import { useState } from 'react';

export default function PuntuacionForm({ userId, locationId }) {
  const [score, setScore] = useState(0);

  const enviarPuntuacion = async () => {
    await fetch('/api/puntuacion', {
      method: 'POST',
      body: JSON.stringify({ userId, locationId, score }),
    });
  };

  return (
    <div>
      <h3>Puntúa este lugar:</h3>
      {[1, 2, 3, 4, 5].map(n => (
        <span
          key={n}
          onClick={() => setScore(n)}
          style={{ fontSize: 30, cursor: 'pointer', color: n <= score ? 'gold' : 'gray' }}
        >
          ★
        </span>
      ))}
      <button onClick={enviarPuntuacion}>Enviar</button>
    </div>
  );
}
