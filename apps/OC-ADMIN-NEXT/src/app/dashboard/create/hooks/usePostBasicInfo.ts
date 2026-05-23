import { useMutation } from "@tanstack/react-query";
import { postBasicInfo } from "@ocean-kit/dashboard-domain/api/areaBasicInfo";
import type { BasicPayload } from "@ocean-kit/dashboard-domain/types/areaBasicInfo";

export default function usePostBasicInfo() {
  return useMutation({
    mutationKey: ["areas", "post"],
    mutationFn: (payload: BasicPayload) => postBasicInfo(payload),
  });
}
