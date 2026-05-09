import type { BookingView, CityView, GuideSummary, ReviewView, RoutePoint, TourView } from "@/lib/types";
import { parseJson } from "@/lib/utils";

type RawDate = Date | string;

type RawReview = {
  id: string;
  userName: string;
  rating: number;
  text: string;
  createdAt: RawDate;
};

type RawGuide = {
  id: string;
  slug: string;
  name: string;
  photo: string;
  country: string;
  city: string;
  experienceYears: number;
  specialization: string;
  languages: string;
  rating: number;
  completedTours: number;
  certificateNumber: string;
  certificateIssuedAt: RawDate;
  certificateIssuer: string;
  bio: string;
  verified: boolean;
};

type RawTour = {
  id: string;
  slug: string;
  title: string;
  country: string;
  city: string;
  region: string;
  category: string;
  description: string;
  longDescription: string;
  price: number;
  currency: string;
  durationHours: number;
  rating: number;
  reviewCount: number;
  language: string;
  maxGroupSize: number;
  image: string;
  meetingPoint: string;
  latitude: number;
  longitude: number;
  routeJson: string;
  programJson: string;
  galleryJson: string;
  guide: RawGuide;
  reviews?: RawReview[];
};

type RawBooking = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  date: RawDate;
  people: number;
  comment: string | null;
  totalPrice: number;
  status: string;
  createdAt: RawDate;
  tour: RawTour;
};

type RawCity = {
  id: string;
  country: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
};

function toIso(value: RawDate) {
  return value instanceof Date ? value.toISOString() : value;
}

export function serializeReview(review: RawReview): ReviewView {
  return {
    id: review.id,
    userName: review.userName,
    rating: review.rating,
    text: review.text,
    createdAt: toIso(review.createdAt)
  };
}

export function serializeGuide(guide: RawGuide): GuideSummary {
  return {
    id: guide.id,
    slug: guide.slug,
    name: guide.name,
    photo: guide.photo,
    country: guide.country,
    city: guide.city,
    experienceYears: guide.experienceYears,
    specialization: guide.specialization,
    languages: guide.languages.split(",").map((item: string) => item.trim()),
    rating: guide.rating,
    completedTours: guide.completedTours,
    certificateNumber: guide.certificateNumber,
    certificateIssuedAt: toIso(guide.certificateIssuedAt),
    certificateIssuer: guide.certificateIssuer,
    certificate: {
      number: guide.certificateNumber,
      issuedAt: toIso(guide.certificateIssuedAt),
      issuer: guide.certificateIssuer,
      verified: guide.verified
    },
    bio: guide.bio,
    verified: guide.verified
  };
}

export function serializeTour(tour: RawTour): TourView {
  return {
    id: tour.id,
    slug: tour.slug,
    title: tour.title,
    country: tour.country,
    city: tour.city,
    region: tour.region,
    category: tour.category,
    description: tour.description,
    longDescription: tour.longDescription,
    price: tour.price,
    currency: tour.currency,
    durationHours: tour.durationHours,
    rating: tour.rating,
    reviewCount: tour.reviewCount,
    language: tour.language,
    maxGroupSize: tour.maxGroupSize,
    image: tour.image,
    meetingPoint: tour.meetingPoint,
    latitude: tour.latitude,
    longitude: tour.longitude,
    route: parseJson<RoutePoint[]>(tour.routeJson, []),
    coordinates: { lat: tour.latitude, lng: tour.longitude },
    routePoints: parseJson<RoutePoint[]>(tour.routeJson, []).map((p) => ({ title: p.title, lat: p.lat, lng: p.lon })),
    program: parseJson<string[]>(tour.programJson, []),
    gallery: parseJson<string[]>(tour.galleryJson, []),
    guide: serializeGuide(tour.guide),
    reviews: tour.reviews?.map(serializeReview)
  };
}

export function serializeBooking(booking: RawBooking): BookingView {
  return {
    id: booking.id,
    customerName: booking.customerName,
    email: booking.email,
    phone: booking.phone,
    date: toIso(booking.date),
    people: booking.people,
    comment: booking.comment,
    totalPrice: booking.totalPrice,
    status: booking.status,
    createdAt: toIso(booking.createdAt),
    tour: serializeTour(booking.tour)
  };
}

export function serializeCity(city: RawCity): CityView {
  return {
    id: city.id,
    country: city.country,
    name: city.name,
    region: city.region,
    latitude: city.latitude,
    longitude: city.longitude
  };
}
