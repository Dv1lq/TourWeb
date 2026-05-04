"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Loader2, ShieldCheck } from "lucide-react";

type CheckState = {
  status: "valid" | "expired" | "not_found";
  certificateNumber: string;
  issuer: string;
  checkedAt: string;
};

export function CertificateBadge({ guideSlug }: { guideSlug: string }) {
  const [check, setCheck] = useState<CheckState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/certificate-check/${guideSlug}`)
      .then((response) => response.json())
      .then((payload) => setCheck(payload.certificate))
      .finally(() => setLoading(false));
  }, [guideSlug]);

  if (loading) {
    return (
      <div className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600">
        <Loader2 className="h-4 w-4 animate-spin" />
        Проверяем сертификат
      </div>
    );
  }

  if (!check || check.status !== "valid") {
    return (
      <div className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
        <ShieldCheck className="h-4 w-4" />
        Сертификат требует проверки
      </div>
    );
  }

  return (
    <div className="inline-flex flex-wrap items-center gap-2 rounded-lg bg-teal-50 px-3 py-2 text-sm font-semibold text-brand">
      <BadgeCheck className="h-4 w-4" />
      Сертификат подтвержден: {check.certificateNumber}
    </div>
  );
}
