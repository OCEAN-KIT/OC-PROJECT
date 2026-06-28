import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { UseFormGetValues } from "react-hook-form";
import type { OcRecordForm } from "@ocean-kit/submission-domain/types/form";

import type { SubmissionFormValues } from "@/components/dive-create/DiveFormProvider";
import { validateSubmission } from "@/utils/validateSubmission";
import { useCreateSubmission } from "./useCreateSubmission";
import { useIsLoggined } from "./useIsLoggined";
import { useOnlineStatus } from "./useOnlineStatus";

type Props = {
  getValues: UseFormGetValues<SubmissionFormValues>;
  attachments: File[];
  currentForm: OcRecordForm;
  currentDetails: string;
};

export function useSubmitSubmission({
  getValues,
  attachments,
  currentForm,
  currentDetails,
}: Props) {
  const router = useRouter();
  const isLoggedIn = useIsLoggined();
  const isOnline = useOnlineStatus();
  const { mutate: submitMutation, isPending: loading } = useCreateSubmission();
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setValidationError(null);
  }, [currentForm, currentDetails]);

  const isSubmitDisabled = loading || !isOnline || !isLoggedIn;
  const submitDisabledMessages = [
    !isOnline ? "오프라인 상태에선 제출 불가합니다." : null,
    !isLoggedIn ? "로그인 후 제출해주세요." : null,
  ].filter((message): message is string => Boolean(message));

  const handleSubmit = () => {
    if (!isOnline) {
      alert("오프라인 상태에선 제출 불가합니다.");
      return;
    }

    if (!isLoggedIn) {
      alert("로그인 후 제출해주세요.");
      return;
    }

    const values = getValues();
    const { details: submitDetails, ...formValues } = values;

    const error = validateSubmission(formValues, submitDetails);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(null);

    submitMutation(
      {
        form: formValues,
        details: submitDetails,
        files: attachments,
      },
      {
        onSuccess: () => {
          alert("제출이 완료되었습니다.");
          router.push("/");
        },
        onError: (err) => {
          alert(err.message || "제출 중 오류가 발생했습니다.");
        },
      },
    );
  };

  return {
    loading,
    isSubmitDisabled,
    submitDisabledMessages,
    validationError,
    handleSubmit,
  };
}
