import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  generateDraftId,
  getDraftById,
  upsertDraft,
} from "@/utils/diveDraftStorage";
import {
  createDefaultForm,
  createDefaultFormValues,
  type SubmissionFormValues,
} from "@/components/dive-create/DiveFormProvider";
import type { OcRecordForm } from "@ocean-kit/submission-domain/types/form";
import {
  useWatch,
  type Control,
  type UseFormGetValues,
  type UseFormReset,
} from "react-hook-form";

const buildAttachmentMeta = (attachments: File[]) =>
  attachments.map((file) => ({
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  }));

const buildDraftSnapshot = (
  targetForm: OcRecordForm,
  targetDetails: string,
  targetAttachments: File[],
) =>
  JSON.stringify({
    form: targetForm,
    details: targetDetails,
    attachments: buildAttachmentMeta(targetAttachments),
  });

type WatchedSubmissionFormValues = {
  details?: SubmissionFormValues["details"];
  basic?: Partial<SubmissionFormValues["basic"]>;
  env?: Partial<SubmissionFormValues["env"]>;
  transplant?: Partial<SubmissionFormValues["transplant"]>;
  grazing?: Partial<SubmissionFormValues["grazing"]>;
  substrate?: Partial<SubmissionFormValues["substrate"]>;
  monitoring?: Partial<SubmissionFormValues["monitoring"]>;
  cleanup?: Partial<SubmissionFormValues["cleanup"]>;
};

const completeSubmissionFormValues = (
  values?: WatchedSubmissionFormValues,
): SubmissionFormValues => {
  const defaults = createDefaultFormValues();

  return {
    details: values?.details ?? defaults.details,
    basic: {
      ...defaults.basic,
      ...(values?.basic ?? {}),
    },
    env: {
      ...defaults.env,
      ...(values?.env ?? {}),
    },
    transplant: {
      ...defaults.transplant,
      ...(values?.transplant ?? {}),
    },
    grazing: {
      ...defaults.grazing,
      ...(values?.grazing ?? {}),
    },
    substrate: {
      ...defaults.substrate,
      ...(values?.substrate ?? {}),
    },
    monitoring: {
      ...defaults.monitoring,
      ...(values?.monitoring ?? {}),
    },
    cleanup: {
      ...defaults.cleanup,
      ...(values?.cleanup ?? {}),
    },
  };
};

export function useDiveDraft({
  getValues,
  reset,
  control,
  attachments,
}: {
  getValues: UseFormGetValues<SubmissionFormValues>;
  reset: UseFormReset<SubmissionFormValues>;
  control: Control<SubmissionFormValues>;
  attachments: File[];
}) {
  const router = useRouter();
  const [draftId, setDraftId] = useState<string | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(null);
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);
  const initializedRef = useRef(false);

  const watchedValues = useWatch<SubmissionFormValues>({ control });
  const currentValues = useMemo(
    () => completeSubmissionFormValues(watchedValues),
    [watchedValues],
  );
  const currentDetails = currentValues.details;
  const currentForm = useMemo(() => {
    const { details: _details, ...form } = currentValues;
    return form;
  }, [currentValues]);

  const currentDraftSnapshot = useMemo(
    () => buildDraftSnapshot(currentForm, currentDetails, attachments),
    [currentForm, currentDetails, attachments],
  );

  const hasUnsavedChanges =
    savedSnapshot !== null && currentDraftSnapshot !== savedSnapshot;

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (typeof window === "undefined") return;

    const sp = new URLSearchParams(window.location.search);
    const fromParam = sp.get("draftId");

    const id = fromParam ?? generateDraftId();
    setDraftId(id);

    const existing = fromParam ? getDraftById(fromParam) : null;
    const baseForm = createDefaultForm();
    if (!existing) {
      const defaultValues = createDefaultFormValues();
      const { details: defaultDetails, ...defaultForm } = defaultValues;

      reset(defaultValues);
      setSavedSnapshot(buildDraftSnapshot(defaultForm, defaultDetails, []));
      return;
    }

    const loadedDetails = existing.details ?? "";
    const loadedForm: OcRecordForm = {
      ...baseForm,
      basic: {
        ...baseForm.basic,
        siteName: existing.siteName ?? baseForm.basic.siteName,
        date: existing.date ?? baseForm.basic.date,
        time: existing.time ?? baseForm.basic.time,
        diveRound: existing.diveRound ?? baseForm.basic.diveRound,
        workType: existing.workType ?? baseForm.basic.workType,
        workers: existing.workers ?? baseForm.basic.workers,
      },
      env: {
        ...baseForm.env,
        avgDepthM: existing.avgDepthM ?? baseForm.env.avgDepthM,
        maxDepthM: existing.maxDepthM ?? baseForm.env.maxDepthM,
        waterTempC: existing.waterTempC ?? baseForm.env.waterTempC,
        visibilityStatus:
          existing.visibilityStatus ?? baseForm.env.visibilityStatus,
        waveStatus: existing.waveStatus ?? baseForm.env.waveStatus,
        surgeStatus: existing.surgeStatus ?? baseForm.env.surgeStatus,
        currentStatus: existing.currentStatus ?? baseForm.env.currentStatus,
      },
      transplant: existing.transplant
        ? { ...baseForm.transplant, ...existing.transplant }
        : baseForm.transplant,
      grazing: existing.grazing
        ? { ...baseForm.grazing, ...existing.grazing }
        : baseForm.grazing,
      substrate: existing.substrate
        ? { ...baseForm.substrate, ...existing.substrate }
        : baseForm.substrate,
      monitoring: existing.monitoring
        ? { ...baseForm.monitoring, ...existing.monitoring }
        : baseForm.monitoring,
      cleanup: existing.cleanup
        ? { ...baseForm.cleanup, ...existing.cleanup }
        : baseForm.cleanup,
    };

    const loadedValues: SubmissionFormValues = {
      ...loadedForm,
      details: loadedDetails,
    };

    reset(loadedValues);
    setSavedSnapshot(buildDraftSnapshot(loadedForm, loadedDetails, []));
  }, [reset]);

  const handleSaveDraft = (opts: { silent?: boolean } = {}) => {
    const nowIso = new Date().toISOString();
    const values = getValues();
    const { details: draftDetails, ...draftForm } = values;

    const baseDraft = {
      id: draftId || generateDraftId(),
      siteName: draftForm.basic.siteName,
      date: draftForm.basic.date,
      time: draftForm.basic.time,
      diveRound: draftForm.basic.diveRound,
      workType: draftForm.basic.workType,
      workers: draftForm.basic.workers,
      avgDepthM: draftForm.env.avgDepthM,
      maxDepthM: draftForm.env.maxDepthM,
      waterTempC: draftForm.env.waterTempC,
      visibilityStatus: draftForm.env.visibilityStatus,
      waveStatus: draftForm.env.waveStatus,
      surgeStatus: draftForm.env.surgeStatus,
      currentStatus: draftForm.env.currentStatus,
      details: draftDetails,
      updatedAt: nowIso,
    };

    let sectionData = {};
    switch (draftForm.basic.workType) {
      case "이식":
        sectionData = { transplant: draftForm.transplant };
        break;
      case "조식동물 작업":
        sectionData = { grazing: draftForm.grazing };
        break;
      case "부착기질 개선":
        sectionData = { substrate: draftForm.substrate };
        break;
      case "모니터링":
        sectionData = { monitoring: draftForm.monitoring };
        break;
      case "해양정화":
        sectionData = { cleanup: draftForm.cleanup };
        break;
    }

    const existing = draftId ? getDraftById(draftId) : null;
    const baseMeta = existing
      ? { id: existing.id, createdAt: existing.createdAt }
      : {};
    const finalDraft = {
      ...baseMeta,
      ...baseDraft,
      ...sectionData,
      createdAt: existing?.createdAt ?? nowIso,
    };

    if (!draftId) setDraftId(finalDraft.id);

    upsertDraft(finalDraft);
    setSavedSnapshot(buildDraftSnapshot(draftForm, draftDetails, attachments));

    if (!opts.silent) alert("임시 저장했습니다.");
  };

  const handleBack = () => {
    if (!hasUnsavedChanges) {
      router.back();
      return;
    }

    setIsExitConfirmOpen(true);
  };

  const handleKeepEditing = () => setIsExitConfirmOpen(false);

  const handleLeaveWithoutSave = () => {
    setIsExitConfirmOpen(false);
    router.back();
  };

  const handleSaveAndLeave = () => {
    setIsExitConfirmOpen(false);
    handleSaveDraft({ silent: true });
    router.back();
  };

  return {
    currentForm,
    currentDetails,
    isExitConfirmOpen,
    hasUnsavedChanges,
    handleSaveDraft,
    handleBack,
    handleKeepEditing,
    handleLeaveWithoutSave,
    handleSaveAndLeave,
  };
}
