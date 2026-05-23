import axiosInstance from '@ocean-kit/shared-axios/axiosInstance'

export async function uploadImage(image: File): Promise<string> {
  const extension = (image.name.split('.').pop() || 'jpg').toLowerCase()

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

  const response = await fetch(uploadUrl, {
    method: 'PUT',
    body: image,
    headers: { 'Content-Type': image.type || 'application/octet-stream' },
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`S3 업로드 실패: ${response.status} ${text}`)
  }

  return key
}
