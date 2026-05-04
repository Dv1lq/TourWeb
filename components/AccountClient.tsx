"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Save, XCircle } from "lucide-react";
import type { BookingView } from "@/lib/types";
import { formatDate, formatMoney, statusLabel } from "@/lib/utils";
import { EmptyState } from "@/components/EmptyState";

const defaultProfile = {
  name: "Виталий Новиков",
  email: "demo@routecert.local",
  phone: "+7 900 123-45-67",
  city: "Казань"
};

export function AccountClient() {
  const [profile, setProfile] = useState(defaultProfile);
  const [bookings, setBookings] = useState<BookingView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("routecert-profile");
    if (stored) {
      setProfile(JSON.parse(stored));
    }

    fetch("/api/bookings")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Не удалось загрузить бронирования");
        }
        return response.json();
      })
      .then((payload) => setBookings(payload.bookings))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const activeBookings = useMemo(() => bookings.filter((booking) => booking.status !== "completed"), [bookings]);
  const history = useMemo(() => bookings.filter((booking) => booking.status === "completed"), [bookings]);

  function updateProfile(field: keyof typeof profile, value: string) {
    setProfile((current) => ({ ...current, [field]: value }));
    setSaved(false);
  }

  function saveProfile() {
    localStorage.setItem("routecert-profile", JSON.stringify(profile));
    setSaved(true);
  }

  async function cancelBooking(id: string) {
    const response = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" })
    });

    if (!response.ok) {
      return;
    }

    const payload = await response.json();
    setBookings((current) => current.map((booking) => (booking.id === id ? payload.booking : booking)));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-950">Личный кабинет</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Демо-вход без пароля. Данные профиля сохраняются в localStorage.</p>
        <div className="mt-5 grid gap-4">
          {Object.entries(profile).map(([key, value]) => (
            <label key={key}>
              <span className="label">
                {key === "name" ? "Имя" : key === "email" ? "Email" : key === "phone" ? "Телефон" : "Город"}
              </span>
              <input className="field mt-1" value={value} onChange={(event) => updateProfile(key as keyof typeof profile, event.target.value)} />
            </label>
          ))}
          <button className="btn-primary" type="button" onClick={saveProfile}>
            <Save className="h-4 w-4" />
            Сохранить
          </button>
          {saved ? <div className="rounded-lg bg-teal-50 px-3 py-2 text-sm font-semibold text-brand">Профиль обновлен</div> : null}
        </div>
      </aside>

      <section className="grid gap-8">
        <div>
          <h2 className="section-title">Мои бронирования</h2>
          {loading ? (
            <div className="mt-5 grid min-h-60 place-items-center rounded-lg border border-slate-200 bg-white">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <Loader2 className="h-5 w-5 animate-spin text-brand" />
                Загружаем бронирования
              </div>
            </div>
          ) : error ? (
            <div className="mt-5">
              <EmptyState title="Ошибка загрузки" text={error} />
            </div>
          ) : activeBookings.length === 0 ? (
            <div className="mt-5">
              <EmptyState title="Активных бронирований нет" text="Выберите экскурсию в каталоге и создайте тестовую заявку." />
            </div>
          ) : (
            <div className="mt-5 grid gap-4">
              {activeBookings.map((booking) => (
                <article key={booking.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-950">{booking.tour.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {formatDate(booking.date)} · {booking.people} чел. · {formatMoney(booking.totalPrice, booking.tour.currency)}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-brand">{statusLabel(booking.status)}</p>
                    </div>
                    {booking.status !== "cancelled" ? (
                      <button className="btn-secondary" type="button" onClick={() => cancelBooking(booking.id)}>
                        <XCircle className="h-4 w-4" />
                        Отменить
                      </button>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="section-title">История посещений</h2>
          {history.length === 0 ? (
            <div className="mt-5">
              <EmptyState title="История пока пуста" text="После завершения экскурсии заявка появится в этом разделе." />
            </div>
          ) : (
            <div className="mt-5 grid gap-4">
              {history.map((booking) => (
                <article key={booking.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-950">{booking.tour.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {formatDate(booking.date)} · гид {booking.tour.guide.name} · {statusLabel(booking.status)}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
