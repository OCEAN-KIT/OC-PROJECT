import { useQuery } from '@tanstack/react-query'
import { fetchSpecies } from '../api/species'
import { queryKeys } from '../queryKeys'

export function useSpecies() {
  return useQuery({
    queryKey: queryKeys.species,
    queryFn: fetchSpecies,
    staleTime: 1000 * 60 * 10,
  })
}
