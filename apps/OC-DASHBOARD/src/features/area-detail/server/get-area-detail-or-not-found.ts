import "server-only";

import axios from "axios";
import { notFound } from "next/navigation";
import { getAreaDetail } from "@ocean-kit/dashboard-domain/api/areaDetail";

export async function getAreaDetailOrNotFound(areaId: number) {
  try {
    const { data } = await getAreaDetail(areaId);

    if (!data) {
      notFound();
    }

    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      notFound();
    }

    throw error;
  }
}
