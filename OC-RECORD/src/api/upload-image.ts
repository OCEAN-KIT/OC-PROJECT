import axiosInstance from "@/utils/axiosInstance";

export async function uploadImage(image: File): Promise<string> {
  const ext = (image.name.split(".").pop() || "jpg").toLowerCase();

  const { data: body } = await axiosInstance.get(
    "/api/image/presigned-put-url",
    { params: { extension: ext } }
  );

  const d = body?.data ?? {};
  const uploadUrl = d.uploadUrl ?? d.presignedUrl;
  const key = d.key;
  if (!uploadUrl || !key) throw new Error("presigned url 발급 실패");

  const res = await fetch(uploadUrl, {
    method: "PUT",
    body: image,
    headers: { "Content-Type": image.type || "application/octet-stream" },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`S3 업로드 실패: ${res.status} ${text}`);
  }

  return key;
}
