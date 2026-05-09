"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, Loader2, RotateCcw } from "lucide-react";
import type { TourView } from "@/lib/types";
import { EmptyState } from "@/components/EmptyState";
import { TourCard } from "@/components/TourCard";
import { buildTourFilterOptions } from "@/lib/tour-filter-options";

const initialFilters = {
  q: "",
  country: "",
  city: "",
  maxPrice: "",
  priceCurrency: "USD",
  minRating: "",
  maxDuration: "",
  category: "",
  language: "",
  certified: false,
  sort: "rating"
};

export function CatalogClient() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState(() => ({
    ...initialFilters,
    q: searchParams.get("q") ?? "",
    country: searchParams.get("country") ?? "",
    city: searchParams.get("city") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
    priceCurrency: searchParams.get("priceCurrency") ?? "USD",
    minRating: searchParams.get("minRating") ?? "",
    category: searchParams.get("category") ?? "",
    language: searchParams.get("language") ?? "",
    certified: searchParams.get("certified") === "true"
  }));
  const [tours, setTours] = useState<TourView[]>([]);
  const [allTours, setAllTours] = useState<TourView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const query = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (typeof value === "boolean") {
        if (value) params.set(key, "true");
      } else if (value) {
        params.set(key, value);
      }
    });
    return params.toString();
  }, [filters]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    fetch(`/api/tours?${query}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Не удалось загрузить экскурсии");
        }
        return response.json();
      })
      .then((payload) => setTours(payload.tours))
      .catch((requestError) => {
        if (requestError.name !== "AbortError") {
          setError(requestError.message);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [query]);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/tours", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Не удалось загрузить фильтры");
        }
        return response.json();
      })
      .then((payload) => setAllTours(payload.tours))
      .catch(() => {});

    return () => controller.abort();
  }, []);

  const { countries, cities, categories, languages } = useMemo(() => buildTourFilterOptions(allTours), [allTours]);

  function update(field: keyof typeof filters, value: string | boolean) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  function reset() {
    setFilters(initialFilters);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-950">
            <Filter className="h-5 w-5 text-brand" />
            Фильтры
          </h2>
          <button className="btn-secondary px-3 py-2" type="button" onClick={reset} aria-label="Сбросить фильтры">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-4">
          <label>
            <span className="label">Поиск</span>
            <input className="field mt-1" value={filters.q} onChange={(event) => update("q", event.target.value)} placeholder="Название или место" />
          </label>
          <label>
            <span className="label">Страна</span>
            <select className="field mt-1" value={filters.country} onChange={(event) => update("country", event.target.value)}>
              {countries.map((country) => (
                <option key={country || "all"} value={country}>
                  {country || "Все"}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="label">Город/регион</span>
            <select className="field mt-1" value={filters.city} onChange={(event) => update("city", event.target.value)}>
              {cities.map((city) => (
                <option key={city || "all"} value={city}>
                  {city || "Все"}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label>
              <span className="label">Цена до</span>
              <input className="field mt-1" type="number" value={filters.maxPrice} onChange={(event) => update("maxPrice", event.target.value)} />
            </label>
            <label>
              <span className="label">Валюта</span>
              <select className="field mt-1" value={filters.priceCurrency} onChange={(event) => update("priceCurrency", event.target.value)}>
                <option value="USD">$ USD</option>
                <option value="RUB">₽ RUB</option>
                <option value="EUR">€ EUR</option>
                <option value="CHF">CHF</option>
                <option value="JPY">¥ JPY</option>
                <option value="CNY">¥ CNY</option>
                <option value="AED">AED</option>
              </select>
            </label>
            <label className="col-span-2">
              <span className="label">Рейтинг от</span>
              <input className="field mt-1" type="number" step="0.1" min="0" max="5" value={filters.minRating} onChange={(event) => update("minRating", event.target.value)} />
            </label>
          </div>
          <label>
            <span className="label">Длительность до, ч</span>
            <input className="field mt-1" type="number" step="0.5" value={filters.maxDuration} onChange={(event) => update("maxDuration", event.target.value)} />
          </label>
          <label>
            <span className="label">Категория</span>
            <select className="field mt-1" value={filters.category} onChange={(event) => update("category", event.target.value)}>
              {categories.map((category) => (
                <option key={category || "all"} value={category}>
                  {category || "Любая"}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="label">Язык</span>
            <select className="field mt-1" value={filters.language} onChange={(event) => update("language", event.target.value)}>
              {languages.map((language) => (
                <option key={language || "all"} value={language}>
                  {language || "Любой"}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="label">Сортировка</span>
            <select className="field mt-1" value={filters.sort} onChange={(event) => update("sort", event.target.value)}>
              <option value="rating">По рейтингу</option>
              <option value="price-asc">Сначала дешевле</option>
              <option value="price-desc">Сначала дороже</option>
              <option value="duration">По длительности</option>
            </select>
          </label>
          <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700">
            <input type="checkbox" checked={filters.certified} onChange={(event) => update("certified", event.target.checked)} />
            Только сертифицированные специалисты
          </label>
        </div>
      </aside>

      <section>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="section-title">Каталог экскурсий</h1>
            <p className="mt-2 text-sm text-slate-600">Найдено: {loading ? "..." : tours.length}</p>
          </div>
        </div>

        {loading ? (
          <div className="grid min-h-80 place-items-center rounded-lg border border-slate-200 bg-white">
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
              <Loader2 className="h-5 w-5 animate-spin text-brand" />
              Загружаем экскурсии
            </div>
          </div>
        ) : error ? (
          <EmptyState title="Ошибка загрузки" text={error} />
        ) : tours.length === 0 ? (
          <EmptyState title="Экскурсии не найдены" text="Попробуйте изменить город, бюджет, рейтинг или категорию маршрута." />
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
