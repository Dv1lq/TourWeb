"use client";

import { MapContainer, Marker, Popup, Polyline, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

type Point = { title: string; lat: number; lng: number };

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});


function MapAttributionPrefix() {
  const map = useMap();

  useEffect(() => {
    map.attributionControl.setPrefix("Leaflet");
  }, [map]);

  return null;
}

export function TourMap({ title, coordinates, routePoints }: { title: string; coordinates: { lat: number; lng: number }; routePoints: Point[] }) {
  const points = routePoints.length ? routePoints : [{ title, ...coordinates }];

  return (
    <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]" id="tour-map">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <MapContainer center={[coordinates.lat, coordinates.lng]} zoom={13} className="h-80 w-full" scrollWheelZoom={false}>
          <MapAttributionPrefix />
          <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {points.map((point) => (
            <Marker key={`${point.title}-${point.lat}-${point.lng}`} position={[point.lat, point.lng]} icon={icon}>
              <Popup>{point.title}</Popup>
            </Marker>
          ))}
          {points.length > 1 && <Polyline positions={points.map((point) => [point.lat, point.lng] as [number, number])} />}
        </MapContainer>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-slate-950">Маршрут на карте</h2>
        <ol className="grid gap-3">
          {points.map((point, index) => (
            <li key={`${point.title}-${index}`} className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700">
              <span className="font-semibold text-slate-950">{index + 1}. {point.title}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
