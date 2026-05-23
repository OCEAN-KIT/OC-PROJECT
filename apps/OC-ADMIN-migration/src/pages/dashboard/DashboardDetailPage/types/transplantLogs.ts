import type { TransplantLogPayload } from '@ocean-kit/dashboard-domain/types/areaLogPayloads'

export type TransplantLogEntry = TransplantLogPayload & {
  id: number
  methodLabel: string
  unit: string
}

export type SpeciesSection = {
  speciesId: number
  speciesName: string
  logs: TransplantLogEntry[]
}
