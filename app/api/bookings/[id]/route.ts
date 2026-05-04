import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { serializeBooking } from "@/lib/serializers";
import { demoUserId } from "@/lib/utils";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const updateSchema = z.object({
  status: z.enum(["confirmed", "pending", "completed", "cancelled"])
});

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Некорректный статус бронирования" }, { status: 400 });
  }

  const booking = await prisma.booking.findFirst({
    where: {
      id,
      userId: demoUserId
    }
  });

  if (!booking) {
    return NextResponse.json({ error: "Бронирование не найдено" }, { status: 404 });
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: parsed.data.status },
    include: {
      tour: {
        include: { guide: true }
      }
    }
  });

  return NextResponse.json({ booking: serializeBooking(updated) });
}
