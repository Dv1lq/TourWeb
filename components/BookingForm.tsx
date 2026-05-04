"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { CalendarCheck, CheckCircle2, Loader2 } from "lucide-react";
import type { BookingView, TourView } from "@/lib/types";
import { formatMoney } from "@/lib/utils";

type FormState = {
  name: string;
  email: string;
  phone: string;
  tourId: string;
  date: string;
  people: number;
  comment: string;
};

function tomorrow() {
  return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function BookingForm({ tours, initialTourSlug }: { tours: TourView[]; initialTourSlug?: string }) {
  const firstTour = tours.find((tour) => tour.slug === initialTourSlug) ?? tours[0];
  const [form, setForm] = useState<FormState>({
    name: "Виталий Новиков",
    email: "demo@routecert.local",
    phone: "+7 900 123-45-67",
    tourId: firstTour?.slug ?? "",
    date: tomorrow(),
    people: 2,
    comment: ""
  });
  const [total, setTotal] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState<BookingView | null>(null);

  const selectedTour = useMemo(() => tours.find((tour) => tour.slug === form.tourId), [form.tourId, tours]);

  useEffect(() => {
    if (!selectedTour) {
      return;
    }

    const params = new URLSearchParams({
      tourId: selectedTour.slug,
      people: String(form.people),
      date: form.date
    });

    fetch(`/api/price?${params.toString()}`)
      .then((response) => response.json())
      .then((payload) => setTotal(payload.totalPrice))
      .catch(() => setTotal(selectedTour.price * form.people));
  }, [selectedTour, form.people, form.date]);

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!selectedTour) {
      setError("Выберите экскурсию.");
      return;
    }

    if (!form.name.trim() || !form.email.includes("@") || form.phone.trim().length < 7 || !form.date) {
      setError("Проверьте имя, email, телефон и дату экскурсии.");
      return;
    }

    setSubmitting(true);
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tourId: selectedTour.slug,
        customerName: form.name,
        email: form.email,
        phone: form.phone,
        date: form.date,
        people: form.people,
        comment: form.comment
      })
    });

    const payload = await response.json();
    setSubmitting(false);

    if (!response.ok) {
      setError(payload.error ?? "Не удалось создать бронирование.");
      return;
    }

    setConfirmation(payload.booking);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h1 className="section-title">Бронирование экскурсии</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Заявка создается в демо-статусе «Подтверждено». Оплата в учебном проекте не подключается.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className="label">Имя клиента</span>
            <input className="field mt-1" value={form.name} onChange={(event) => update("name", event.target.value)} />
          </label>
          <label>
            <span className="label">Email</span>
            <input className="field mt-1" type="email" value={form.email} onChange={(event) => update("email", event.target.value)} />
          </label>
          <label>
            <span className="label">Телефон</span>
            <input className="field mt-1" value={form.phone} onChange={(event) => update("phone", event.target.value)} />
          </label>
          <label>
            <span className="label">Дата</span>
            <input className="field mt-1" type="date" value={form.date} onChange={(event) => update("date", event.target.value)} />
          </label>
          <label className="md:col-span-2">
            <span className="label">Экскурсия</span>
            <select className="field mt-1" value={form.tourId} onChange={(event) => update("tourId", event.target.value)}>
              {tours.map((tour) => (
                <option key={tour.id} value={tour.slug}>
                  {tour.title} — {tour.city}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="label">Количество человек</span>
            <input
              className="field mt-1"
              type="number"
              min="1"
              max={selectedTour?.maxGroupSize ?? 20}
              value={form.people}
              onChange={(event) => update("people", Number(event.target.value))}
            />
          </label>
          <label className="md:col-span-2">
            <span className="label">Комментарий</span>
            <textarea className="field mt-1 min-h-28 resize-y" value={form.comment} onChange={(event) => update("comment", event.target.value)} placeholder="Пожелания по темпу, языку, встрече или составу группы" />
          </label>
        </div>

        {error ? <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div> : null}

        <button className="btn-primary mt-5 w-full md:w-fit" type="submit" disabled={submitting}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarCheck className="h-4 w-4" />}
          Подтвердить бронирование
        </button>
      </form>

      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        {selectedTour ? (
          <>
            <img src={selectedTour.image} alt={selectedTour.title} className="mb-4 aspect-[16/10] w-full rounded-lg object-cover" />
            <h2 className="text-lg font-bold text-slate-950">{selectedTour.title}</h2>
            <div className="mt-3 grid gap-2 text-sm text-slate-600">
              <span>{selectedTour.city}, {selectedTour.country}</span>
              <span>Гид: {selectedTour.guide.name}</span>
              <span>Длительность: {selectedTour.durationHours} ч</span>
              <span>Группа до {selectedTour.maxGroupSize} человек</span>
            </div>
            <div className="mt-5 rounded-lg bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-500">Итоговая стоимость</div>
              <div className="mt-1 text-3xl font-bold text-slate-950">{formatMoney(total, selectedTour.currency)}</div>
              <p className="mt-2 text-xs leading-5 text-slate-500">Цена включает сервисный сбор и автоматически пересчитывается по количеству участников.</p>
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-600">Список экскурсий пуст. Запустите seed базы данных.</p>
        )}
      </aside>

      {confirmation ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 px-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-soft">
            <CheckCircle2 className="mb-4 h-12 w-12 text-brand" />
            <h2 className="text-2xl font-bold text-slate-950">Бронирование создано</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Номер заявки: <span className="font-semibold text-slate-950">{confirmation.id.slice(0, 8).toUpperCase()}</span>.
              Статус: <span className="font-semibold text-slate-950">подтверждено</span>.
            </p>
            <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
              {confirmation.tour.title}, {new Date(confirmation.date).toLocaleDateString("ru-RU")} · {confirmation.people} чел.
            </div>
            <button className="btn-primary mt-5 w-full" type="button" onClick={() => setConfirmation(null)}>
              Закрыть
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
