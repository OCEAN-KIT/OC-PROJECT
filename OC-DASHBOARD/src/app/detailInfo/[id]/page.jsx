import DetailInfo from "@/components/detail-info/detail-info";
import React from "react";

export default function DetailInfoPage({ params }) {
  const { id } = React.use(params);
  return <DetailInfo areaId={id} />;
}
