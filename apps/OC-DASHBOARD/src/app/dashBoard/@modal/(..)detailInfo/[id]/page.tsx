import { notFound } from "next/navigation";
import DetailInfoModalRoute from "@/components/detail-info/detail-info-modal-route";

export const revalidate = 600;

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams(): { id: string }[] {
  return [];
}

function parseAreaId(id: string) {
  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const areaId = Number(id);

  if (!Number.isSafeInteger(areaId)) {
    notFound();
  }

  return areaId;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const areaId = parseAreaId(id);

  return <DetailInfoModalRoute areaId={areaId} />;
}
