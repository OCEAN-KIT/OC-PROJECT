import axiosInstance from '@ocean-kit/shared-axios/axiosInstance'
import { getSubmissionDetail } from '@ocean-kit/submission-domain/api/submissions'
import type { SubmissionDetailServer } from '@ocean-kit/submission-domain/types/submission'
import { extractFilename, saveBlobAsFile } from '../utils/download'

type CsvExportId = number | string

const ADMIN_SUBMISSIONS_BASE_PATH = '/api/admin/submissions'

export type { SubmissionDetailServer }

export async function getSubmissionDetails(id: number | string) {
  return getSubmissionDetail(axiosInstance, id, {
    basePath: ADMIN_SUBMISSIONS_BASE_PATH,
  })
}

export async function csvExportByIds(ids: CsvExportId[], filename?: string) {
  if (!ids.length) {
    throw new Error('다운로드할 ID가 없습니다.')
  }

  const response = await axiosInstance.post(
    '/api/admin/exports/download/by-ids',
    { format: 'CSV' as const, ids },
    {
      responseType: 'blob',
      headers: { Accept: 'text/csv,application/octet-stream' },
    },
  )

  const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8' })
  const contentDisposition = (
    response.headers as Record<string, string | undefined>
  )['content-disposition']
  const serverFilename = extractFilename(contentDisposition)
  const fallback =
    ids.length === 1
      ? `submission_${ids[0]}.csv`
      : `submissions_${ids.length}_items.csv`

  saveBlobAsFile(blob, filename || serverFilename || fallback)
}
