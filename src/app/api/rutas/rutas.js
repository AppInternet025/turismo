import Map  from "../components/Map";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mapa de Rutas GPS</h1>
      <Map />
    </div>
  );
}