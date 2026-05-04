"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import { TourMap } from "@/components/TourMap";

const TourMapDynamic = dynamic(() => import("@/components/TourMap").then((mod) => mod.TourMap), {
  ssr: false,
  loading: () => (
    <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600">
      Карта временно недоступна
    </div>
  )
});

type TourMapClientProps = ComponentProps<typeof TourMap>;

export function TourMapClient(props: TourMapClientProps) {
  return <TourMapDynamic {...props} />;
}
