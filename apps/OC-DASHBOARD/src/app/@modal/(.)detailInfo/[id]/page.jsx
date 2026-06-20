import { notFound } from "next/navigation";
import DetailInfoModalRoute from "@/components/detail-info/detail-info-modal-route";

export const revalidate = 600;

export function generateStaticParams() {
  return [];
}

function parseAreaId(id) {
  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const areaId = Number(id);

  if (!Number.isSafeInteger(areaId)) {
    notFound();
  }

  return areaId;
}

export default async function Page({ params }) {
  const { id } = await params;
  const areaId = parseAreaId(id);

  return <DetailInfoModalRoute areaId={areaId} />;
}
