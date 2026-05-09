export type RoutePoint = {
  title: string;
  lat: number;
  lon: number;
  note: string;
};

export type ReviewView = {
  id: string;
  userName: string;
  rating: number;
  text: string;
  createdAt: string;
};

export type GuideSummary = {
  id: string;
  slug: string;
  name: string;
  photo: string;
  country: string;
  city: string;
  experienceYears: number;
  specialization: string;
  languages: string[];
  rating: number;
  completedTours: number;
  certificateNumber: string;
  certificateIssuedAt: string;
  certificateIssuer: string;
  certificate: {
    number: string;
    issuedAt: string;
    issuer: string;
    verified: boolean;
  };
  bio: string;
  verified: boolean;
};

export type TourView = {
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
  route: RoutePoint[];
  coordinates: { lat: number; lng: number };
  routePoints: { title: string; lat: number; lng: number }[];
  program: string[];
  gallery: string[];
  guide: GuideSummary;
  reviews?: ReviewView[];
};

export type BookingView = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  people: number;
  comment: string | null;
  totalPrice: number;
  status: string;
  createdAt: string;
  tour: TourView;
};

export type CityView = {
  id: string;
  country: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
};
