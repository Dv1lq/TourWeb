"use client";

import dynamic from "next/dynamic";

const TourMap = dynamic(() => import("@/components/TourMap").then((mod) => mod.TourMap), {
  ssr: false,
  loading: () => <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600">Карта временно недоступна</div>
});

export function TourMapSection({ title, coordinates, routePoints }: { title: string; coordinates: { lat: number; lng: number }; routePoints: { title: string; lat: number; lng: number }[] }) {
  return <TourMap title={title} coordinates={coordinates} routePoints={routePoints} />;
}
