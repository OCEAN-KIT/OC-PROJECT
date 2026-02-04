// src/react-query/keys.ts
export const queryKeys = {
  myInfo: ["myInfo"] as const,
  submissions: {
    all: ["submissions"] as const,
    page: (page: number) => ["submissions", page] as const,
  },
};
