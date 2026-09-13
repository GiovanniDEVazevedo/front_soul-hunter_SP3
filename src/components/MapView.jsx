import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const playerIcon = new L.DivIcon({
  className: "player-marker",
  html: '<div class="player-dot"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const houseIcon = new L.DivIcon({
  className: "house-marker",
  html: '<div class="house-icon">🏠</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const ghostIcon = new L.DivIcon({
  className: "ghost-marker",
  html: '<div class="ghost-icon">👻</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

function RecenterMap({ position }) {
  const map = useMap();
  if (position) {
    map.setView(position, map.getZoom());
  }
  return null;
}

export default function MapView({
  playerPosition,
  casas,
  casaAtivaId,
  ghostPosition,
  onInvestigate,
  investigating,
}) {
  const center = playerPosition || [-23.55, -46.63];

  const casasVisiveis = (casas || []).filter(
    (c) => c.status === "ativa" && !(ghostPosition && c.id === casaAtivaId)
  );

  return (
    <MapContainer center={center} zoom={17} className="map-container">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RecenterMap position={playerPosition} />

      {playerPosition && (
        <Marker position={playerPosition} icon={playerIcon}>
          <Popup>Você está aqui</Popup>
        </Marker>
      )}

      {playerPosition && (
        <Circle
          center={playerPosition}
          radius={100}
          pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.05 }}
        />
      )}

      {ghostPosition && (
        <Marker position={ghostPosition} icon={ghostIcon}>
          <Popup>Fantasma!</Popup>
        </Marker>
      )}

      {casasVisiveis.map((casa) => (
        <Marker
          key={casa.id}
          position={casa.posicao}
          icon={houseIcon}
          eventHandlers={{
            click: () => onInvestigate(casa),
          }}
        >
          <Popup>
            <button
              onClick={() => onInvestigate(casa)}
              disabled={investigating}
              className="popup-btn"
            >
              {investigating ? "Investigando..." : "Investigar Casa"}
            </button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}