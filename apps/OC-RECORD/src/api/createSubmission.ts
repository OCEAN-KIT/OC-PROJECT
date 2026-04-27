import type {
  SubmissionCreateRequest,
  SubmissionCreateResponse,
} from "@ocean-kit/submission-domain/types/submission";
import axiosInstance from "@/utils/axiosInstance";

export async function createSubmission(
  payload: SubmissionCreateRequest,
): Promise<SubmissionCreateResponse> {
  const { data } = await axiosInstance.post<SubmissionCreateResponse>(
    "/api/admin/submissions",
    payload,
  );

  return data;
}
