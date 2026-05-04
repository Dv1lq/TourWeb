"use client";

import { useEffect, useState } from "react";
import { CloudSun, Loader2, Wind } from "lucide-react";

type Weather = {
  temperature: number;
  windSpeed: number;
  source: string;
};

export function WeatherWidget({ city, lat, lon }: { city: string; lat: number; lon: number }) {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams({
      city,
      lat: String(lat),
      lon: String(lon)
    });

    fetch(`/api/weather?${params.toString()}`)
      .then((response) => response.json())
      .then((payload) => setWeather(payload.weather))
      .finally(() => setLoading(false));
  }, [city, lat, lon]);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-950">
        <CloudSun className="h-5 w-5 text-ember" />
        Погода в точке маршрута
      </h2>
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          Получаем прогноз
        </div>
      ) : weather ? (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Температура</div>
            <div className="mt-1 text-2xl font-bold text-slate-950">{Math.round(weather.temperature)}°C</div>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Wind className="h-3.5 w-3.5" />
              Ветер
            </div>
            <div className="mt-1 text-2xl font-bold text-slate-950">{Math.round(weather.windSpeed)} км/ч</div>
          </div>
          <p className="col-span-2 text-xs text-slate-500">Источник: {weather.source}</p>
        </div>
      ) : (
        <p className="text-sm text-slate-600">Прогноз временно недоступен.</p>
      )}
    </div>
  );
}
