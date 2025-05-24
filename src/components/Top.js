'use client';
import { useEffect, useState } from 'react';

export default function RankingTop() {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    fetch('/api/puntuacion')
      .then(res => res.json())
      .then(data => setRanking(data));
  }, []);

  return (
    <div>
      <h3>Top 10 lugares mejor puntuados</h3>
      <ul>
        {ranking.map((item, i) => (
          <li key={i}>
            Lugar ID: {item._id} - ⭐ {item.promedio.toFixed(1)} ({item.total} votos)
          </li>
        ))}
      </ul>
    </div>
  );
}
