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

const ADMIN_SPECIES_PATH = '/api/admin/species'

export async function fetchSpecies(): Promise<Species[]> {
  const res = await axiosInstance.get<ApiResponse<Species[]>>(
    ADMIN_SPECIES_PATH,
  )
  return res.data.data
}

export async function createSpecies(
  data: CreateSpeciesRequest,
): Promise<CreateSpeciesResponse> {
  const res = await axiosInstance.post<CreateSpeciesResponse>(
    ADMIN_SPECIES_PATH,
    data,
  )
  return res.data
}

export async function updateSpecies(
  id: number,
  data: CreateSpeciesRequest,
): Promise<CreateSpeciesResponse> {
  const res = await axiosInstance.patch<CreateSpeciesResponse>(
    `${ADMIN_SPECIES_PATH}/${id}`,
    data,
  )
  return res.data
}

export async function deleteSpecies(id: number): Promise<void> {
  await axiosInstance.delete(`${ADMIN_SPECIES_PATH}/${id}`)
}
