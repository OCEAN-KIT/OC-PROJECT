import type { AxiosInstance } from "axios";
import type {
  GetSubmissionListParams,
  SubmissionDetailResponse,
  SubmissionListResponse,
} from "../types/submission";

export type SubmissionReadApiClient = Pick<AxiosInstance, "get">;

export type SubmissionReadApiOptions = {
  basePath?: string;
};

function getSubmissionsBasePath(options?: SubmissionReadApiOptions) {
  if (!options?.basePath) {
    throw new Error("submission read API basePath is required.");
  }

  return options.basePath.replace(/\/+$/, "");
}

export async function getSubmissionList(
  client: SubmissionReadApiClient,
  params: GetSubmissionListParams = {},
  options?: SubmissionReadApiOptions,
): Promise<SubmissionListResponse> {
  const basePath = getSubmissionsBasePath(options);
  const { data } = await client.get<SubmissionListResponse>(
    basePath,
    {
      params,
    },
  );

  return data;
}

export async function getSubmissionDetail(
  client: SubmissionReadApiClient,
  id: number | string,
  options?: SubmissionReadApiOptions,
): Promise<SubmissionDetailResponse> {
  const basePath = getSubmissionsBasePath(options);
  const { data } = await client.get<SubmissionDetailResponse>(
    `${basePath}/${id}`,
  );

  return data;
}
