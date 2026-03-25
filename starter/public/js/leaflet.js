/* eslint-disable */
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export const displayMap = (locations) => {
  const map = L.map('map', { zoomControl: false }).setView([0, 0], 2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  const customIcon = L.icon({
    iconUrl: '/img/pin.png',
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40],
  });

  const points = [];

  locations.forEach((loc) => {
    const coord = [loc.coordinates[1], loc.coordinates[0]];
    points.push(coord);

    L.marker(coord, { icon: customIcon })
      .addTo(map)
      .bindPopup(`<p>Day ${loc.day}: <strong>${loc.description}</strong></p>`, {
        autoClose: false,
      })
      .on('mouseover', function () {
        this.openPopup();
      })
      .on('mouseout', function () {
        this.closePopup();
      });
  });

  const bounds = L.latLngBounds(points);
  map.fitBounds(bounds);
};
