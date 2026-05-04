import Link from "next/link";
import { BadgeCheck, Languages, MapPin } from "lucide-react";
import type { GuideSummary } from "@/lib/types";
import { Rating } from "@/components/Rating";

export function GuideCard({ guide }: { guide: GuideSummary }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex gap-4">
        <img src={guide.photo} alt={guide.name} className="h-20 w-20 rounded-lg object-cover" />
        <div className="min-w-0">
          <Link href={`/guides/${guide.slug}`} className="text-lg font-bold text-slate-950 hover:text-brand">
            {guide.name}
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4 text-coral" />
              {guide.city}
            </span>
            <Rating value={guide.rating} />
          </div>
        </div>
      </div>
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{guide.specialization}</p>
      <div className="mt-4 grid gap-2 text-sm text-slate-600">
        <span className="inline-flex items-center gap-2">
          <BadgeCheck className="h-4 w-4 text-brand" />
          {guide.certificateNumber}
        </span>
        <span className="inline-flex items-center gap-2">
          <Languages className="h-4 w-4 text-ember" />
          {guide.languages.join(", ")}
        </span>
      </div>
      <Link href={`/guides/${guide.slug}`} className="btn-secondary mt-5 w-full">
        Открыть профиль
      </Link>
    </article>
  );
}
