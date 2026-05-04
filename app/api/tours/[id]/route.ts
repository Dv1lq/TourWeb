import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeTour } from "@/lib/serializers";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { id: rawId } = await params;
  const id = decodeURIComponent(rawId);
  const tour = await prisma.tour.findFirst({
    where: {
      OR: [{ id }, { slug: id }]
    },
    include: {
      guide: true,
      reviews: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!tour) {
    return NextResponse.json({ error: "Экскурсия не найдена" }, { status: 404 });
  }

  return NextResponse.json({ tour: serializeTour(tour) });
}
