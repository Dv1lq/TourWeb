import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeGuide } from "@/lib/serializers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const country = searchParams.get("country")?.trim();
  const city = searchParams.get("city")?.trim();

  const where: Prisma.GuideWhereInput = {};

  if (q) {
    where.OR = [
      { name: { contains: q } },
      { specialization: { contains: q } },
      { certificateNumber: { contains: q } }
    ];
  }

  if (country) where.country = country;
  if (city) where.city = { contains: city };

  const guides = await prisma.guide.findMany({
    where,
    orderBy: [{ rating: "desc" }, { completedTours: "desc" }]
  });

  return NextResponse.json({
    guides: guides.map(serializeGuide),
    total: guides.length
  });
}
