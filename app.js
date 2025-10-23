// 1. Inicializa o mapa (em uma posição padrão, se necessário)
const map = L.map("mapid").setView([0, 0], 2); // [lat, lng], zoom

// 2. Adiciona a camada base (OpenStreetMap é comum)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

//Aqui vou definir uma variavel chamada pathcoords que vai armazenar as coordenadas do caminho
let pathCoords = []; 
// que isso essa ia do vsCode é muito boa 
// Variável para armazenar o marcador do usuário
let userMarker = null;
let userCircle = null; // Opcional: para mostrar a precisão
let iniciar =false;
let distancia = 0;
let startTime = null;   
let velocidade = 0;
let polyline = null;
function IniciarCorrida() {
  iniciar = true;
  distancia = 0;
  startTime = Date.now()
    pathCoords = [];
  document.getElementById('stopBtn').style.display = 'inline-block';
  document.getElementById('startBtn').style.display = 'none';
  alert("Corrida Iniciada!");
}

function PararCorrida() {
  iniciar = false;
  document.getElementById('stopBtn').style.display = 'none';
   document.getElementById('startBtn').style.display = 'inline-block';
  alert("Corrida Finalizada!");
}
function onLocationUpdate(position) {
   if (!iniciar) return;
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  const accuracy = position.coords.accuracy;
  const latLng = [lat, lng];

  if(pathCoords.length >1){

  const ultimoponto = pathCoords[pathCoords.length -2];
  distancia += map.distance(ultimoponto, latLng);
  
    
  const tempoDecorrido = (Date.now() - startTime) / 1000; 
  velocidade = (distancia / tempoDecorrido) * 3.6; 
  document.getElementById('info').textContent =  `Distância: ${distancia.toFixed(2)} m | Velocidade: ${velocidade.toFixed(2)} km/h )`;

}

  pathCoords.push(latLng);

  if(polyline ){ 
    polyline.setLatLngs(pathCoords);
  } else {
    polyline = L.polyline(pathCoords, {color: '#27D6C6'}).addTo(map);
  }
  // Se o mapa não estiver centralizado na primeira atualização, centraliza
  if (!userMarker) {
    map.setView(latLng, 16); // Zoom mais próximo
  }

  // 1. Atualiza ou cria o marcador (pino)
  if (userMarker) {
    userMarker.setLatLng(latLng);
  } else {
    userMarker = L.marker(latLng)
      .addTo(map)
      .bindPopup("Você está aqui!")
      .openPopup();
  }

  // 2. Atualiza ou cria o círculo de precisão (opcional, mas recomendado)

  if (userCircle) {
    userCircle.setLatLng(latLng).setRadius(accuracy);
  } else {
    userCircle = L.circle(latLng, { radius: accuracy }).addTo(map);
  }

  console.log(`Nova posição: Lat ${lat}, Lng ${lng}, Precisão: ${accuracy}m`);
}

function onLocationError(error) {
  let message = "";
  switch (error.code) {
    case error.PERMISSION_DENIED:
      message = "Permissão de geolocalização negada pelo usuário.";
      break;
    case error.POSITION_UNAVAILABLE:
      message = "Informação de localização indisponível.";
      break;
    case error.TIMEOUT:
      message = "Tempo limite excedido ao tentar obter a localização.";
      break;
    default:
      message = "Um erro desconhecido ocorreu: " + error.message;
      break;
  }
  alert("Erro de Geolocalização: " + message);
}

// Opções de rastreamento (recomenda-se alta precisão)
const watchOptions = {
  enableHighAccuracy: true, // Tenta usar GPS para maior precisão
  timeout: 5000, // Tempo máximo para tentar obter a posição
  maximumAge: 0, // Não usa posições armazenadas em cache
};

// Inicia o rastreamento em tempo real
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    onLocationUpdate,
    onLocationError,
    watchOptions
  );
} else {
  alert("Seu navegador não suporta Geolocalização.");
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(() => console.log('Service Worker registrado!'))
    .catch((err) => console.log('Erro ao registrar SW:', err));
}
