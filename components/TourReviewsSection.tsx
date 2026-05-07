"use client";

import { useMemo, useState } from "react";
import { Rating } from "@/components/Rating";
import { formatDate } from "@/lib/utils";

type ReviewItem = {
  id: string;
  userName: string;
  rating: number;
  text: string;
  createdAt: string;
};

type TourReviewsSectionProps = {
  reviews: ReviewItem[];
  rating: number;
  reviewCount: number;
};

const INITIAL_VISIBLE_REVIEWS = 3;

export function TourReviewsSection({ reviews, rating, reviewCount }: TourReviewsSectionProps) {
  const [expanded, setExpanded] = useState(false);

  const visibleReviews = useMemo(
    () => (expanded ? reviews : reviews.slice(0, INITIAL_VISIBLE_REVIEWS)),
    [expanded, reviews]
  );

  const hasMoreReviews = reviews.length > INITIAL_VISIBLE_REVIEWS;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-slate-950">Отзывы</h2>
        <Rating value={rating} reviews={reviewCount} />
      </div>
      <div className="grid gap-4">
        {visibleReviews.map((review) => (
          <article key={review.id} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
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

      {hasMoreReviews ? (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-5 inline-flex items-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          {expanded ? "Скрыть отзывы" : "Смотреть больше"}
        </button>
      ) : null}
    </section>
  );
}
