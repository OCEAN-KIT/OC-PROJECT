import axiosInstance from '@ocean-kit/shared-axios/axiosInstance'

const DEFAULT_UPLOAD_TIMEOUT_MS = 30_000

type UploadImageOptions = {
  timeoutMs?: number
}

export class UploadImageTimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`S3 업로드 시간 초과 (${timeoutMs}ms)`)
    this.name = 'UploadImageTimeoutError'
  }
}

export async function uploadImage(
  image: File,
  options: UploadImageOptions = {},
): Promise<string> {
  const extension = (image.name.split('.').pop() || 'jpg').toLowerCase()
  const timeoutMs = options.timeoutMs ?? DEFAULT_UPLOAD_TIMEOUT_MS

  const { data: body } = await axiosInstance.get(
    '/api/image/presigned-put-url',
    { params: { extension } },
  )

  const data = body?.data ?? {}
  const uploadUrl = data.uploadUrl ?? data.presignedUrl
  const key = data.key

  if (!uploadUrl || !key) {
    throw new Error('presigned url 발급 실패')
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    controller.abort()
  }, timeoutMs)

  try {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: image,
      headers: { 'Content-Type': image.type || 'application/octet-stream' },
      signal: controller.signal,
    })

    if (!response.ok) {
      const text = await response.text().catch(() => '')
      throw new Error(`S3 업로드 실패: ${response.status} ${text}`)
    }

    return key
  } catch (error) {
    if (controller.signal.aborted) {
      throw new UploadImageTimeoutError(timeoutMs)
    }

    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function deleteImage(key: string): Promise<void> {
  await axiosInstance.delete('/api/image', {
    data: { key },
    params: { key },
  })
}
