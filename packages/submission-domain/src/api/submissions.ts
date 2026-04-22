import type { AxiosInstance } from "axios";
import type {
  GetSubmissionListParams,
  SubmissionDetailResponse,
  SubmissionListResponse,
} from "../types/submission";

export type SubmissionReadApiClient = Pick<AxiosInstance, "get">;

export async function getSubmissionList(
  client: SubmissionReadApiClient,
  params: GetSubmissionListParams = {},
): Promise<SubmissionListResponse> {
  const { data } = await client.get<SubmissionListResponse>(
    "/api/admin/submissions",
    {
      params,
    },
  );

  return data;
}

export async function getSubmissionDetail(
  client: SubmissionReadApiClient,
  id: number | string,
): Promise<SubmissionDetailResponse> {
  const { data } = await client.get<SubmissionDetailResponse>(
    `/api/admin/submissions/${id}`,
  );

  return data;
}
