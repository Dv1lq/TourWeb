import { Suspense } from "react";
import { CatalogClient } from "@/components/CatalogClient";

export default function CatalogPage() {
  return (
    <div className="container-page py-10">
      <Suspense fallback={<div className="rounded-lg bg-white p-8 text-sm text-slate-600">Загружаем каталог...</div>}>
        <CatalogClient />
      </Suspense>
    </div>
  );
}
