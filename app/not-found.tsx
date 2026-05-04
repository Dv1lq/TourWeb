import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page grid min-h-[60vh] place-items-center py-16 text-center">
      <div>
        <h1 className="text-4xl font-black text-slate-950">Страница не найдена</h1>
        <p className="mt-3 text-slate-600">Возможно, экскурсия или профиль были удалены из демо-базы.</p>
        <Link href="/catalog" className="btn-primary mt-6">
          Вернуться в каталог
        </Link>
      </div>
    </div>
  );
}
