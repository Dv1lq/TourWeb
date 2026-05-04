import Link from "next/link";
import { Compass } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-page grid gap-8 py-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="mb-3 flex items-center gap-2 font-bold text-slate-950">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
              <Compass className="h-5 w-5" />
            </span>
            RouteCert
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            Демонстрационный full-stack сервис для подбора экскурсий с сертифицированными гидами,
            профилями специалистов, API, фильтрами и имитацией бронирования.
          </p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Разделы</h2>
          <div className="grid gap-2 text-sm text-slate-700">
            <Link href="/catalog">Каталог экскурсий</Link>
            <Link href="/booking">Форма бронирования</Link>
            <Link href="/account">Личный кабинет</Link>
          </div>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">API</h2>
          <p className="text-sm leading-6 text-slate-600">
            Next.js API Routes работают с SQLite через Prisma и возвращают данные для каталога,
            профилей, отзывов, сертификатов и бронирований.
          </p>
        </div>
      </div>
    </footer>
  );
}
