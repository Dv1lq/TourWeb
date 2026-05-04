import Link from "next/link";
import { BadgeCheck, Clock, MapPin, Ticket } from "lucide-react";
import type { TourView } from "@/lib/types";
import { formatDuration, formatMoney } from "@/lib/utils";
import { Rating } from "@/components/Rating";

export function TourCard({ tour }: { tour: TourView }) {
  const fallbackImage = tour.gallery?.[0] || "/images/tours/night-bridges-canals-cover.jpg";
  const coverImage = tour.image || fallbackImage;

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <Link href={`/tours/${tour.slug}`} className="block">
        <div className="aspect-[16/10] overflow-hidden bg-slate-200">
          <img src={coverImage} alt={tour.title} className="h-full w-full object-cover" />
        </div>
      </Link>
      <div className="grid gap-4 p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span>{tour.country}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>{tour.city}</span>
          <span className="rounded-full bg-teal-50 px-2 py-1 text-brand">{tour.category}</span>
        </div>
        <div>
          <Link href={`/tours/${tour.slug}`} className="text-lg font-bold leading-snug text-slate-950 hover:text-brand">
            {tour.title}
          </Link>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{tour.description}</p>
        </div>
        <div className="grid gap-2 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-coral" />
            {tour.region}
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4 text-ember" />
            {formatDuration(tour.durationHours)}
          </span>
          <span className="inline-flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-brand" />
            {tour.guide.name}, сертификат подтвержден
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div>
            <Rating value={tour.rating} reviews={tour.reviewCount} />
            <div className="mt-1 text-lg font-bold text-slate-950">{formatMoney(tour.price, tour.currency)}</div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href={`/tours/${tour.slug}`} className="btn-secondary px-3">
              Подробнее
            </Link>
            <Link href={`/booking?tourId=${tour.slug}`} className="btn-primary px-3">
              <Ticket className="h-4 w-4" />
              Бронь
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
