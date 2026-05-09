import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeTour } from "@/lib/serializers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const country = searchParams.get("country")?.trim();
  const city = searchParams.get("city")?.trim();
  const maxPrice = Number(searchParams.get("maxPrice") ?? "");
  const minRating = Number(searchParams.get("minRating") ?? "");
  const maxDuration = Number(searchParams.get("maxDuration") ?? "");
  const category = searchParams.get("category")?.trim();
  const language = searchParams.get("language")?.trim();
  const certified = searchParams.get("certified") === "true";
  const sort = searchParams.get("sort") ?? "rating";

  const where: Prisma.TourWhereInput = {};
  const andFilters: Prisma.TourWhereInput[] = [];

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { longDescription: { contains: q } },
      { city: { contains: q } },
      { region: { contains: q } },
      { country: { contains: q } }
    ];
  }

  if (country) where.country = country;
  if (city) andFilters.push({ OR: [{ city: { contains: city } }, { region: { contains: city } }] });
  if (category) where.category = category;
  if (language) where.language = { contains: language };
  if (!Number.isNaN(maxPrice) && maxPrice > 0) where.price = { lte: maxPrice };
  if (!Number.isNaN(minRating) && minRating > 0) where.rating = { gte: minRating };
  if (!Number.isNaN(maxDuration) && maxDuration > 0) where.durationHours = { lte: maxDuration };
  if (certified) where.guide = { is: { verified: true } };
  if (andFilters.length > 0) where.AND = andFilters;

  const orderBy: Prisma.TourOrderByWithRelationInput =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
        ? { price: "desc" }
        : sort === "duration"
          ? { durationHours: "asc" }
          : { rating: "desc" };

  const tours = await prisma.tour.findMany({
    where,
    orderBy,
    include: { guide: true }
  });

  return NextResponse.json({
    tours: tours.map(serializeTour),
    total: tours.length
  });
}
