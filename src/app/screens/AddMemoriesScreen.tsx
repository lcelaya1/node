import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { FlowScreenHeader } from "../components/FlowScreenHeader";
import { AppIcon } from "../components/AppIcon";
import { IconButton } from "../components/IconButton";
import type { DemoUser } from "../lib/demoUsers";
import type { ParticipantReviewInput } from "../lib/planFeedback";
import { savePlanMemories } from "../lib/planMemories";
import { loadSavedPlans, type SavedPlan } from "../lib/plans";

type AddMemoriesState = {
  /** Diary “Add memory” entry: no Skip (user returns with back). */
  hideSkip?: boolean;
  memoryImages?: MemoryPreviewState[];
  memoryNote?: string;
  overallLabel?: string;
  overallRating?: number;
  participantReviews?: ParticipantReviewInput[];
  participants?: DemoUser[];
  selectedPlanId?: string;
  plan?: {
    id?: string | number;
    title?: string;
  };
};

type MemoryPreviewState = {
  id: string;
  name: string;
  url: string;
};

type MemoryPreview = MemoryPreviewState;

function PostPlanIntro() {
  return (
    <div className="flex w-full flex-col items-start gap-[8px]">
      <p className="w-full font-primary text-[24px] leading-[28px] text-primary-token">Keep the memories</p>
      <p className="w-full type-body-s text-secondary-token">
        We know that a picture is worth a thousand words, so store the pictures of the plan so you can go back to them.
      </p>
    </div>
  );
}

export default function AddMemoriesScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const state = (location.state as AddMemoriesState | null) ?? null;

  /** Fixed for this mount — preserved across `replace` state updates. */
  const [hideSkipFromDiary] = useState(() => Boolean(state?.hideSkip));
  const isDiaryFlow = hideSkipFromDiary;
  const [selectedImages, setSelectedImages] = useState<MemoryPreview[]>(
    state?.memoryImages ?? [],
  );
  const [memoryNote, setMemoryNote] = useState(() =>
    state?.hideSkip ? "" : (state?.memoryNote ?? ""),
  );
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState(() => state?.selectedPlanId ?? "");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const baseFlowState = useMemo(
    () => ({
      overallLabel: state?.overallLabel,
      overallRating: state?.overallRating,
      participantReviews: state?.participantReviews,
      participants: state?.participants,
      plan: state?.plan,
    }),
    [
      state?.overallLabel,
      state?.overallRating,
      state?.participantReviews,
      state?.participants,
      state?.plan,
    ],
  );

  const pastPlanChoices = useMemo(() => {
    const preset =
      state?.plan?.id !== undefined && state?.plan?.id !== null
        ? String(state.plan.id)
        : null;

    const list = savedPlans.filter((plan) =>
      preset !== null && String(plan.id) === preset
        ? true
        : Boolean(plan.completedAt),
    );

    return list.sort((a, b) => {
      const aT = new Date(a.completedAt ?? a.createdAt).getTime();
      const bT = new Date(b.completedAt ?? b.createdAt).getTime();
      return bT - aT;
    });
  }, [savedPlans, state?.plan?.id]);

  useEffect(() => {
    if (!isDiaryFlow) return;
    void loadSavedPlans()
      .then(setSavedPlans)
      .catch(() => setSavedPlans([]));
  }, [isDiaryFlow]);

  /** Post-plan flow: plan comes from navigation state, not the picker. */
  useEffect(() => {
    if (isDiaryFlow) return;
    if (state?.plan?.id === undefined || state?.plan?.id === null) return;
    const id = String(state.plan.id);
    if (id !== selectedPlanId) setSelectedPlanId(id);
  }, [isDiaryFlow, selectedPlanId, state?.plan?.id]);

  /** Diary flow: sync plan picker when choices load or current id is stale. */
  useEffect(() => {
    if (!isDiaryFlow) return;
    if (pastPlanChoices.length === 0) return;

    const preset =
      state?.plan?.id !== undefined && state?.plan?.id !== null
        ? String(state.plan.id)
        : null;

    const presetPick =
      preset && pastPlanChoices.some((p) => String(p.id) === preset) ? preset : null;

    const hasValidPick =
      selectedPlanId !== "" &&
      pastPlanChoices.some((p) => String(p.id) === selectedPlanId);

    const nextPick = hasValidPick
      ? selectedPlanId
      : presetPick ?? String(pastPlanChoices[0].id);

    if (nextPick !== selectedPlanId) setSelectedPlanId(nextPick);
  }, [isDiaryFlow, pastPlanChoices, selectedPlanId, state?.plan?.id]);

  const selectedPlan = useMemo(
    () =>
      isDiaryFlow
        ? (pastPlanChoices.find((p) => String(p.id) === selectedPlanId) ?? null)
        : null,
    [isDiaryFlow, pastPlanChoices, selectedPlanId],
  );

  const canPickPhotos = isDiaryFlow ? pastPlanChoices.length > 0 : Boolean(selectedPlanId);

  const primaryActionDisabled =
    isDiaryFlow
      ? pastPlanChoices.length === 0 || !selectedPlanId || isSaving
      : !selectedPlanId || isSaving;

  const selectedCountLabel = useMemo(() => {
    if (selectedImages.length === 0) return "Select one or more photos";
    if (selectedImages.length === 1) return "1 photo selected";
    return `${selectedImages.length} photos selected`;
  }, [selectedImages.length]);

  const openPicker = () => {
    inputRef.current?.click();
  };

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

  const handleFilesSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const nextImages = await Promise.all(
      files.map(async (file) => ({
        id: `${file.name}-${file.lastModified}-${file.size}`,
        name: file.name,
        url: await readFileAsDataUrl(file),
      })),
    );

    setSelectedImages((current) => {
      const next = [...current];

      nextImages.forEach((image) => {
        const duplicate = next.some((item) => item.id === image.id);
        if (!duplicate) {
          next.push(image);
        }
      });

      return next;
    });

    event.target.value = "";
  };

  const removeImage = (id: string) => {
    setSelectedImages((current) => current.filter((image) => image.id !== id));
  };

  useEffect(() => {
    navigate(".", {
      replace: true,
      state: {
        ...baseFlowState,
        memoryImages: selectedImages,
        ...(selectedPlanId ? { selectedPlanId } : {}),
        ...(!isDiaryFlow ? { memoryNote } : {}),
        ...(hideSkipFromDiary ? { hideSkip: true } : {}),
      },
    });
  }, [
    baseFlowState,
    hideSkipFromDiary,
    isDiaryFlow,
    memoryNote,
    navigate,
    selectedImages,
    selectedPlanId,
  ]);

  const finalizeAddMemories = async (destination: "diary" | "repeat-vibe") => {
    if (isSaving) return;

    setSaveError(null);
    setIsSaving(true);

    try {
      if (selectedPlanId && selectedImages.length > 0) {
        const { rows, error } = await savePlanMemories({
          images: selectedImages,
          note: isDiaryFlow ? undefined : memoryNote,
          planId: selectedPlanId,
          mergeWithExisting: destination === "diary",
        });

        if (error) {
          setSaveError(error);
          return;
        }

        if (rows.length === 0) {
          setSaveError("Nothing was saved. Check Supabase tables and bucket setup.");
          return;
        }
      }

      if (destination === "diary") {
        navigate("/diary", { replace: true });
        return;
      }

      const planPayload =
        selectedPlan != null
          ? { id: selectedPlan.id, title: selectedPlan.title }
          : baseFlowState.plan;

      navigate("/repeat-vibe", {
        state: {
          ...baseFlowState,
          plan: planPayload,
          memoryImages: selectedImages,
          memoryNote,
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-surface-primary">
      <div
        className="flex flex-1 flex-col overflow-y-auto px-[20px] pt-[32px]"
        style={{ paddingBottom: "calc(32px + env(safe-area-inset-bottom))" }}
      >
        <FlowScreenHeader
          onBack={() => navigate(-1)}
          onSkip={
            hideSkipFromDiary
              ? undefined
              : () => {
                  void finalizeAddMemories("repeat-vibe");
                }
          }
        />

        <div className="flex flex-col gap-[36px] pt-[36px]">
          {isDiaryFlow ? (
            <h1 className="type-heading-2xl text-primary-token">New memories</h1>
          ) : (
            <PostPlanIntro />
          )}

          <div className="flex flex-col gap-[32px]">
            {isDiaryFlow ? (
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="add-memory-plan" className="type-body-s text-primary-token">
                  Which plan are these memories for?
                </label>

                {pastPlanChoices.length > 0 ? (
                  <select
                    id="add-memory-plan"
                    value={selectedPlanId}
                    onChange={(event) => setSelectedPlanId(event.target.value)}
                    className="w-full rounded-[12px] border border-card-token bg-surface-primary px-[12px] py-[10px] type-body-s text-primary-token outline-none"
                  >
                    {pastPlanChoices.map((plan) => (
                      <option key={plan.id} value={String(plan.id)}>
                        {plan.title.trim() || "Untitled plan"}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="type-body-s text-secondary-token">
                    You don&apos;t have any finished plans yet. Complete a plan first, then add photos
                    here.
                  </p>
                )}
              </div>
            ) : null}

            <div className="flex flex-col gap-[16px]">
              <button
                type="button"
                disabled={!canPickPhotos}
                onClick={openPicker}
                className="relative flex min-h-[186px] w-full flex-col items-center justify-center gap-[12px] rounded-[16px] border border-card-token bg-[#efefef] px-[24px] py-[32px] text-center disabled:pointer-events-none disabled:opacity-40"
              >
                <div className="flex size-[48px] items-center justify-center rounded-full bg-surface-primary">
                  <AppIcon name="Camera" size={24} />
                </div>
                <div className="flex flex-col items-center gap-[4px]">
                  <p className="type-body-m text-primary-token">Add plan photos</p>
                  <p className="type-body-s text-secondary-token">
                    {selectedCountLabel}
                  </p>
                </div>

                <div className="absolute bottom-[12px] right-[12px]">
                  <IconButton
                    icon="Add"
                    hierarchy="Secondary"
                    size="Small"
                    onClick={(event) => {
                      event.stopPropagation();
                      if (canPickPhotos) openPicker();
                    }}
                    aria-label="Add photos"
                  />
                </div>
              </button>

              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFilesSelected}
              />

              {!isDiaryFlow ? (
                <div className="flex flex-col gap-[8px]">
                  <p className="type-body-s text-primary-token">
                    Add a note to remember this plan <span className="text-secondary-token">(Optional)</span>
                  </p>
                  <textarea
                    value={memoryNote}
                    onChange={(event) => setMemoryNote(event.target.value)}
                    placeholder="Leave a note for future you"
                    className="min-h-[92px] w-full resize-none rounded-[12px] border border-card-token bg-surface-primary px-[12px] py-[10px] type-body-s text-primary-token outline-none placeholder:text-secondary-token"
                  />
                </div>
              ) : null}

              {selectedImages.length > 0 ? (
                <div className="grid grid-cols-3 gap-[8px]">
                  {selectedImages.map((image) => (
                    <div
                      key={image.id}
                      className="relative aspect-square overflow-hidden rounded-[16px] bg-surface-secondary"
                    >
                      <img
                        alt={image.name}
                        className="size-full object-cover"
                        src={image.url}
                      />

                      <div className="absolute right-[8px] top-[8px]">
                        <IconButton
                          icon="Close"
                          hierarchy="Primary"
                          size="Small"
                          onClick={() => removeImage(image.id)}
                          aria-label={`Remove ${image.name}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {selectedImages.length > 0 ? (
            <div className="flex w-full flex-col gap-[8px]">
              {saveError ? (
                <p className="type-body-s text-brand-token" role="alert">
                  {saveError}
                </p>
              ) : null}
              <button
                type="button"
                disabled={primaryActionDisabled}
                onClick={() =>
                  void finalizeAddMemories(isDiaryFlow ? "diary" : "repeat-vibe")
                }
                className="flex h-[45px] w-full items-center justify-center rounded-[999px] bg-button-primary disabled:pointer-events-none disabled:opacity-40"
              >
                <span className="type-body-m text-invert-token">
                  {isSaving
                    ? "Saving..."
                    : isDiaryFlow
                      ? "Save"
                      : "Continue"}
                </span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
