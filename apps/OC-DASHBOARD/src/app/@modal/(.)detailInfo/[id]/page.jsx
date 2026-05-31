"use client";

import * as React from "react";
import DetailInfoModal from "@/components/detail-info/detail-info-modal";

export default function Page({ params }) {
  const { id } = React.use(params);

  return <DetailInfoModal areaId={id} />;
}
