import { keyToPublicUrl } from './s3'

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']

type Attachment = {
  fileUrl: string
  mimeType: string
}

export function extractImageUrls(attachments?: Attachment[]) {
  if (!attachments?.length) return []

  return attachments
    .filter((attachment) => {
      const mimeType = (attachment.mimeType || '').toLowerCase()
      if (mimeType.startsWith('image/')) return true

      const fileUrl = (attachment.fileUrl || '').toLowerCase()
      return IMAGE_EXTENSIONS.some((extension) => fileUrl.endsWith(extension))
    })
    .map((attachment) => keyToPublicUrl(attachment.fileUrl))
}
