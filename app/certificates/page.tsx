import { GuideCard } from "@/components/GuideCard";
import { prisma } from "@/lib/prisma";
import { serializeGuide } from "@/lib/serializers";

export default async function CertificatesPage() {
  const guides = await prisma.guide.findMany({ where: { verified: true }, orderBy: { rating: "desc" } });

  return (
    <div className="container-page py-10">
      <h1 className="section-title">Сертифицированные гиды</h1>
      <p className="mt-2 text-sm text-slate-600">Только специалисты с подтвержденным сертификатом.</p>
      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        {guides.map((guide) => (
          <GuideCard key={guide.id} guide={serializeGuide(guide)} />
        ))}
      </div>
    </div>
  );
}
