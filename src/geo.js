

function paraRadianos(graus) {
  return (graus * Math.PI) / 180;
}

export function pontoAleatorio(centro, distanciaMin, distanciaMax) {
  const [lat, lng] = centro;
  const metrosPorGrauLat = 111320;

  const angulo = Math.random() * 2 * Math.PI;
  const distancia = distanciaMin + Math.random() * (distanciaMax - distanciaMin);

  const deslocamentoLat = (distancia * Math.cos(angulo)) / metrosPorGrauLat;
  const deslocamentoLng =
    (distancia * Math.sin(angulo)) /
    (metrosPorGrauLat * Math.cos(paraRadianos(lat)));

  return [lat + deslocamentoLat, lng + deslocamentoLng];
}