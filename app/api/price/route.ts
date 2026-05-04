import { NextResponse } from "next/server";
import { calculateTotalPrice } from "@/lib/pricing";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tourId = searchParams.get("tourId") ?? "";
  const people = Number(searchParams.get("people") ?? "1");
  const date = searchParams.get("date") ?? new Date().toISOString().slice(0, 10);

  if (!tourId || !Number.isInteger(people) || people < 1) {
    return NextResponse.json({ error: "Некорректные параметры расчета" }, { status: 400 });
  }

  const tour = await prisma.tour.findFirst({
    where: {
      OR: [{ id: tourId }, { slug: tourId }]
    }
  });

  if (!tour) {
    return NextResponse.json({ error: "Экскурсия не найдена" }, { status: 404 });
  }

  const pricing = calculateTotalPrice(tour.price, people, date);

  return NextResponse.json({
    tourId: tour.slug,
    currency: tour.currency,
    ...pricing
  });
}
