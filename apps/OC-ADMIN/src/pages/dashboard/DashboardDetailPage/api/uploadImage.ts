import axiosInstance from '@ocean-kit/shared-axios/axiosInstance'
import {
  createS3UploadClient,
  UploadImageTimeoutError,
} from '@ocean-kit/shared-s3/upload'

const s3UploadClient = createS3UploadClient(axiosInstance)

export { UploadImageTimeoutError }

export const uploadImage = s3UploadClient.uploadImage
export const deleteImage = s3UploadClient.deleteImage
