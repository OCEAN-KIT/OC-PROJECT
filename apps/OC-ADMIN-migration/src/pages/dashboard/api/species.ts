import axiosInstance from '@ocean-kit/shared-axios/axiosInstance'

type ApiResponse<T> = {
  success: boolean
  data: T
  code?: string
  message?: string | Record<string, unknown>
  errors?: Record<string, unknown>
}

export type Species = {
  id: number
  name: string
}

export type CreateSpeciesRequest = {
  name: string
}

export type CreateSpeciesResponse = ApiResponse<Species>

export async function fetchSpecies(): Promise<Species[]> {
  const res =
    await axiosInstance.get<ApiResponse<Species[]>>('/api/bio/species')
  return res.data.data
}

export async function createSpecies(
  data: CreateSpeciesRequest,
): Promise<CreateSpeciesResponse> {
  const res = await axiosInstance.post<CreateSpeciesResponse>(
    '/api/bio/species',
    data,
  )
  return res.data
}

export async function updateSpecies(
  id: number,
  data: CreateSpeciesRequest,
): Promise<CreateSpeciesResponse> {
  const res = await axiosInstance.patch<CreateSpeciesResponse>(
    `/api/bio/species/${id}`,
    data,
  )
  return res.data
}

export async function deleteSpecies(id: number): Promise<void> {
  await axiosInstance.delete(`/api/bio/species/${id}`)
}
