import PuntuacionForm from '@/components/PuntuacionForm';
import RankingTop from '@/components/RankingTop';

export default function PuntuacionPage() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Sección de Puntuaciones</h2>
      <PuntuacionForm userId="64b..." locationId="64c..." />
      <hr />
      <RankingTop />
    </div>
  );
}
