"use client";

import type { OcRecordForm } from "@ocean-kit/submission-domain/types/form";
import SiteSurvey from "./SiteSurvey";
import AlgaeStatus from "./AlgaeStatus";
import PreciseMeasurement from "./PreciseMeasurement";

type Props = {
  form: OcRecordForm;
  setMonitoring: (patch: Partial<OcRecordForm["monitoring"]>) => void;
};

export default function MonitoringWrapper({ form, setMonitoring }: Props) {
  return (
    <>
      <SiteSurvey monitoring={form.monitoring} setMonitoring={setMonitoring} />
      <AlgaeStatus monitoring={form.monitoring} setMonitoring={setMonitoring} />
      <PreciseMeasurement
        monitoring={form.monitoring}
        setMonitoring={setMonitoring}
      />
    </>
  );
}
