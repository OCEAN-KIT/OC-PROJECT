"use client";

import SiteSurvey from "./SiteSurvey";
import AlgaeStatus from "./AlgaeStatus";
import PreciseMeasurement from "./PreciseMeasurement";

export default function MonitoringWrapper() {
  return (
    <>
      <SiteSurvey />
      <AlgaeStatus />
      <PreciseMeasurement />
    </>
  );
}
