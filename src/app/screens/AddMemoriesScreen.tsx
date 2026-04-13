import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { FlowScreenHeader } from "../components/FlowScreenHeader";
import { AppIcon } from "../components/AppIcon";
import { IconButton } from "../components/IconButton";
import type { DemoUser } from "../lib/demoUsers";
import type { ParticipantReviewInput } from "../lib/planFeedback";
import { savePlanMemories } from "../lib/planMemories";

type AddMemoriesState = {
  memoryImages?: MemoryPreviewState[];
  overallLabel?: string;
  overallRating?: number;
  participantReviews?: ParticipantReviewInput[];
  participants?: DemoUser[];
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

function InfoContent() {
  return (
    <div className="flex w-full flex-col items-start gap-[8px]">
      <p className="w-full font-primary text-[24px] leading-[28px] text-primary-token">
        Keep the memories
      </p>
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
  const [selectedImages, setSelectedImages] = useState<MemoryPreview[]>(
    state?.memoryImages ?? [],
  );
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
      },
    });
  }, [baseFlowState, navigate, selectedImages]);

  const goToRepeatVibe = async () => {
    if (isSaving) return;

    setIsSaving(true);

    try {
      if (state?.plan?.id !== undefined && state?.plan?.id !== null && selectedImages.length > 0) {
        await savePlanMemories({
          images: selectedImages,
          planId: String(state.plan.id),
        });
      }

      navigate("/repeat-vibe", {
        state: {
          ...baseFlowState,
          memoryImages: selectedImages,
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
          onSkip={() => void goToRepeatVibe()}
        />

        <div className="flex flex-col gap-[36px] pt-[36px]">
          <div className="flex flex-col gap-[32px]">
            <InfoContent />

            <div className="flex flex-col gap-[16px]">
              <button
                type="button"
                onClick={openPicker}
                className="relative flex min-h-[186px] w-full flex-col items-center justify-center gap-[12px] rounded-[16px] border border-card-token bg-[#efefef] px-[24px] py-[32px] text-center"
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
                      openPicker();
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

              {selectedImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-[12px]">
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
            <button
              type="button"
              onClick={() => void goToRepeatVibe()}
              className="flex h-[45px] w-full items-center justify-center rounded-[999px] bg-button-primary"
            >
              <span className="type-body-m text-invert-token">
                {isSaving ? "Saving..." : "Continue"}
              </span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
