import Image from "next/image";

export default function Home() {

    
  function initMap() {

      const centroChiloe = { lat: -42.6223, lng: -73.7500 };

      
      const map = new google.maps.Map(document.getElementById("map"), {
          zoom: 10,
          center: centroChiloe
      });

      const lugares = [
          { lat: -42.6126, lng: -73.9790, title: 'Castro', descripcion: 'Capital de Chiloé, conocida por sus coloridas casas flotantes.' },
          { lat: -42.6110, lng: -73.7340, title: 'Dalcahue', descripcion: 'Famoso por su iglesia y el mercado artesanal.' },
          { lat: -42.4272, lng: -73.6531, title: 'Ancud', descripcion: 'Puerto histórico y uno de los primeros asentamientos en la isla.' },
          { lat: -42.8694, lng: -73.9281, title: 'Puqueldón', descripcion: 'Un tranquilo pueblo rodeado de naturaleza y paisajes hermosos.' }
      ];


      const infoWindow = new google.maps.InfoWindow();


      lugares.forEach(function(lugar) {
          const marcador = new google.maps.Marker({
              position: { lat: lugar.lat, lng: lugar.lng },
              map: map,
              title: lugar.title
          });


          marcador.addListener('click', function() {
              infoWindow.setContent(`
                  <h3>${lugar.title}</h3>
                  <p>${lugar.descripcion}</p>
              `);
              infoWindow.open(map, marcador);
          });
      });
  }


  return (

    <body>
        <h1>Mapa de la Isla Grande de Chiloé, Chile</h1>
        <div id="map"></div>
    
        <script src="https://maps.googleapis.com/maps/api/js?key=CLAVE_API&callback=initMap" 
        async defer></script>
    
       
    </body>
  );
}
