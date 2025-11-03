import DetailInfoModal from "@/components/detail-info/detail-info-modal";
import React from "react";

export default function DetailInfoPage({ params }) {
  const { id } = React.use(params);
  return <DetailInfoModal areaId={id} />;
}
