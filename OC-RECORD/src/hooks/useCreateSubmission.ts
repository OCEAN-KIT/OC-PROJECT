"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadImage } from "@/api/upload-image";
import {
  formToPayload,
  createSubmission,
  type FormToPayloadParams,
} from "@/api/submissions";

type Params = {
  form: FormToPayloadParams["form"];
  details: string;
  files: File[];
};

export function useCreateSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ form, details, files }: Params) => {
      // 1. 첨부파일 업로드
      const attachments = await Promise.all(
        files.map(async (file) => {
          const fileUrl = await uploadImage(file);
          return {
            fileName: file.name,
            fileUrl,
            mimeType: file.type || "application/octet-stream",
            fileSize: file.size,
          };
        }),
      );

      // 2. payload 변환 & API 호출
      const payload = formToPayload({ form, details, attachments });
      const result = await createSubmission(payload);

      if (!result.success) {
        const msg =
          typeof result.message === "string"
            ? result.message
            : "제출에 실패했습니다.";
        throw new Error(msg);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
  });
}
