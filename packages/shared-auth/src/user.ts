import type { AxiosInstance } from "axios";
import type { ApiResponse } from "@ocean-kit/shared-types/api";

export type UserApiClient = Pick<AxiosInstance, "get" | "patch">;

export type MyInfoData = {
  id: string | number;
  nickname: string | null;
  email: string | null;
  phone: string | null;
};

export type MyInfoResponse = ApiResponse<MyInfoData>;

export type UpdateMyInfoRequest = {
  nickname: string;
  email: string;
  phone: string;
};

export type UpdateMyInfoResponse = ApiResponse<unknown>;

export async function myInfo(client: UserApiClient): Promise<MyInfoResponse> {
  const { data } = await client.get<MyInfoResponse>("/api/user/my/info");
  return data;
}

export async function updateMyInfo(
  client: UserApiClient,
  payload: UpdateMyInfoRequest,
): Promise<UpdateMyInfoResponse> {
  const me = await myInfo(client);
  const userId = me?.data?.id;

  if (!userId && userId !== 0) {
    throw new Error("user id not found");
  }

  const { data } = await client.patch<UpdateMyInfoResponse>(
    `/api/user/${userId}`,
    payload,
  );

  return data;
}
