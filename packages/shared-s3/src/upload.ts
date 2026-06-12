const DEFAULT_UPLOAD_TIMEOUT_MS = 30_000;
const DEFAULT_PRESIGNED_PUT_URL_PATH = "/api/image/presigned-put-url";
const DEFAULT_DELETE_IMAGE_PATH = "/api/image";

type HttpRequestConfig = {
  params?: Record<string, string>;
  data?: unknown;
};

type HttpResponse<T> = {
  data: T;
};

export type S3ApiClient = {
  get: <T>(url: string, config?: HttpRequestConfig) => Promise<HttpResponse<T>>;
  delete: (url: string, config?: HttpRequestConfig) => Promise<unknown>;
};

export type UploadImageOptions = {
  timeoutMs?: number;
  presignedPutUrlPath?: string;
};

export type DeleteImageOptions = {
  deleteImagePath?: string;
};

type PresignedPutUrlBody = {
  data?: {
    uploadUrl?: string;
    presignedUrl?: string;
    key?: string;
  };
};

export class UploadImageTimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`S3 업로드 시간 초과 (${timeoutMs}ms)`);
    this.name = "UploadImageTimeoutError";
  }
}

export function getFileExtension(file: File): string {
  return (file.name.split(".").pop() || "jpg").toLowerCase();
}

export async function uploadImageToS3(
  apiClient: S3ApiClient,
  image: File,
  options: UploadImageOptions = {},
): Promise<string> {
  const extension = getFileExtension(image);
  const timeoutMs = options.timeoutMs ?? DEFAULT_UPLOAD_TIMEOUT_MS;
  const presignedPutUrlPath =
    options.presignedPutUrlPath ?? DEFAULT_PRESIGNED_PUT_URL_PATH;

  const { data: body } = await apiClient.get<PresignedPutUrlBody>(
    presignedPutUrlPath,
    { params: { extension } },
  );

  const presignedData = body?.data ?? {};
  const uploadUrl = presignedData.uploadUrl ?? presignedData.presignedUrl;
  const key = presignedData.key;

  if (!uploadUrl || !key) {
    throw new Error("presigned url 발급 실패");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      body: image,
      headers: { "Content-Type": image.type || "application/octet-stream" },
      signal: controller.signal,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`S3 업로드 실패: ${response.status} ${text}`);
    }

    return key;
  } catch (error) {
    if (controller.signal.aborted) {
      throw new UploadImageTimeoutError(timeoutMs);
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function deleteImageFromS3(
  apiClient: S3ApiClient,
  key: string,
  options: DeleteImageOptions = {},
): Promise<void> {
  const deleteImagePath = options.deleteImagePath ?? DEFAULT_DELETE_IMAGE_PATH;

  await apiClient.delete(deleteImagePath, {
    data: { key },
    params: { key },
  });
}

export function createS3UploadClient(apiClient: S3ApiClient) {
  return {
    uploadImage: (image: File, options?: UploadImageOptions) =>
      uploadImageToS3(apiClient, image, options),
    deleteImage: (key: string, options?: DeleteImageOptions) =>
      deleteImageFromS3(apiClient, key, options),
  };
}
