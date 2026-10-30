"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Punto = {
  nombre: string;
  lat: number;
  lng: number;
};

type Props = {
  puntos: Punto[];
};

export default function MapaIRIS({ puntos }: Props) {
  const mapaRef = useRef<HTMLDivElement | null>(null);
  const instanciaMapa = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapaRef.current) {
      return;
    }

    // Crear mapa una sola vez
    if (!instanciaMapa.current) {
      instanciaMapa.current = L.map(mapaRef.current).setView(
        [puntos[0].lat, puntos[0].lng],
        10
      );

      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }
      ).addTo(instanciaMapa.current);
    }

    const mapa = instanciaMapa.current;

    // Limpiar capas anteriores excepto el mapa base
    mapa.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) {
        mapa.removeLayer(layer);
      }
    });

    // Icono de Leaflet
    const icono = L.icon({
      iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const trayectoria: [number, number][] = puntos.map(
      (punto) => [punto.lat, punto.lng]
    );

    // Dibujar trayectoria
    L.polyline(trayectoria).addTo(mapa);

    // Dibujar marcadores
    puntos.forEach((punto) => {
      L.marker(
        [punto.lat, punto.lng],
        { icon: icono }
      )
        .addTo(mapa)
        .bindPopup(
          `<strong>${punto.nombre}</strong><br/>` +
          `Latitud: ${punto.lat}<br/>` +
          `Longitud: ${punto.lng}`
        );
    });

    // Ajustar mapa para mostrar todos los puntos
    if (puntos.length > 1) {
      const limites = L.latLngBounds(
        puntos.map((punto) => [
          punto.lat,
          punto.lng,
        ])
      );

      mapa.fitBounds(limites, {
        padding: [30, 30],
      });
    }

    // IMPORTANTE:
    // Leaflet necesita conocer el tamaño real del contenedor
    setTimeout(() => {
      mapa.invalidateSize();
    }, 100);

  }, [puntos]);

  return (
    <div
      ref={mapaRef}
      className="h-[420px] w-full rounded-2xl overflow-hidden"
    />
  );
}