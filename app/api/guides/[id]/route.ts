import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeGuide, serializeReview, serializeTour } from "@/lib/serializers";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { id: rawId } = await params;
  const id = decodeURIComponent(rawId);
  const guide = await prisma.guide.findFirst({
    where: {
      OR: [{ id }, { slug: id }]
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
    return NextResponse.json({ error: "Специалист не найден" }, { status: 404 });
  }

  return NextResponse.json({
    guide: serializeGuide(guide),
    tours: guide.tours.map(serializeTour),
    reviews: guide.reviews.map(serializeReview)
  });
}
