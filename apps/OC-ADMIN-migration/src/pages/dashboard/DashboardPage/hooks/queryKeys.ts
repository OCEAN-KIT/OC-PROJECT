export const queryKeys = {
  areas: {
    all: ['areas'] as const,
    list: (page: number, filters: unknown) => ['areas', page, filters] as const,
  },
}
