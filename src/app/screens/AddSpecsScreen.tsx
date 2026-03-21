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

  const handleSave = async () => {
    if (isSaving) return;
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
      <div className="flex items-center justify-center h-full bg-[#fefefe]">
        <div className="w-[32px] h-[32px] rounded-full border-2 border-[#e4e4e7] border-t-[#fc312e] animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div
        className="bg-[#fefefe] flex flex-col overflow-hidden"
        style={{
          marginTop: "calc(-1 * max(16px, env(safe-area-inset-top)))",
          marginBottom: "calc(-1 * env(safe-area-inset-bottom))",
          minHeight: "calc(100% + max(16px, env(safe-area-inset-top)) + env(safe-area-inset-bottom))",
        }}
      >
        {/* Cover image area */}
        <div
          className="flex flex-col h-[248px] shrink-0 items-center pt-[62px] px-[20px] relative rounded-bl-[16px] rounded-br-[16px] cursor-pointer overflow-hidden"
          style={
            coverImage
              ? { backgroundImage: `url(${coverImage})`, backgroundSize: "cover", backgroundPosition: "center" }
              : { backgroundColor: "#d4d4d8" }
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

          <div className="absolute top-[56px] right-[20px] flex items-center gap-[8px]" onClick={(e) => e.stopPropagation()}>
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center justify-center size-[36px] rounded-full bg-white/80 backdrop-blur text-[#fc312e]"
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
              <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[16px] leading-[21px] font-medium text-[#71717a] text-center">
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
                className="font-['Milling_Trial:Triplex_1mm',sans-serif] text-[24px] leading-[28px] tracking-[-0.48px] text-[#09090b] placeholder:text-[#71717a] bg-transparent border-none outline-none w-full"
              />

              {/* When? */}
              <div className="flex flex-col gap-[12px] items-start w-full">
                <SpeechBubbleChip direction="Left" text="When?" />
                <div className="flex gap-[16px] h-[80px] items-center w-full">
                  <div className="border border-[#e4e4e7] flex flex-1 flex-col h-full items-start justify-between p-[12px] rounded-[8px] relative overflow-hidden">
                    <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[16px] leading-[21px] font-medium text-[#09090b]">
                      Date
                    </p>
                    <span className={`font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[16px] ${planData.date ? "text-[#09090b]" : "text-[#71717a]"}`}>
                      {planData.date
                        ? new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" }).format(
                            new Date(planData.date + "T00:00:00")
                          )
                        : "Pick a date"}
                    </span>
                    <input
                      type="date"
                      value={planData.date}
                      min={getTomorrow()}
                      onChange={(e) => {
                        if (e.target.value >= getTomorrow()) {
                          handleChange("date", e.target.value);
                        }
                      }}
                      className="absolute inset-0 opacity-[0.001] cursor-pointer"
                    />
                  </div>
                  <div className="border border-[#e4e4e7] flex flex-1 flex-col h-full items-start justify-between p-[12px] rounded-[8px]">
                    <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[16px] leading-[21px] font-medium text-[#09090b]">
                      Hour
                    </p>
                    <input
                      type="time"
                      value={planData.hour}
                      onChange={(e) => handleChange("hour", e.target.value)}
                      className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[16px] text-[#71717a] bg-transparent border-none outline-none w-full"
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
                  className="border border-[#e4e4e7] flex items-center pl-[12px] py-[6px] rounded-[8px] w-full text-left"
                >
                  <span className={`font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[16px] flex-1 min-w-0 truncate ${planData.location ? "text-[#09090b]" : "text-[#71717a]"}`}>
                    {planData.location || "Search a bar, restaurant, venue..."}
                  </span>
                  <div className="flex items-center justify-center size-[36px] shrink-0">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 3L11 8L6 13" stroke="#09090b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
                  className="border border-[#e4e4e7] flex h-[88px] items-start p-[12px] rounded-[8px] w-full text-left"
                >
                  <span className={`font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[16px] line-clamp-3 ${planData.description ? "text-[#09090b]" : "text-[#71717a]"}`}>
                    {planData.description || "What's the vibe? Who's invited?"}
                  </span>
                </button>
              </div>
            </div>

            {/* Save button */}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="mt-[24px] w-full h-[45px] rounded-[999px] shrink-0 flex items-center justify-center gap-[8px] disabled:opacity-70"
              style={{ background: "linear-gradient(180deg, rgba(255,72,62,1) 0%, rgba(255,48,43,1) 100%)" }}
            >
              {isSaving && (
                <div className="w-[18px] h-[18px] rounded-full border-2 border-white/40 border-t-white animate-spin" />
              )}
              <span className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[16px] leading-[21px] text-[#fefefe] text-center whitespace-nowrap">
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
