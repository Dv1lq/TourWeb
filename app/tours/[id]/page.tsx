import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, CalendarCheck, Clock, Languages, MapPin, UsersRound } from "lucide-react";
import { CertificateBadge } from "@/components/CertificateBadge";
import { TourReviewsSection } from "@/components/TourReviewsSection";
import { WeatherWidget } from "@/components/WeatherWidget";
import { TourMapClient } from "@/components/TourMapClient";
import { prisma } from "@/lib/prisma";
import { serializeTour } from "@/lib/serializers";
import { formatDuration, formatMoney } from "@/lib/utils";


type PageProps = {
  params: Promise<{ id: string }>;
};

async function getTour(id: string) {
  const decoded = decodeURIComponent(id);
  const tour = await prisma.tour.findFirst({
    where: {
      OR: [{ id: decoded }, { slug: decoded }]
    },
    include: {
      guide: true,
      reviews: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  return tour ? serializeTour(tour) : null;
}

export default async function TourPage({ params }: PageProps) {
  const { id } = await params;
  const tour = await getTour(id);

  if (!tour) {
    notFound();
  }

  const fallbackImage = tour.gallery?.[0] || "/images/tours/night-bridges-canals-cover.jpg";
  const coverImage = tour.image || fallbackImage;
  const routePhotos = (tour.gallery || []).filter(Boolean).slice(0, 2);

  return (
    <div className="pb-14">
      <section className="bg-white">
        <div className="container-page grid gap-8 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-600">
              <span>{tour.country}</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span>{tour.city}</span>
              <span className="rounded-lg bg-teal-50 px-2 py-1 text-brand">{tour.category}</span>
            </div>
            <h1 className="text-4xl font-black leading-tight text-slate-950 md:text-5xl">{tour.title}</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">{tour.longDescription}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <CertificateBadge guideSlug={tour.guide.slug} />
              <span className="inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">
                <BadgeCheck className="h-4 w-4" />
                {tour.guide.certificateIssuer}
              </span>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-soft">
            <img src={coverImage} alt={tour.title} className="aspect-[16/11] h-full w-full object-cover" />
          </div>
        </div>
      </section>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-8">
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">Программа экскурсии</h2>
            <ol className="mt-5 grid gap-3">
              {tour.program.map((item, index) => (
                <li key={item} className="flex gap-3 rounded-lg bg-slate-50 p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">{index + 1}</span>
                  <span className="pt-1 text-sm leading-6 text-slate-700">{item}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="grid gap-3"><h2 className="text-2xl font-bold text-slate-950">Маршрут на карте</h2><TourMapClient title={tour.title} coordinates={tour.coordinates} routePoints={tour.routePoints} /></section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">Фотографии маршрута</h2>
            {routePhotos.length > 0 ? (
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {routePhotos.map((image) => (
                  <img key={image} src={image} alt={tour.title} className="aspect-[4/3] rounded-lg object-cover" />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-600">Фотографии маршрута скоро появятся.</p>
            )}
          </section>

          <TourReviewsSection
            reviews={tour.reviews || []}
            rating={tour.rating}
            reviewCount={tour.reviewCount}
          />
        </div>

        <aside className="grid h-fit gap-5 lg:sticky lg:top-24">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-slate-500">Стоимость</div>
            <div className="mt-1 text-3xl font-black text-slate-950">{formatMoney(tour.price, tour.currency)}</div>
            <div className="mt-5 grid gap-3 text-sm text-slate-700">
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-ember" />
                {formatDuration(tour.durationHours)}
              </span>
              <span className="inline-flex items-center gap-2">
                <UsersRound className="h-4 w-4 text-coral" />
                До {tour.maxGroupSize} человек
              </span>
              <span className="inline-flex items-center gap-2">
                <Languages className="h-4 w-4 text-brand" />
                {tour.language}
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-coral" />
                {tour.meetingPoint}
              </span>
            </div>
            <Link href={`/booking?tourId=${tour.slug}`} className="btn-primary mt-5 w-full">
              <CalendarCheck className="h-4 w-4" />
              Выбрать дату и забронировать
            </Link>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-950">Гид</h2>
            <div className="flex gap-4">
              <img src={tour.guide.photo} alt={tour.guide.name} className="h-20 w-20 rounded-lg object-cover" />
              <div>
                <Link href={`/guides/${tour.guide.slug}`} className="font-bold text-slate-950 hover:text-brand">
                  {tour.guide.name}
                </Link>
                <p className="mt-1 text-sm text-slate-600">{tour.guide.specialization}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-slate-600">
              <span>Опыт: {tour.guide.experienceYears} лет</span>
              <span>Проведено экскурсий: {tour.guide.completedTours}</span>
              <span>Сертификат: {tour.guide.certificateNumber}</span>
            </div>
          </div>

          <WeatherWidget city={tour.city} lat={tour.latitude} lon={tour.longitude} />
        </aside>
      </div>
    </div>
  );
}
