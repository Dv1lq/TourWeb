import type { RoutePoint } from "@/lib/types";

export function RouteMap({ route }: { route: RoutePoint[] }) {
  const first = route[0];

  if (!first) {
    return null;
  }

  const bbox = `${first.lon - 0.04}%2C${first.lat - 0.03}%2C${first.lon + 0.04}%2C${first.lat + 0.03}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${first.lat}%2C${first.lon}`;

  return (
    <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <iframe title="Карта маршрута" src={src} className="h-80 w-full" loading="lazy" />
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-slate-950">Маршрут и координаты</h2>
        <ol className="grid gap-3">
          {route.map((point, index) => (
            <li key={`${point.title}-${index}`} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <div className="text-sm font-bold text-slate-950">
                {index + 1}. {point.title}
              </div>
              <div className="mt-1 text-sm text-slate-600">{point.note}</div>
              <div className="mt-2 text-xs font-medium text-slate-500">
                {point.lat.toFixed(4)}, {point.lon.toFixed(4)}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
