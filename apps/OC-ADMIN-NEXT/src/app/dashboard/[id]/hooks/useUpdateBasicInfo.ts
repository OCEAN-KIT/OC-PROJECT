import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchBasicInfo } from "@ocean-kit/dashboard-domain/api/areaBasicInfo";
import type { BasicPayload } from "@ocean-kit/dashboard-domain/types/areaBasicInfo";
import { queryKeys } from "@/hooks/queryKeys";

export default function useUpdateBasicInfo(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["areas", id, "update-basic"],
    mutationFn: (payload: BasicPayload) => patchBasicInfo(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.areas.detail(id) });
    },
  });
}
