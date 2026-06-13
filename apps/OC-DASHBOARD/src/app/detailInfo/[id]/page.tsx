import { Suspense } from "react";
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
  const areaId = Number(id);

  if (!Number.isInteger(areaId)) {
    throw new Error(`Invalid area id. id: ${id}`);
  }

  return (
    <Suspense fallback={<DetailInfoLoading />}>
      <DetailInfo areaId={areaId} />
    </Suspense>
  );
}
