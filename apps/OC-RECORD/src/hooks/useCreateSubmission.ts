"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteImage, uploadImage } from "@/api/upload-image";
import { createSubmission } from "@/api/createSubmission";
import { queryKeys } from "@/react-query/keys";
import { formToPayload, type FormToPayloadParams } from "@/utils/formToPayload";
import type { SubmissionAttachment } from "@ocean-kit/submission-domain/types/submission";

type Params = {
  form: FormToPayloadParams["form"];
  details: string;
  files: File[];
};

function toError(error: unknown, fallbackMessage: string) {
  return error instanceof Error ? error : new Error(fallbackMessage);
}

async function cleanupUploadedImages(keys: string[]) {
  await Promise.allSettled(keys.map((key) => deleteImage(key)));
}

export function useCreateSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ form, details, files }: Params) => {
      const uploadedKeys: string[] = [];

      const uploadResults = await Promise.allSettled(
        files.map(async (file) => {
          const fileUrl = await uploadImage(file);
          uploadedKeys.push(fileUrl);

          return {
            fileName: file.name,
            fileUrl,
            mimeType: file.type || "application/octet-stream",
            fileSize: file.size,
          };
        }),
      );

      const failedUpload = uploadResults.find(
        (result) => result.status === "rejected",
      );

      if (failedUpload?.status === "rejected") {
        await cleanupUploadedImages(uploadedKeys);
        throw toError(failedUpload.reason, "첨부파일 업로드에 실패했습니다.");
      }

      const attachments: SubmissionAttachment[] = uploadResults.flatMap(
        (result) => (result.status === "fulfilled" ? [result.value] : []),
      );

      try {
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
      } catch (error) {
        await cleanupUploadedImages(uploadedKeys);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.submissions.all });
    },
  });
}
