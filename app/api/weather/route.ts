import { NextResponse } from "next/server";

const fallbackWeather: Record<string, { temperature: number; windSpeed: number }> = {
  Казань: { temperature: 14, windSpeed: 12 },
  Москва: { temperature: 13, windSpeed: 10 },
  "Санкт-Петербург": { temperature: 10, windSpeed: 15 },
  Байкал: { temperature: 6, windSpeed: 18 },
  Тбилиси: { temperature: 22, windSpeed: 8 },
  Дубай: { temperature: 32, windSpeed: 13 }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") ?? "Казань";
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ error: "Некорректные координаты" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m`,
      { next: { revalidate: 1800 } }
    );

    if (!response.ok) {
      throw new Error("Open-Meteo unavailable");
    }

    const data = await response.json();
    return NextResponse.json({
      weather: {
        temperature: data.current.temperature_2m,
        windSpeed: data.current.wind_speed_10m,
        source: "Open-Meteo"
      }
    });
  } catch {
    const fallback = fallbackWeather[city] ?? { temperature: 18, windSpeed: 10 };
    return NextResponse.json({
      weather: {
        ...fallback,
        source: "fallback mock"
      }
    });
  }
}
