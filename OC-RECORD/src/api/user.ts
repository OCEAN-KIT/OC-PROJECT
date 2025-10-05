// src/api/user.ts
import axiosInstance from "@/utils/axiosInstance";

type MyInfoResp = {
  success: boolean;
  data: {
    id: string | number;
    nickname: string | null;
    email: string | null;
    phone: string | null;
  };
  code?: string;
  message?: unknown;
};

export async function myInfo(): Promise<MyInfoResp> {
  const res = await axiosInstance.get("/api/user/my/info");
  return res.data;
}

export async function updateMyInfo(
  nickname: string,
  email: string,
  phone: string
): Promise<{
  success: boolean;
  data: unknown;
  code?: string;
  message?: unknown;
}> {
  const me = await myInfo();
  const userId = me?.data?.id;
  if (!userId && userId !== 0) throw new Error("user id not found");

  const body = { nickname, email, phone };

  const res = await axiosInstance.patch(`/api/user/${userId}`, body);
  return res.data;
}
