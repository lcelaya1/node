import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Trash2 } from "lucide-react";
import { IconButton } from "../components/IconButton";
import { SpeechBubbleChip } from "../components/SpeechBubbleChip";
import { WhereModal } from "../components/WhereModal";
import { ExplainModal } from "../components/ExplainModal";
import { deletePlan, loadSavedPlan, savePlan } from "../lib/plans";

type PlanData = {
  title: string;
  date: string;
  hour: string;
  location: string;
  description: string;
};

function getTomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AddSpecsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const planId = (location.state as { planId?: string } | null)?.planId ?? null;
  const isEditing = planId !== null;

  const coverInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [whereModalOpen, setWhereModalOpen] = useState(false);
  const [explainModalOpen, setExplainModalOpen] = useState(false);
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

  const openDatePicker = () => {
    const input = dateInputRef.current;
    if (!input) return;

    input.focus();

    if ("showPicker" in input && typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }

    input.click();
  };

  const isFormComplete =
    Boolean(coverImage) &&
    Boolean(planData.title.trim()) &&
    Boolean(planData.date) &&
    Boolean(planData.hour) &&
    Boolean(planData.location.trim()) &&
    Boolean(planData.description.trim());

  const handleSave = async () => {
    if (isSaving || !isFormComplete) return;
    setIsSaving(true);
    try {
      const id = planId ?? crypto.randomUUID();
      const when = [planData.date, planData.hour].filter(Boolean).join(" · ");

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

      navigate("/", { state: { planId: id } });
    } catch (err) {
      console.error("Failed to save plan:", err);
      setIsSaving(false);
    }
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
          onClick={() => coverInputRef.current?.click()}
        >
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setCoverImage(URL.createObjectURL(file));
            }}
          />

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
              {/* Title */}
              <input
                type="text"
                placeholder="Add a Title..."
                value={planData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="font-primary text-[24px] leading-[28px] tracking-[-0.48px] text-primary-token placeholder:text-secondary-token bg-transparent border-none outline-none w-full"
              />

              {/* When? */}
              <div className="flex flex-col gap-[12px] items-start w-full">
                <SpeechBubbleChip direction="Left" text="When?" />
                <div className="flex gap-[16px] h-[80px] items-center w-full">
                  <button
                    type="button"
                    onClick={openDatePicker}
                    className="border border-card-token flex flex-1 flex-col h-full items-start justify-between p-[12px] rounded-[8px] relative overflow-hidden text-left"
                  >
                    <p className="font-primary text-[16px] leading-[21px] font-medium text-primary-token">
                      Date
                    </p>
                    <span className={`font-primary text-[14px] leading-[16px] ${planData.date ? "text-primary-token" : "text-secondary-token"}`}>
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
                      className="absolute inset-0 opacity-0 pointer-events-none"
                      tabIndex={-1}
                      aria-hidden="true"
                    />
                  </button>
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
    </>
  );
}
