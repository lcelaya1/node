import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { IconButton } from "../components/IconButton";
import { SpeechBubbleChip } from "../components/SpeechBubbleChip";
import { WhereModal } from "../components/WhereModal";
import { ExplainModal } from "../components/ExplainModal";

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
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [whereModalOpen, setWhereModalOpen] = useState(false);
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [planData, setPlanData] = useState<PlanData>({
    title: "",
    date: "",
    hour: "",
    location: "",
    description: "",
  });

  const handleChange = (field: keyof PlanData, value: string) => {
    setPlanData((prev) => ({ ...prev, [field]: value }));
  };

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

          <div className="absolute top-[56px] right-[20px]" onClick={(e) => e.stopPropagation()}>
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
                      className="absolute inset-0 opacity-0 cursor-pointer"
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

            {/* Create plan button */}
            <Button
              variant="secondary"
              onClick={() => navigate("/plans-home")}
              className="w-full mt-[24px]"
            >
              Create plan
            </Button>
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
