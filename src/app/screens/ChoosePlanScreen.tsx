import { useState } from "react";
import { useNavigate } from "react-router";

const imgPlanCover = "https://www.figma.com/api/mcp/asset/cfc93208-7871-4ba9-b2ac-70ad12a5380f";

// ── Icons (from Figma assets) ─────────────────────────────────────────────────
const imgCalendar = "https://www.figma.com/api/mcp/asset/addd676c-0382-47b1-b7a1-e11d0908b773";
const imgLocation = "https://www.figma.com/api/mcp/asset/7c52e55b-f643-4f3d-8879-e8bf5b38d2d6";

// ── Mock data ─────────────────────────────────────────────────────────────────
const PLANS = [
  { id: 1, title: "Title of the plan will be displayed like this", date: "May 12 · 6pm", location: "Location (1.2km)" },
  { id: 2, title: "Title of the plan will be displayed like this", date: "May 13 · 8pm", location: "Location (2.0km)" },
  { id: 3, title: "Title of the plan will be displayed like this", date: "May 14 · 7pm", location: "Location (1.8km)" },
];

// ── Plan card ─────────────────────────────────────────────────────────────────
type PlanCardProps = {
  className?: string;
  date?: string;
  location?: string;
  title?: string;
  showButton?: boolean;
  onJoin?: () => void;
};

function PlanCard({
  className,
  date = "May 12 · 6pm",
  location = "Location (1.2km)",
  title = "Title of the plan will be displayed like this",
  showButton = false,
  onJoin,
}: PlanCardProps) {
  return (
    <div
      className={
        className ??
        "bg-[#fefefe] border border-[#e4e4e7] flex flex-col h-[471px] items-start justify-end relative rounded-[24px] w-[309px]"
      }
    >
      {/* Info row at bottom */}
      <div className="flex flex-col gap-[12px] items-start pb-[16px] pt-[22px] px-[22px] relative shrink-0 w-full z-10 bg-[#fefefe] rounded-b-[24px]">
        <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[20px] leading-[24px] font-medium text-[#09090b] w-full">
          {title}
        </p>
        <div className="flex flex-col gap-[4px] w-full">
          <div className="flex gap-[4px] items-center w-full">
            <img src={imgCalendar} alt="" className="size-[12px] shrink-0" />
            <span className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[18px] text-[#09090b]">
              {date}
            </span>
          </div>
          <div className="flex gap-[4px] items-center w-full">
            <img src={imgLocation} alt="" className="size-[12px] shrink-0" />
            <span className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[18px] text-[#09090b]">
              {location}
            </span>
          </div>
        </div>
      </div>

      {/* Image area (fills the top) */}
      <div className="absolute inset-0 rounded-[24px] overflow-hidden" style={{ bottom: "calc(16px + 22px + 24px + 18px + 18px + 4px + 12px)" }}>
        <img
          src={imgPlanCover}
          alt=""
          className="absolute inset-0 w-full h-full object-cover rounded-[24px]"
        />
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.2)] rounded-[24px]" />
      </div>

      {/* Join Plan button */}
      {showButton && (
        <button
          type="button"
          onClick={onJoin}
          className="absolute bottom-[-1px] right-[-1px] rounded-[999px] w-[220px] flex items-center justify-center px-[32px] py-[12px]"
          style={{ background: "linear-gradient(180deg, rgba(255,72,62,1) 0%, rgba(255,48,43,1) 100%)" }}
        >
          <span className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[16px] leading-[21px] text-[#fefefe] text-center whitespace-nowrap">
            Join Plan
          </span>
        </button>
      )}
    </div>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function ChoosePlanScreen() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const total = PLANS.length;
  const plan = PLANS[current];

  return (
    <div className="bg-[#fefefe] relative size-full overflow-hidden">

      {/* Header */}
      <div className="absolute flex items-center justify-between left-0 right-0 px-[20px] top-[74px] whitespace-nowrap">
        <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[20px] leading-[24px] font-medium text-[#09090b]">
          Choose a plan.
        </p>
        <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[12px] leading-[16px] text-[#09090b]">
          {current + 1} of {total}
        </p>
      </div>

      {/* Left peeking card */}
      <div className="absolute flex h-[481px] items-center justify-center w-[325px]"
        style={{ left: -303, top: 170 }}>
        <div className="-rotate-2 flex-none">
          <PlanCard className="bg-[#fefefe] border border-[#e4e4e7] flex flex-col h-[471px] items-start justify-end relative rounded-[24px] w-[309px]" />
        </div>
      </div>

      {/* Right peeking card */}
      <div className="absolute flex h-[481px] items-center justify-center w-[325px]"
        style={{ left: "calc(75% + 76.5px)", top: 170 }}>
        <div className="rotate-2 flex-none">
          <PlanCard className="bg-[#fefefe] border border-[#e4e4e7] flex flex-col h-[471px] items-start justify-end relative rounded-[24px] w-[309px]" />
        </div>
      </div>

      {/* Front card (centered) */}
      <div
        className="absolute"
        style={{ left: "calc(50% + 0.25px)", top: 168.59, transform: "translateX(-50%)" }}
      >
        <PlanCard
          title={plan.title}
          date={plan.date}
          location={plan.location}
          showButton
          onJoin={() => navigate("/plans-home")}
        />
      </div>

      {/* Match info */}
      <div
        className="absolute flex flex-col gap-[4px] items-center text-center w-[222px]"
        style={{ left: "calc(50% + 0.5px)", top: 702, transform: "translateX(-50%)" }}
      >
        <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[16px] leading-[21px] font-medium text-[#09090b] w-full text-center">
          96% match
        </p>
        <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[18px] text-[#09090b] w-full text-center">
          We picked this for you based on{" "}
          <em>some reasons that will appear here.</em>
        </p>

        {current < total - 1 && (
          <button
            type="button"
            onClick={() => setCurrent((c) => c + 1)}
            className="mt-[16px] font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[18px] text-[#71717a] underline underline-offset-2"
          >
            See next plan →
          </button>
        )}
      </div>

    </div>
  );
}
