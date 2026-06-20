import { notFound } from "next/navigation";
import { getAreaDetail } from "@ocean-kit/dashboard-domain/api/areaDetail";
import DetailInfoModal from "./detail-info-modal";

type Props = {
  areaId: number;
};

export default async function DetailInfoModalRoute({ areaId }: Props) {
  const { data: area } = await getAreaDetail(areaId);

  if (!area) {
    notFound();
  }

  return <DetailInfoModal areaId={areaId} area={area} />;
}
