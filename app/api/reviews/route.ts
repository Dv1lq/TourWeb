import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeReview } from "@/lib/serializers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tourId = searchParams.get("tourId");
  const guideId = searchParams.get("guideId");

  const reviews = await prisma.review.findMany({
    where: {
      ...(tourId ? { tour: { is: { OR: [{ id: tourId }, { slug: tourId }] } } } : {}),
      ...(guideId ? { guide: { is: { OR: [{ id: guideId }, { slug: guideId }] } } } : {})
    },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  return NextResponse.json({ reviews: reviews.map(serializeReview) });
}
