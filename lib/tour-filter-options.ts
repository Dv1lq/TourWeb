import type { TourView } from "@/lib/types";

export function buildTourFilterOptions(tours: TourView[]) {
  const countries = ["", ...Array.from(new Set(tours.map((tour) => tour.country))).sort((a, b) => a.localeCompare(b))];
  const cities = [
    "",
    ...Array.from(new Set(tours.flatMap((tour) => [tour.city, tour.region].filter(Boolean)))).sort((a, b) => a.localeCompare(b))
  ];
  const categories = ["", ...Array.from(new Set(tours.map((tour) => tour.category))).sort((a, b) => a.localeCompare(b))];
  const languages = [
    "",
    ...Array.from(
      new Set(
        tours.flatMap((tour) =>
          tour.language
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean)
        )
      )
    ).sort((a, b) => a.localeCompare(b))
  ];

  return { countries, cities, categories, languages };
}
