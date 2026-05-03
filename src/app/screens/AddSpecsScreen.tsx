import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Trash2 } from "lucide-react";
import alertIcon from "../../assets/svg/Alert.svg";
import { IconButton } from "../components/IconButton";
import { SpeechBubbleChip } from "../components/SpeechBubbleChip";
import { WhereModal } from "../components/WhereModal";
import { ExplainModal } from "../components/ExplainModal";
import { CoverImageModal } from "../components/CoverImageModal";
import { useAuthUser } from "../context/AuthUserContext";
import { markDailyPlanAction } from "../lib/dailyPlanLimit";
import { formatIsoDateOnlyForDisplay } from "../lib/formatPlanWhen";
import { deletePlan, loadSavedPlan, savePlan } from "../lib/plans";
import { createRepeatGroupPlan } from "../lib/repeatGroupPlans";
import { resolveRsvpViewerInCircle } from "../lib/resolveCircleViewer";
import { supabase } from "../lib/supabase";
import type { DemoUser } from "../lib/demoUsers";

type PlanData = {
  title: string;
  date: string;
  hour: string;
  location: string;
  description: string;
};

type AddSpecsLocationState = {
  planId?: string;
  groupPlanContext?: {
    groupId?: string;
    imageSrc?: string;
    participants?: DemoUser[];
    plan?: {
      id?: string | number;
      title?: string;
      when?: string;
      where?: string;
      source?: "created" | "joined";
    };
    selectedIndex?: number;
  };
};

function getTomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Escritorio: un `input[type=date]` invisible a veces no abre el calendario; `showPicker()` exige gesto de usuario. */
function openNativeDatePicker(input: HTMLInputElement | null) {
  if (!input) return;
  try {
    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }
  } catch {
    /* Safari / contextos que exigen click() */
  }
  input.focus({ preventScroll: true });
  input.click();
}

function CreatePlanDisclaimerModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: "var(--color-overlay-scrim)" }}
        onClick={onClose}
      />
      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-[393px] flex-col gap-[28px] rounded-tl-[16px] rounded-tr-[16px] bg-[#fefefe] px-[20px] pb-[32px] pt-[20px]">
        <div className="flex items-center justify-center">
          <div className="h-[4.875px] w-[43.875px] rounded-[2.438px] bg-[#A1A1AA]" />
        </div>

        <div className="flex flex-col items-center justify-center gap-[12px]">
          <img src={alertIcon} alt="" aria-hidden className="size-[36px]" />
          <div className="flex flex-col items-center gap-[8px] text-center">
            <p className="type-body-m-medium text-primary-token">
              Can't edit after creating
            </p>
            <p className="w-[343px] type-body-s text-secondary-token">
              Once your plan is live, these details are locked and can't be changed.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-[12px]">
          <button
            type="button"
            onClick={onConfirm}
            className="h-[46px] w-full rounded-[999px] border border-[#A1A1AA] font-primary text-[16px] leading-[21px]"
            style={{
              backgroundColor: "#000000",
              color: "#E4E4E7",
            }}
          >
            Create plan
          </button>
        </div>
      </div>
    </>
  );
}

export default function AddSpecsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthUser();
  const locationState = (location.state as AddSpecsLocationState | null) ?? null;
  const planId = locationState?.planId ?? null;
  const groupPlanContext = locationState?.groupPlanContext ?? null;
  const isEditing = planId !== null;

  const dateInputRef = useRef<HTMLInputElement>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverModalOpen, setCoverModalOpen] = useState(false);
  const [whereModalOpen, setWhereModalOpen] = useState(false);
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [createDisclaimerOpen, setCreateDisclaimerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [planData, setPlanData] = useState<PlanData>({
    title: "",
    date: "",
    hour: "",
    location: "",
    description: "",
  });

  // Load existing plan when editing
  useEffect(() => {
    if (!planId) return;
    setIsLoading(true);
    loadSavedPlan(planId).then((plan) => {
      if (plan) {
        setPlanData({
          title: plan.title ?? "",
          date: plan.whenDate ?? "",
          hour: plan.whenTime ?? "",
          location: plan.where ?? "",
          description: plan.description ?? "",
        });
        if (plan.picturePreview) setCoverImage(plan.picturePreview);
      }
      setIsLoading(false);
    });
  }, [planId]);

  const handleChange = (field: keyof PlanData, value: string) => {
    setPlanData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormComplete =
    Boolean(coverImage) &&
    Boolean(planData.title.trim()) &&
    Boolean(planData.date) &&
    Boolean(planData.hour) &&
    Boolean(planData.location.trim()) &&
    Boolean(planData.description.trim());

  const persistPlan = async () => {
    if (isSaving || !isFormComplete) return;
    setIsSaving(true);
    try {
      const id = planId ?? crypto.randomUUID();
      const dateLabel = planData.date
        ? formatIsoDateOnlyForDisplay(planData.date)
        : "";
      const when = [dateLabel, planData.hour].filter(Boolean).join(" · ");

      await savePlan({
        id,
        createdAt: new Date().toISOString(),
        title: planData.title,
        description: planData.description,
        where: planData.location,
        when,
        whenDate: planData.date,
        whenTime: planData.hour,
        picturePreview: coverImage ?? "",
        source: "created",
      });
      markDailyPlanAction("created");

      if (groupPlanContext?.groupId) {
        await createRepeatGroupPlan({
          createdByName: "You",
          groupId: groupPlanContext.groupId,
          title: planData.title,
          when,
          where: planData.location,
        });

        const circle = groupPlanContext.participants ?? [];
        let viewerSeedUserId: number | undefined;

        if (supabase && circle.length > 0 && user) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("avatar_url, full_name")
              .eq("id", user.id)
              .maybeSingle();
            const viewer = resolveRsvpViewerInCircle(
              circle,
              circle[0] ?? null,
              typeof profile?.avatar_url === "string" ? profile.avatar_url.trim() || null : null,
              typeof profile?.full_name === "string" ? profile.full_name.trim() || null : null,
              null,
            );
            if (typeof viewer?.seedUserId === "number") {
              viewerSeedUserId = viewer.seedUserId;
            }
        }

        navigate("/chat", {
          replace: true,
          state: {
            groupId: groupPlanContext.groupId,
            imageSrc: groupPlanContext.imageSrc,
            isRepeatGroup: true,
            participants: circle,
            plan: {
              ...(groupPlanContext.plan ?? {
                id: groupPlanContext.groupId,
                title: "My circle",
                when: when || "Today",
                where: planData.location,
              }),
              creator: circle[0],
            },
            selectedIndex: groupPlanContext.selectedIndex ?? 0,
            ...(viewerSeedUserId !== undefined ? { viewerSeedUserId } : {}),
          },
        });
        return;
      }

      navigate("/", { state: { planId: id } });
    } catch (err) {
      console.error("Failed to save plan:", err);
      setIsSaving(false);
    }
  };

  const handleSave = () => {
    if (isSaving || !isFormComplete) return;
    if (!isEditing) {
      setCreateDisclaimerOpen(true);
      return;
    }
    void persistPlan();
  };

  const handleDelete = async () => {
    if (!planId) return;
    await deletePlan(planId);
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-surface-primary">
        <div className="w-[32px] h-[32px] rounded-full border-2 border-card-token border-t-[var(--color-text-brand)] animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div
        className="bg-surface-primary flex h-full min-h-full flex-col overflow-hidden"
        style={{
          marginBottom: "calc(-1 * env(safe-area-inset-bottom))",
          minHeight: "calc(100% + max(16px, env(safe-area-inset-top)) + env(safe-area-inset-bottom))",
        }}
      >
        {/* Cover image area */}
        <div
          className="relative flex h-[216px] shrink-0 cursor-pointer flex-col items-center overflow-hidden rounded-bl-[16px] rounded-br-[16px] px-[20px] py-[32px]"
          style={
            coverImage
              ? { backgroundImage: `url(${coverImage})`, backgroundSize: "cover", backgroundPosition: "center" }
              : { backgroundColor: "var(--color-text-tertiary)" }
          }
          onClick={() => setCoverModalOpen(true)}
        >
          <div className="absolute right-[20px] top-[32px] flex items-center gap-[8px]" onClick={(e) => e.stopPropagation()}>
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center justify-center size-[36px] rounded-full backdrop-blur text-brand-token"
                style={{ backgroundColor: "var(--color-white-80)" }}
                aria-label="Delete plan"
              >
                <Trash2 size={16} strokeWidth={2} />
              </button>
            )}
            <IconButton
              icon="Close"
              hierarchy="Primary Light"
              size="Mid"
              onClick={() => navigate(-1)}
              aria-label="Close"
            />
          </div>

          {!coverImage && (
            <div className="flex flex-1 items-center justify-center w-full">
              <p className="font-primary text-[16px] leading-[21px] font-medium text-secondary-token text-center">
                Add a cover image for the plan
              </p>
            </div>
          )}
        </div>

        {/* Scrollable form content */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex flex-1 flex-col justify-between px-[20px] pt-[32px]" style={{ paddingBottom: "calc(32px + env(safe-area-inset-bottom))" }}>
            <div className="flex flex-col gap-[24px]">
              {/* What? */}
              <div className="flex flex-col gap-[12px] items-start w-full">
                <SpeechBubbleChip direction="Left" text="What?" />
                <div className="border border-card-token flex items-center rounded-[8px] w-full px-[12px] py-[10px]">
                  <input
                    type="text"
                    placeholder="Add a Title..."
                    value={planData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="type-heading-l !text-[20px] !font-normal text-primary-token placeholder:text-secondary-token bg-transparent border-none outline-none w-full"
                  />
                </div>
              </div>

              {/* When? */}
              <div className="flex flex-col gap-[12px] items-start w-full">
                <SpeechBubbleChip direction="Left" text="When?" />
                <div className="flex gap-[16px] h-[80px] items-center w-full">
                  <label
                    className="border border-card-token flex flex-1 flex-col h-full items-start justify-between p-[12px] rounded-[8px] relative overflow-hidden text-left cursor-pointer"
                    onClick={() => openNativeDatePicker(dateInputRef.current)}
                  >
                    <p className="font-primary text-[16px] leading-[21px] font-medium text-primary-token">
                      Date
                    </p>
                    <span className={`font-primary text-[14px] leading-[16px] pointer-events-none ${planData.date ? "text-primary-token" : "text-secondary-token"}`}>
                      {planData.date
                        ? new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" }).format(
                            new Date(planData.date + "T00:00:00")
                          )
                        : "Pick a date"}
                    </span>
                    <input
                      ref={dateInputRef}
                      type="date"
                      value={planData.date}
                      min={getTomorrow()}
                      onChange={(e) => {
                        if (e.target.value >= getTomorrow()) {
                          handleChange("date", e.target.value);
                        }
                      }}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0 pointer-events-none"
                      aria-label="Choose plan date"
                    />
                  </label>
                  <div className="border border-card-token flex flex-1 flex-col h-full items-start justify-between p-[12px] rounded-[8px]">
                    <p className="font-primary text-[16px] leading-[21px] font-medium text-primary-token">
                      Hour
                    </p>
                    <input
                      type="time"
                      value={planData.hour}
                      onChange={(e) => handleChange("hour", e.target.value)}
                      className="font-primary text-[14px] leading-[16px] text-secondary-token bg-transparent border-none outline-none w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Where? */}
              <div className="flex flex-col gap-[12px] items-start w-full">
                <SpeechBubbleChip direction="Left" text="Where?" />
                <button
                  type="button"
                  onClick={() => setWhereModalOpen(true)}
                  className="border border-card-token flex items-center pl-[12px] py-[6px] rounded-[8px] w-full text-left icon-primary-token"
                >
                  <span className={`font-primary text-[14px] leading-[16px] flex-1 min-w-0 truncate ${planData.location ? "text-primary-token" : "text-secondary-token"}`}>
                    {planData.location || "Search a bar, restaurant, venue..."}
                  </span>
                  <div className="flex items-center justify-center size-[36px] shrink-0">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>
              </div>

              {/* Could you explain a bit more? */}
              <div className="flex flex-col gap-[12px] items-start w-full">
                <SpeechBubbleChip direction="Left" text="Could you explain a bit more?" />
                <button
                  type="button"
                  onClick={() => setExplainModalOpen(true)}
                  className="border border-card-token flex h-[88px] items-start p-[12px] rounded-[8px] w-full text-left"
                >
                  <span className={`font-primary text-[14px] leading-[16px] line-clamp-3 ${planData.description ? "text-primary-token" : "text-secondary-token"}`}>
                    {planData.description || "What's the vibe? Who's invited?"}
                  </span>
                </button>
              </div>
            </div>

            {/* Save button */}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !isFormComplete}
              className="mt-[24px] flex h-[45px] w-full shrink-0 items-center justify-center gap-[8px] rounded-[999px] transition-colors"
              style={{
                backgroundColor: isFormComplete ? "var(--color-button-secondary)" : "var(--color-surface-fill)",
              }}
            >
              {isSaving && (
                <div
                  className="h-[18px] w-[18px] animate-spin rounded-full border-2"
                  style={{
                    borderColor: "color-mix(in srgb, var(--color-surface-bg-secondary) 40%, transparent)",
                    borderTopColor: "var(--color-surface-bg-secondary)",
                  }}
                />
              )}
              <span
                className="font-primary text-[16px] leading-[21px] text-center whitespace-nowrap"
                style={{
                  color: isFormComplete ? "var(--color-text-invert)" : "var(--color-surface-bg-secondary)",
                }}
              >
                {isEditing ? "Update plan" : "Create plan"}
              </span>
            </button>
          </div>
        </div>
      </div>

      <CoverImageModal
        isOpen={coverModalOpen}
        onClose={() => setCoverModalOpen(false)}
        onSelect={(img) => setCoverImage(img)}
      />
      <WhereModal
        isOpen={whereModalOpen}
        onClose={() => setWhereModalOpen(false)}
        onSelect={(location) => handleChange("location", location)}
        initialValue={planData.location}
      />
      <ExplainModal
        isOpen={explainModalOpen}
        onClose={() => setExplainModalOpen(false)}
        value={planData.description}
        onSave={(text) => handleChange("description", text)}
      />
      <CreatePlanDisclaimerModal
        isOpen={createDisclaimerOpen}
        onClose={() => setCreateDisclaimerOpen(false)}
        onConfirm={() => {
          setCreateDisclaimerOpen(false);
          void persistPlan();
        }}
      />
    </>
  );
}
