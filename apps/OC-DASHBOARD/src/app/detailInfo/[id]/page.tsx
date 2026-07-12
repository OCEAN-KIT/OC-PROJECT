import { Suspense } from "react";
import { notFound } from "next/navigation";
import DetailInfo from "@/components/detail-info/detail-info";
import DetailInfoLoading from "@/components/detail-info/detail-info-loading";

export const revalidate = 600;

export function generateStaticParams(): { id: string }[] {
  return [];
}

export default async function DetailInfoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const areaId = Number(id);

  if (!Number.isSafeInteger(areaId)) {
    notFound();
  }

  return (
    <Suspense fallback={<DetailInfoLoading />}>
      <DetailInfo areaId={areaId} />
    </Suspense>
  );
}
