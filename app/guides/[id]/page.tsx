import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, BadgeCheck, CalendarDays, Languages, MapPin, Route, UsersRound } from "lucide-react";
import { CertificateBadge } from "@/components/CertificateBadge";
import { Rating } from "@/components/Rating";
import { TourCard } from "@/components/TourCard";
import { prisma } from "@/lib/prisma";
import { serializeGuide, serializeReview, serializeTour } from "@/lib/serializers";
import { formatDate } from "@/lib/utils";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function getGuide(id: string) {
  const decoded = decodeURIComponent(id);
  const guide = await prisma.guide.findFirst({
    where: {
      OR: [{ id: decoded }, { slug: decoded }]
    },
    include: {
      tours: {
        include: { guide: true },
        orderBy: { rating: "desc" }
      },
      reviews: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!guide) {
    return null;
  }

  return {
    guide: serializeGuide(guide),
    tours: guide.tours.map(serializeTour),
    reviews: guide.reviews.map(serializeReview)
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { id } = await params;
  const data = await getGuide(id);

  if (!data) {
    notFound();
  }

  const { guide, tours, reviews } = data;

  return (
    <div className="container-page py-10">
      <section className="grid gap-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[280px_1fr]">
        <img src={guide.photo} alt={guide.name} className="aspect-square w-full rounded-lg object-cover" />
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg bg-teal-50 px-3 py-2 text-sm font-semibold text-brand">
              <BadgeCheck className="h-4 w-4" />
              Сертифицированный специалист
            </span>
            <Rating value={guide.rating} />
          </div>
          <h1 className="text-4xl font-black leading-tight text-slate-950">{guide.name}</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{guide.bio}</p>
          <div className="mt-6 grid gap-3 text-sm text-slate-700 sm:grid-cols-2 xl:grid-cols-3">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-coral" />
              {guide.country}, {guide.city}
            </span>
            <span className="inline-flex items-center gap-2">
              <Award className="h-4 w-4 text-ember" />
              Опыт {guide.experienceYears} лет
            </span>
            <span className="inline-flex items-center gap-2">
              <Languages className="h-4 w-4 text-brand" />
              {guide.languages.join(", ")}
            </span>
            <span className="inline-flex items-center gap-2">
              <Route className="h-4 w-4 text-brand" />
              {guide.completedTours} экскурсий
            </span>
            <span className="inline-flex items-center gap-2">
              <UsersRound className="h-4 w-4 text-coral" />
              {guide.specialization}
            </span>
          </div>
          <div className="mt-6">
            <CertificateBadge guideSlug={guide.slug} />
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-8">
          <div>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="section-title">Экскурсии специалиста</h2>
              <Link href="/catalog" className="btn-secondary hidden sm:inline-flex">
                В каталог
              </Link>
            </div>
            <div className="grid gap-5 xl:grid-cols-2">
              {tours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">Отзывы о специалисте</h2>
            <div className="mt-5 grid gap-4">
              {reviews.slice(0, 6).map((review) => (
                <article key={review.id} className="rounded-lg bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-semibold text-slate-950">{review.userName}</div>
                    <div className="text-sm text-slate-500">{formatDate(review.createdAt)}</div>
                  </div>
                  <div className="mt-1">
                    <Rating value={review.rating} />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{review.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <h2 className="text-xl font-bold text-slate-950">Сертификат</h2>
          <div className="mt-4 grid gap-3 text-sm text-slate-700">
            <span className="font-semibold text-slate-950">{guide.certificateNumber}</span>
            <span>{guide.certificateIssuer}</span>
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-ember" />
              Выдан {formatDate(guide.certificateIssuedAt)}
            </span>
          </div>
          <Link href={`/booking?tourId=${tours[0]?.slug ?? ""}`} className="btn-primary mt-5 w-full">
            Забронировать экскурсию
          </Link>
        </aside>
      </section>
    </div>
  );
}
