import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  deleteMediaLog,
  patchMediaLog,
  postMediaLog,
} from '@ocean-kit/dashboard-domain/api/areaMediaLogs'
import type { MediaCategory } from '@ocean-kit/dashboard-domain/types/areaLogPayloads'
import { deleteImage, uploadImage } from '../api/uploadImage'
import { queryKeys } from '../../queryKeys'

type PostMediaLogInput = {
  file: File
  recordDate: string
  caption: string
  category: MediaCategory
}

type PatchMediaLogInput = {
  logId: number
  file?: File
  recordDate: string
  caption: string
  category: MediaCategory
}

export function usePostMediaLog(areaId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['areas', areaId, 'post-media-log'],
    mutationFn: async (input: PostMediaLogInput) => {
      const key = await uploadImage(input.file)

      try {
        return await postMediaLog(areaId, {
          recordDate: input.recordDate,
          mediaUrl: key,
          caption: input.caption,
          category: input.category,
        })
      } catch (error) {
        await deleteImage(key).catch(() => undefined)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.areas.mediaLogs(areaId),
      })
    },
  })
}

export function usePatchMediaLog(areaId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['areas', areaId, 'patch-media-log'],
    mutationFn: async (input: PatchMediaLogInput) => {
      const key = input.file ? await uploadImage(input.file) : undefined

      try {
        return await patchMediaLog(areaId, input.logId, {
          recordDate: input.recordDate,
          ...(key && { mediaUrl: key }),
          caption: input.caption,
          category: input.category,
        })
      } catch (error) {
        if (key) {
          await deleteImage(key).catch(() => undefined)
        }
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.areas.mediaLogs(areaId),
      })
    },
  })
}

export function useDeleteMediaLog(areaId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['areas', areaId, 'delete-media-log'],
    mutationFn: (logId: number) => deleteMediaLog(areaId, logId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.areas.mediaLogs(areaId),
      })
    },
  })
}
