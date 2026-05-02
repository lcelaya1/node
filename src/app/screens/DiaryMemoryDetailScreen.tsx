import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import type { DiaryMemoryGroup } from "../components/DiaryMemoryCard";
import { AppIcon } from "../components/AppIcon";
import { IconButton } from "../components/IconButton";
import { cn } from "../components/ui/utils";
import {
  deletePlanMemory,
  loadPlanMemories,
  savePlanMemories,
  updatePlanMemoryNotesForPlan,
  type PlanMemoryImage,
} from "../lib/planMemories";
import { loadSavedPlans, type SavedPlan } from "../lib/plans";

type LocationState = {
  diaryReopenCalendarDay?: string;
  group?: DiaryMemoryGroup;
};

function buildGroupForPlan(planId: string, memories: PlanMemoryImage[], plans: SavedPlan[]): DiaryMemoryGroup | null {
  const planImages = memories.filter((m) => m.planId === planId);
  if (planImages.length === 0) return null;

  planImages.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const plan = plans.find((p) => p.id === planId);
  let description: string | undefined;
  planImages.some((memory) => {
    const trimmed = memory.note?.trim();
    if (trimmed) {
      description = trimmed;
      return true;
    }
    return false;
  });

  return {
    createdAt: planImages[planImages.length - 1]?.createdAt ?? planImages[0].createdAt,
    description,
    images: planImages,
    planId,
    title: plan?.title?.trim() || "Plan Title",
  };
}

/** Cuadrícula 2 columnas: misma anchura/alto por celda (`aspect-square`); una sola foto usa todo el ancho. */
function MemoryDetailGridImage({
  alt,
  className,
  children,
  src,
}: {
  alt: string;
  children?: React.ReactNode;
  className?: string;
  src: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[16px] bg-surface-secondary",
        className,
      )}
    >
      <img
        alt={alt}
        src={src}
        className="pointer-events-none size-full object-cover object-center"
      />
      {children}
    </div>
  );
}

export default function DiaryMemoryDetailScreen() {
  const navigate = useNavigate();
  const { planId } = useParams<{ planId: string }>();
  const location = useLocation();
  const routePlanId = planId ? decodeURIComponent(planId) : "";

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [group, setGroup] = useState<DiaryMemoryGroup | null>(() => {
    const fromState = (location.state as LocationState | null)?.group;
    return fromState && routePlanId && String(fromState.planId) === routePlanId
      ? fromState
      : null;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [removedIds, setRemovedIds] = useState<Set<string>>(() => new Set());
  const [pendingAdds, setPendingAdds] = useState<PlanMemoryImage[]>([]);
  const [draftDescription, setDraftDescription] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!routePlanId) return;

    const stored = (location.state as LocationState | null)?.group;
    if (stored && String(stored.planId) === routePlanId) {
      setGroup(stored);
      return;
    }

    let cancelled = false;
    void (async () => {
      const [memories, plans] = await Promise.all([loadPlanMemories(), loadSavedPlans()]);
      if (cancelled) return;
      const next = buildGroupForPlan(routePlanId, memories, plans);
      setGroup(next);
    })();

    return () => {
      cancelled = true;
    };
  }, [routePlanId, location.state]);

  const sorted = useMemo(() => [...(group?.images ?? [])].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  ), [group?.images]);

  const workingSorted = useMemo(() => {
    if (!group) return [];
    const kept = group.images.filter((img) => !removedIds.has(img.id));
    const merged = [...kept, ...pendingAdds];
    merged.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return merged;
  }, [group, pendingAdds, removedIds]);

  const displayImages = isEditing ? workingSorted : sorted;

  const beginEditing = () => {
    if (!group) return;
    setRemovedIds(new Set());
    setPendingAdds([]);
    setDraftDescription(group.description?.trim() ?? "");
    setSaveError(null);
    setIsEditing(true);
  };

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

  const handleFilesSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!routePlanId) return;

    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const now = new Date().toISOString();
    const nextImages = await Promise.all(
      files.map(async (file) => ({
        createdAt: now,
        id: `${file.name}-${file.lastModified}-${file.size}`,
        name: file.name,
        planId: routePlanId,
        url: await readFileAsDataUrl(file),
      })),
    );

    setPendingAdds((current) => {
      const next = [...current];
      nextImages.forEach((img) => {
        if (!next.some((existing) => existing.id === img.id)) {
          next.push(img as PlanMemoryImage);
        }
      });
      return next;
    });

    event.target.value = "";
  };

  const removeFromWorking = (image: PlanMemoryImage) => {
    if (pendingAdds.some((p) => p.id === image.id)) {
      setPendingAdds((p) => p.filter((x) => x.id !== image.id));
      return;
    }
    setRemovedIds((prev) => new Set(prev).add(image.id));
  };

  const finalizeEditing = async () => {
    if (!group || !routePlanId || isSaving) return;

    const finalCount =
      group.images.filter((img) => !removedIds.has(img.id)).length + pendingAdds.length;

    if (finalCount === 0) {
      setSaveError("Add at least one photo before saving, or use the back button to leave.");
      return;
    }

    setSaveError(null);
    setIsSaving(true);

    try {
      for (const id of removedIds) {
        const { error } = await deletePlanMemory(id);
        if (error) {
          setSaveError(error);
          return;
        }
      }

      const trimmedNote = draftDescription.trim();
      const { error: noteError } = await updatePlanMemoryNotesForPlan(
        routePlanId,
        trimmedNote.length > 0 ? trimmedNote : null,
      );

      if (noteError) {
        setSaveError(noteError);
        return;
      }

      if (pendingAdds.length > 0) {
        const { error: uploadError } = await savePlanMemories({
          images: pendingAdds.map((img) => ({ ...img, planId: routePlanId })),
          note: trimmedNote.length > 0 ? trimmedNote : undefined,
          mergeWithExisting: true,
          planId: routePlanId,
        });

        if (uploadError) {
          setSaveError(uploadError);
          return;
        }
      }

      const [memories, plans] = await Promise.all([loadPlanMemories(), loadSavedPlans()]);
      const next = buildGroupForPlan(routePlanId, memories, plans);

      if (!next || next.images.length === 0) {
        const dayKey = (location.state as LocationState | null)?.diaryReopenCalendarDay;
        navigate("/diary", {
          replace: true,
          state: dayKey ? { diaryReopenCalendarDay: dayKey } : {},
        });
        return;
      }

      setGroup(next);
      setIsEditing(false);
      setRemovedIds(new Set());
      setPendingAdds([]);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-surface-primary">
      <div className="shrink-0 px-[16px] pt-[calc(21px+env(safe-area-inset-top))]">
        <div className="flex items-center justify-between gap-3 py-[10px] pr-1">
          <IconButton
            aria-label="Back"
            hierarchy="Link"
            icon="Left"
            size="Large"
            className="-ml-[10px]"
            onClick={() => {
              const dayKey = (location.state as LocationState | null)?.diaryReopenCalendarDay;
              if (dayKey) {
                navigate("/diary", {
                  replace: true,
                  state: { diaryReopenCalendarDay: dayKey },
                });
                return;
              }
              navigate(-1);
            }}
          />

          {group && !isEditing ? (
            <IconButton
              aria-label="Edit memory"
              className="-mr-[2px]"
              hierarchy="Link"
              icon="SquarePen"
              size="Large"
              onClick={beginEditing}
            />
          ) : (
            <span className="size-[44px] shrink-0" aria-hidden />
          )}
        </div>

        <h1 className="max-w-[334px] type-heading-l text-primary-token">
          {group?.title ?? "Plan Title"}
        </h1>

        {group && !isEditing && group.description?.trim() ? (
          <div className="mt-[12px] max-w-[359px] pb-[4px]">
            <p className="font-primary text-[14px] leading-[18px] text-primary-token">
              {group.description.trim()}
            </p>
          </div>
        ) : null}

        {group && isEditing ? (
          <div className="mt-[12px] flex w-full max-w-[359px] flex-col gap-[8px] pb-[16px]">
            <p className="type-body-s text-primary-token">
              Add a note to remember this plan{" "}
              <span className="text-secondary-token">(Optional)</span>
            </p>
            <textarea
              className="min-h-[92px] w-full resize-none rounded-[12px] border border-card-token bg-surface-primary px-[12px] py-[10px] type-body-s text-primary-token outline-none placeholder:text-secondary-token"
              placeholder="Leave a note for future you"
              value={draftDescription}
              onChange={(event) => setDraftDescription(event.target.value)}
            />
          </div>
        ) : null}
      </div>

      <div
        className="flex flex-1 min-h-0 flex-col gap-[24px] overflow-y-auto px-[17px] pt-[28px]"
        style={{
          paddingBottom: isEditing
            ? "calc(96px + env(safe-area-inset-bottom))"
            : "calc(24px + env(safe-area-inset-bottom))",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {saveError && !isEditing ? (
          <p className="type-body-s max-w-[359px] text-red-600" role="alert">
            {saveError}
          </p>
        ) : null}

        {!group ? (
          <p className="type-body-s text-secondary-token">Could not load this memory.</p>
        ) : (
          <>
            <div className="grid w-full max-w-[359px] grid-cols-2 gap-3">
              {displayImages.map((image) => (
                <MemoryDetailGridImage
                  key={image.id}
                  alt={image.name}
                  src={image.url}
                  className={
                    displayImages.length === 1 && !isEditing
                      ? "col-span-2 aspect-[4/5] max-h-[min(420px,55vh)] w-full"
                      : displayImages.length === 1 && isEditing
                        ? "col-span-2 aspect-[4/5] max-h-[min(380px,50vh)] w-full"
                        : "aspect-square min-h-0 w-full"
                  }
                >
                  {isEditing ? (
                    <div className="absolute right-2 top-2 z-10 shadow-sm">
                      <IconButton
                        aria-label={`Remove ${image.name}`}
                        hierarchy="Secondary"
                        icon="Close"
                        size="Small"
                        type="button"
                        onClick={() => removeFromWorking(image)}
                      />
                    </div>
                  ) : null}
                </MemoryDetailGridImage>
              ))}

              {isEditing ? (
                <button
                  type="button"
                  aria-label="Add photos"
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 rounded-[16px] border-2 border-dashed border-card-token bg-surface-secondary/60 text-secondary-token outline-none ring-offset-background transition-colors hover:bg-surface-secondary focus-visible:ring-2 focus-visible:ring-ring",
                    displayImages.length === 0
                      ? "col-span-2 aspect-[4/5] max-h-[min(280px,40vh)] w-full"
                      : "aspect-square min-h-0 w-full gap-2",
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <AppIcon name="Add" size={displayImages.length === 0 ? 36 : 28} />
                  <span className="font-primary text-[13px] font-medium leading-4 px-1 text-center">
                    {displayImages.length === 0 ? "Add photos to this memory" : "Add photos"}
                  </span>
                </button>
              ) : null}
            </div>

            <input
              ref={fileInputRef}
              tabIndex={-1}
              className="pointer-events-none fixed h-px w-px opacity-0"
              multiple
              type="file"
              accept="image/*"
              aria-hidden={!isEditing}
              onChange={handleFilesSelected}
            />
          </>
        )}
      </div>

      {isEditing ? (
        <div
          className="absolute inset-x-0 bottom-0 z-20 border-t border-card-token bg-surface-primary px-[17px] pt-[12px]"
          style={{ paddingBottom: "calc(10px + env(safe-area-inset-bottom))" }}
        >
          {saveError ? (
            <p className="type-body-s mb-2 max-w-[359px] text-red-600" role="alert">
              {saveError}
            </p>
          ) : null}
          <button
            type="button"
            aria-busy={isSaving}
            disabled={isSaving}
            className="flex h-[45px] w-full max-w-[359px] items-center justify-center rounded-[999px] bg-button-primary disabled:pointer-events-none disabled:opacity-40"
            onClick={() => void finalizeEditing()}
          >
            <span className="type-body-m text-invert-token">
              {isSaving ? "Saving..." : "Save"}
            </span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
