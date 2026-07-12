import DetailInfoModal from "./detail-info-modal";
import { getAreaDetailOrNotFound } from "../server/get-area-detail-or-not-found";

type Props = {
  areaId: number;
};

export default async function DetailInfoModalRoute({ areaId }: Props) {
  const area = await getAreaDetailOrNotFound(areaId);

  return <DetailInfoModal areaId={areaId} area={area} />;
}
