const DEFAULT_UPLOAD_TIMEOUT_MS = 30_000;
const DEFAULT_PRESIGNED_PUT_URL_PATH = "/api/record/images/presigned-put-url";
const DEFAULT_DELETE_IMAGE_PATH = "/api/image";

// axios 같은 앱별 HTTP client를 직접 의존하지 않기 위한 최소 인터페이스입니다.
// shared-s3 패키지는 "어떤 client를 쓸지"가 아니라 "어떤 요청 흐름인지"만 압니다.
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

// 백엔드 presigned-url API 응답은 uploadUrl/presignedUrl 이름이 혼재될 수 있어 둘 다 허용합니다.
// key는 제출 payload나 삭제 요청에서 다시 사용할 S3 object key입니다.
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

/**
 * 이미지 파일을 S3에 직접 업로드하고, 서버가 발급한 object key를 반환합니다.
 *
 * 흐름:
 * 1. 파일 확장자를 백엔드에 보내 presigned PUT URL을 발급받습니다.
 * 2. 브라우저가 해당 presigned URL로 파일을 직접 PUT 업로드합니다.
 * 3. DB 저장에는 공개 URL이 아니라 백엔드가 내려준 S3 key를 사용합니다.
 */
export async function uploadImageToS3(
  apiClient: S3ApiClient,
  image: File,
  options: UploadImageOptions = {},
): Promise<string> {
  const extension = getFileExtension(image);
  const timeoutMs = options.timeoutMs ?? DEFAULT_UPLOAD_TIMEOUT_MS;
  const presignedPutUrlPath =
    options.presignedPutUrlPath ?? DEFAULT_PRESIGNED_PUT_URL_PATH;

  // S3 object key와 실제 업로드 URL은 백엔드가 생성합니다.
  // 프론트는 확장자만 전달해서 백엔드의 파일명/경로 정책을 따릅니다.
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

  // fetch에는 axios timeout 설정이 적용되지 않으므로 AbortController로 직접 제한합니다.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    // presigned URL은 이미 인증 정보가 포함된 임시 URL입니다.
    // 여기서는 앱 API가 아니라 S3로 바로 PUT 요청을 보냅니다.
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

    // 화면/DB에서는 이 key를 저장해두고, 조회 시 public URL로 변환해서 사용합니다.
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

  // 서버 구현 차이를 흡수하기 위해 body(data)와 query(params)에 key를 모두 실어 보냅니다.
  await apiClient.delete(deleteImagePath, {
    data: { key },
    params: { key },
  });
}

// 앱에서는 axiosInstance만 주입하면 upload/delete 함수만 간단히 가져다 쓸 수 있습니다.
export function createS3UploadClient(apiClient: S3ApiClient) {
  return {
    uploadImage: (image: File, options?: UploadImageOptions) =>
      uploadImageToS3(apiClient, image, options),
    deleteImage: (key: string, options?: DeleteImageOptions) =>
      deleteImageFromS3(apiClient, key, options),
  };
}
