import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeCity } from "@/lib/serializers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const country = searchParams.get("country")?.trim();

  const where: Prisma.CityWhereInput = {};

  if (q) {
    where.OR = [
      { name: { contains: q } },
      { region: { contains: q } },
      { country: { contains: q } }
    ];
  }

  if (country) {
    where.country = country;
  }

  const cities = await prisma.city.findMany({
    where,
    orderBy: [{ country: "asc" }, { name: "asc" }]
  });

  return NextResponse.json({ cities: cities.map(serializeCity) });
}
