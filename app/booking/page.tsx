import { BookingForm } from "@/components/BookingForm";
import { prisma } from "@/lib/prisma";
import { serializeTour } from "@/lib/serializers";

type PageProps = {
  searchParams: Promise<{ tourId?: string }>;
};

export default async function BookingPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const tours = await prisma.tour.findMany({
    orderBy: [{ city: "asc" }, { title: "asc" }],
    include: { guide: true }
  });

  return (
    <div className="container-page py-10">
      <BookingForm tours={tours.map(serializeTour)} initialTourSlug={resolvedSearchParams.tourId} />
    </div>
  );
}
