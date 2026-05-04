import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { id: rawId } = await params;
  const id = decodeURIComponent(rawId);
  const guide = await prisma.guide.findFirst({
    where: {
      OR: [{ id }, { slug: id }, { certificateNumber: id }]
    }
  });

  if (!guide) {
    return NextResponse.json({
      certificate: {
        status: "not_found",
        checkedAt: new Date().toISOString()
      }
    });
  }

  return NextResponse.json({
    certificate: {
      status: guide.verified ? "valid" : "expired",
      guideName: guide.name,
      certificateNumber: guide.certificateNumber,
      issuedAt: guide.certificateIssuedAt.toISOString(),
      issuer: guide.certificateIssuer,
      checkedAt: new Date().toISOString(),
      source: "Mock certificate registry API"
    }
  });
}
