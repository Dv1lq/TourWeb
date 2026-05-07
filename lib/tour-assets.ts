export type TourAssets = { image: string; gallery: [string, string] };

export const TOUR_ASSETS_BY_SLUG: Record<string, TourAssets> = {
  "hermitage-masterpieces": {
    image: "/images/tours/hermitage-cover.jpg",
    gallery: ["/images/tours/hermitage-route-1.jpg", "/images/tours/hermitage-route-2.jpg"]
  },
  "tretyakov-gallery-art": {
    image: "/images/tours/tretyakov-gallery-cover.jpg",
    gallery: ["/images/tours/tretyakov-gallery-route-1.jpg", "/images/tours/tretyakov-gallery-route-2.jpg"]
  },
  "olkhon-baikal-legends": {
    image: "/images/tours/olkhon-baikal-cover.jpg",
    gallery: ["/images/tours/olkhon-baikal-route-1.jpg", "/images/tours/olkhon-baikal-route-2.jpg"]
  },
  "moscow-red-square-kremlin": {
    image: "/images/tours/moscow-red-square-cover.jpg",
    gallery: ["/images/tours/moscow-red-square-route-1.jpg", "/images/tours/moscow-red-square-route-2.jpg"]
  },
  "kazan-kremlin-kul-sharif": {
    image: "/images/tours/kazan-kremlin-cover.jpg",
    gallery: ["/images/tours/kazan-kremlin-route-1.jpg", "/images/tours/kazan-kremlin-route-2.jpg"]
  },
  "old-tbilisi-narikala-baths": {
    image: "/images/tours/old-tbilisi-cover.jpg",
    gallery: ["/images/tours/old-tbilisi-route-1.jpg", "/images/tours/old-tbilisi-route-2.jpg"]
  },
  "buryatia-ethno-route": {
    image: "/images/tours/buryatia-ethno-cover.jpg",
    gallery: ["/images/tours/buryatia-ethno-route-1.jpg", "/images/tours/buryatia-ethno-route-2.jpg"]
  },
  "mtskheta-day-trip": {
    image: "/images/tours/mtskheta-cover.jpg",
    gallery: ["/images/tours/mtskheta-route-1.jpg", "/images/tours/mtskheta-route-2.jpg"]
  },
  "peterhof-fountains": {
    image: "/images/tours/peterhof-cover.jpg",
    gallery: ["/images/tours/peterhof-route-1.jpg", "/images/tours/peterhof-route-2.jpg"]
  },
  "sololaki-rustaveli-architecture": {
    image: "/images/tours/sololaki-rustaveli-cover.jpg",
    gallery: ["/images/tours/sololaki-rustaveli-route-1.jpg", "/images/tours/sololaki-rustaveli-route-2.jpg"]
  },
  "dubai-desert-safari-certified": {
    image: "/images/tours/dubai-desert-safari-cover.jpg",
    gallery: ["/images/tours/dubai-desert-safari-route-1.jpg", "/images/tours/dubai-desert-safari-route-2.jpg"]
  },
  "sviyazhsk-raifa-day-trip": {
    image: "/images/tours/sviyazhsk-raifa-cover.jpg",
    gallery: ["/images/tours/sviyazhsk-raifa-route-1.jpg", "/images/tours/sviyazhsk-raifa-route-2.jpg"]
  },
  "peter-paul-fortress-history": {
    image: "/images/tours/peter-paul-fortress-cover.jpg",
    gallery: ["/images/tours/peter-paul-fortress-route-1.jpg", "/images/tours/peter-paul-fortress-route-2.jpg"]
  },
  "dubai-burj-khalifa-future": {
    image: "/images/tours/dubai-burj-future-cover.jpg",
    gallery: ["/images/tours/dubai-burj-future-route-1.jpg", "/images/tours/dubai-burj-future-route-2.jpg"]
  },
  "listvyanka-circum-baikal-railway": {
    image: "/images/tours/listvyanka-circum-baikal-cover.jpg",
    gallery: ["/images/tours/listvyanka-circum-baikal-route-1.jpg", "/images/tours/listvyanka-circum-baikal-route-2.jpg"]
  },
  "night-bridges-canals": {
    image: "/images/tours/night-bridges-canals-cover.jpg",
    gallery: ["/images/tours/night-bridges-canals-route-1.jpg", "/images/tours/night-bridges-canals-route-2.jpg"]
  },
  "bunker-42-underground-moscow": {
    image: "/images/tours/bunker-42-cover.jpg",
    gallery: ["/images/tours/bunker-42-route-1.jpg", "/images/tours/bunker-42-route-2.jpg"]
  },
  "al-fahidi-dubai-creek": {
    image: "/images/tours/al-fahidi-creek-cover.jpg",
    gallery: ["/images/tours/al-fahidi-creek-route-1.jpg", "/images/tours/al-fahidi-creek-route-2.jpg"]
  },
  "blue-lakes-temple-all-religions": {
    image: "/images/tours/blue-lakes-temple-cover.jpg",
    gallery: ["/images/tours/blue-lakes-temple-route-1.jpg", "/images/tours/blue-lakes-temple-route-2.jpg"]
  },
  "palm-marina-evening-dubai": {
    image: "/images/tours/palm-marina-dubai-cover.jpg",
    gallery: ["/images/tours/palm-marina-dubai-route-1.jpg", "/images/tours/palm-marina-dubai-route-2.jpg"]
  },
  "vdnh-ostankino-soviet-modern": {
    image: "/images/tours/vdnh-ostankino-cover.jpg",
    gallery: ["/images/tours/vdnh-ostankino-route-1.jpg", "/images/tours/vdnh-ostankino-route-2.jpg"]
  }
};

export const TOUR_IMAGE_FALLBACK = "/images/tours/night-bridges-canals-cover.jpg";

export function resolveTourAssets(slug: string, image?: string | null, gallery?: string[] | null) {
  const mapped = TOUR_ASSETS_BY_SLUG[slug];
  const resolvedImage = image && image.trim().length > 0 ? image : (mapped?.image ?? TOUR_IMAGE_FALLBACK);
  const resolvedGallery = (gallery ?? []).filter((item): item is string => Boolean(item && item.trim().length > 0));
  if (resolvedGallery.length >= 2) return { image: resolvedImage, gallery: resolvedGallery };
  return { image: resolvedImage, gallery: mapped ? [...mapped.gallery] : resolvedGallery };
}
