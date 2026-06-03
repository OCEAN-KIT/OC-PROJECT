import "server-only";

import type {
  AreaSummary,
  AreasResponse,
  RestorationRegion,
} from "@ocean-kit/dashboard-domain/types/areas";

const REVALIDATE_SECONDS = 3600;

function getApiBaseUrl() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is required to fetch areas.");
  }

  return apiBaseUrl;
}

export async function getCachedAreas(
  region: RestorationRegion,
): Promise<AreaSummary[]> {
  const url = new URL("/api/dashboard/areas", getApiBaseUrl());
  url.searchParams.set("region", region);

  const res = await fetch(url, {
    next: {
      revalidate: REVALIDATE_SECONDS,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch dashboard areas for ${region}.`);
  }

  const body = (await res.json()) as AreasResponse;
  return body.data.content;
}

export async function getCachedAreasByRegion(): Promise<
  Record<RestorationRegion, AreaSummary[]>
> {
  const [pohangAreas, uljinAreas] = await Promise.all([
    getCachedAreas("POHANG"),
    getCachedAreas("ULJIN"),
  ]);

  return {
    POHANG: pohangAreas,
    ULJIN: uljinAreas,
  };
}
