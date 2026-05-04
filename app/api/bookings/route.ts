import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateTotalPrice } from "@/lib/pricing";
import { prisma } from "@/lib/prisma";
import { serializeBooking } from "@/lib/serializers";
import { demoUserId } from "@/lib/utils";

const bookingSchema = z.object({
  tourId: z.string().min(1),
  customerName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  date: z.string().min(1),
  people: z.number().int().min(1),
  comment: z.string().optional()
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") ?? demoUserId;

  const bookings = await prisma.booking.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      tour: {
        include: { guide: true }
      }
    }
  });

  return NextResponse.json({ bookings: bookings.map(serializeBooking) });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = bookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Некорректные данные бронирования" }, { status: 400 });
  }

  const tour = await prisma.tour.findFirst({
    where: {
      OR: [{ id: parsed.data.tourId }, { slug: parsed.data.tourId }]
    },
    include: { guide: true }
  });

  if (!tour) {
    return NextResponse.json({ error: "Экскурсия не найдена" }, { status: 404 });
  }

  if (parsed.data.people > tour.maxGroupSize) {
    return NextResponse.json({ error: `Для этой экскурсии доступно не более ${tour.maxGroupSize} участников` }, { status: 400 });
  }

  const pricing = calculateTotalPrice(tour.price, parsed.data.people, parsed.data.date);

  const booking = await prisma.booking.create({
    data: {
      userId: demoUserId,
      tourId: tour.id,
      customerName: parsed.data.customerName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      date: new Date(`${parsed.data.date}T10:00:00.000Z`),
      people: parsed.data.people,
      comment: parsed.data.comment,
      totalPrice: pricing.totalPrice,
      status: "confirmed"
    },
    include: {
      tour: {
        include: { guide: true }
      }
    }
  });

  return NextResponse.json({ booking: serializeBooking(booking), pricing }, { status: 201 });
}
