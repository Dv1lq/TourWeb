import Link from "next/link";
import { BadgeCheck, CalendarCheck, Compass, UserRound } from "lucide-react";

const nav = [
  { href: "/catalog", label: "Каталог" },
  { href: "/booking", label: "Бронирование" },
  { href: "/account", label: "Личный кабинет" }
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="container-page flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-950" aria-label="RouteCert">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
            <Compass className="h-5 w-5" />
          </span>
          <span className="text-lg">RouteCert</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/catalog?certified=true" className="btn-secondary hidden sm:inline-flex">
            <BadgeCheck className="h-4 w-4" />
            Сертификаты
          </Link>
          <Link href="/booking" className="btn-primary">
            <CalendarCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Забронировать</span>
          </Link>
          <Link href="/account" className="btn-secondary px-3 md:hidden" aria-label="Личный кабинет">
            <UserRound className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
