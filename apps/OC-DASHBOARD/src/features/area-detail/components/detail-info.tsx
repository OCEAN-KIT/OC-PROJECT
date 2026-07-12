import Header from "./header";
import OverviewTab from "./tabs/overview-tab";
import StatusTab from "./tabs/status-tab";
import EcologyTab from "./tabs/ecology-tab";
import EnvironmentTab from "./tabs/environment-tab";
import PhotosTab from "./tabs/photos-tab";
import { getAreaDetailOrNotFound } from "../server/get-area-detail-or-not-found";

type Props = {
  areaId: number;
};

export default async function DetailInfo({ areaId }: Props) {
  const area = await getAreaDetailOrNotFound(areaId);

  return (
    <div className="min-h-screen bg-transparent text-white">
      <div className="mx-auto max-w-[820px] px-5 py-6 space-y-6">
        <Header overview={area.overview} />

        <OverviewTab data={area} />
        <StatusTab data={area} />
        <EcologyTab data={area} />
        <EnvironmentTab data={area} />
        <PhotosTab data={area} />
      </div>
    </div>
  );
}
