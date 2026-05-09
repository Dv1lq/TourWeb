"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const categories = ["", "Историческая", "Музейная", "Природная", "Авторская", "Семейная", "Обзорная", "Этнокультурная", "Выездная"];
const countries = ["", "Россия", "Грузия", "ОАЭ", "Швейцария", "Германия", "Япония", "Китай"];
const languages = ["", "Русский", "English", "Deutsch", "Français"];

export function HomeSearch() {
  const router = useRouter();
  const [form, setForm] = useState({
    q: "",
    country: "",
    city: "",
    date: "",
    maxPrice: "",
    minRating: "",
    language: "",
    category: ""
  });

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    Object.entries(form).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    router.push(`/catalog?${params.toString()}`);
  }

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-lg border border-white/20 bg-white/95 p-4 shadow-soft backdrop-blur">
      <div className="grid gap-3 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <label>
          <span className="label">Поиск</span>
          <input
            className="field mt-1"
            value={form.q}
            onChange={(event) => update("q", event.target.value)}
            placeholder="Кремль, Байкал, Тбилиси, сафари..."
          />
        </label>
        <label>
          <span className="label">Страна</span>
          <select className="field mt-1" value={form.country} onChange={(event) => update("country", event.target.value)}>
            {countries.map((country) => (
              <option key={country || "all"} value={country}>
                {country || "Все страны"}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="label">Город/регион</span>
          <input className="field mt-1" value={form.city} onChange={(event) => update("city", event.target.value)} placeholder="Казань" />
        </label>
      </div>
      <div className="grid gap-3 md:grid-cols-5">
        <label>
          <span className="label">Дата</span>
          <input className="field mt-1" type="date" value={form.date} onChange={(event) => update("date", event.target.value)} />
        </label>
        <label>
          <span className="label">Цена до</span>
          <input className="field mt-1" type="number" value={form.maxPrice} onChange={(event) => update("maxPrice", event.target.value)} placeholder="10000" />
        </label>
        <label>
          <span className="label">Рейтинг от</span>
          <input className="field mt-1" type="number" step="0.1" min="0" max="5" value={form.minRating} onChange={(event) => update("minRating", event.target.value)} placeholder="4.7" />
        </label>
        <label>
          <span className="label">Язык</span>
          <select className="field mt-1" value={form.language} onChange={(event) => update("language", event.target.value)}>
            {languages.map((language) => (
              <option key={language || "all"} value={language}>
                {language || "Любой"}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="label">Тип</span>
          <select className="field mt-1" value={form.category} onChange={(event) => update("category", event.target.value)}>
            {categories.map((category) => (
              <option key={category || "all"} value={category}>
                {category || "Любой"}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button className="btn-primary w-full md:w-fit" type="submit">
        <Search className="h-4 w-4" />
        Найти экскурсии
      </button>
    </form>
  );
}
