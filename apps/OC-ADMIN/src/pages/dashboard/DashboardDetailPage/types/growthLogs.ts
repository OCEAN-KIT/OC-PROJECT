import type { GrowthLogPayload } from '@ocean-kit/dashboard-domain/types/areaLogPayloads'

export type GrowthLogEntry = GrowthLogPayload & { id: number }

export type GrowthSpeciesSection = {
  speciesId: number
  speciesName: string
  logs: GrowthLogEntry[]
}
