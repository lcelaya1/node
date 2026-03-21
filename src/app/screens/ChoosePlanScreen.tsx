import { useState } from "react";
import { useNavigate } from "react-router";

// ── Icons ─────────────────────────────────────────────────────────────────────
function CalendarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <rect x="0.5" y="1.5" width="11" height="10" rx="1.5" stroke="#222" strokeWidth="0.8" />
      <path d="M3 0.5V2.5M9 0.5V2.5" stroke="#222" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M0.5 4.5H11.5" stroke="#222" strokeWidth="0.8" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 1C4.067 1 2.5 2.567 2.5 4.5C2.5 7 6 11 6 11C6 11 9.5 7 9.5 4.5C9.5 2.567 7.933 1 6 1Z" fill="#09090b" />
      <circle cx="6" cy="4.5" r="1.5" fill="white" />
    </svg>
  );
}

// ── Plan card ─────────────────────────────────────────────────────────────────
type PlanCardProps = {
  title?: string;
  date?: string;
  location?: string;
  className?: string;
  onJoin?: () => void;
  showJoinButton?: boolean;
};

function PlanCard({
  title = "Title of the plan will be displayed like this",
  date = "May 12 · 6pm",
  location = "Location (1.2km)",
  className,
  onJoin,
  showJoinButton = false,
}: PlanCardProps) {
  return (
    <div
      className={
        className ??
        "bg-[#fefefe] h-[471px] w-[309px] rounded-[24px] border border-[#e4e4e7] relative overflow-hidden"
      }
    >
      {/* Image area (top 60%) */}
      <div className="absolute inset-0 rounded-[24px] overflow-hidden">
        <div className="h-[60%] w-full bg-[#d4d4d8] rounded-t-[24px]">
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.12)] rounded-t-[24px]" />
        </div>
      </div>

      {/* Info area (bottom) */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-[12px] px-[22px] pb-[16px] pt-[22px] bg-[#fefefe] rounded-b-[24px]">
        <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[20px] leading-[24px] font-medium text-[#09090b]">
          {title}
        </p>
        <div className="flex flex-col gap-[4px]">
          <div className="flex items-center gap-[4px]">
            <CalendarIcon />
            <span className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[18px] text-[#09090b]">
              {date}
            </span>
          </div>
          <div className="flex items-center gap-[4px]">
            <LocationIcon />
            <span className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[18px] text-[#09090b]">
              {location}
            </span>
          </div>
        </div>
      </div>

      {/* Join Plan button */}
      {showJoinButton && (
        <button
          type="button"
          onClick={onJoin}
          className="absolute bottom-0 right-0 bg-[#fc312e] rounded-[999px] px-[32px] py-[12px]"
          style={{ background: "linear-gradient(180deg, rgba(255,72,62,1) 0%, rgba(255,48,43,1) 100%)" }}
        >
          <span className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[16px] leading-[21px] text-[#fefefe] whitespace-nowrap">
            Join Plan
          </span>
        </button>
      )}
    </div>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
const MOCK_PLANS = [
  {
    id: 1,
    title: "Sunset drinks at Bar Calders",
    date: "Tomorrow · 7pm",
    location: "El Born, Barcelona (0.8km)",
  },
  {
    id: 2,
    title: "Brunch at Federal Café",
    date: "Saturday · 11am",
    location: "Eixample, Barcelona (1.2km)",
  },
  {
    id: 3,
    title: "Live jazz at Jamboree",
    date: "Saturday · 9pm",
    location: "Gothic Quarter (1.5km)",
  },
];

export default function ChoosePlanScreen() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const total = MOCK_PLANS.length;
  const plan = MOCK_PLANS[current];

  const handleJoin = () => {
    navigate("/plans-home");
  };

  const handleNext = () => {
    if (current < total - 1) setCurrent((c) => c + 1);
  };

  const prevPlan = MOCK_PLANS[current - 1];
  const nextPlan = MOCK_PLANS[current + 1];

  return (
    <div className="bg-[#fefefe] size-full flex flex-col overflow-hidden pt-[74px] pb-[32px]">

      {/* Header */}
      <div className="flex items-center justify-between px-[20px] shrink-0">
        <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[20px] leading-[24px] font-medium text-[#09090b]">
          Choose a plan.
        </p>
        <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[12px] leading-[16px] text-[#09090b]">
          {current + 1} of {total}
        </p>
      </div>

      {/* Card stack */}
      <div className="flex-1 flex flex-col items-center justify-center relative mt-[16px]">

        {/* Back-right card */}
        {nextPlan && (
          <div
            className="absolute"
            style={{ transform: "rotate(2deg) translateX(20px)", zIndex: 1, opacity: 0.7 }}
          >
            <PlanCard
              title={nextPlan.title}
              date={nextPlan.date}
              location={nextPlan.location}
            />
          </div>
        )}

        {/* Back-left card */}
        {prevPlan && (
          <div
            className="absolute"
            style={{ transform: "rotate(-2deg) translateX(-20px)", zIndex: 1, opacity: 0.7 }}
          >
            <PlanCard
              title={prevPlan.title}
              date={prevPlan.date}
              location={prevPlan.location}
            />
          </div>
        )}

        {/* Front card */}
        <div className="relative" style={{ zIndex: 2 }}>
          <PlanCard
            title={plan.title}
            date={plan.date}
            location={plan.location}
            showJoinButton
            onJoin={handleJoin}
          />
        </div>
      </div>

      {/* Match info + skip */}
      <div className="flex flex-col items-center gap-[4px] px-[20px] mt-[20px] shrink-0">
        <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[16px] leading-[21px] font-medium text-[#09090b] text-center">
          96% match
        </p>
        <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[18px] text-[#71717a] text-center max-w-[222px]">
          We picked this for you based on{" "}
          <em>your vibe, budget and location.</em>
        </p>

        {current < total - 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="mt-[12px] font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[18px] text-[#71717a] underline underline-offset-2"
          >
            See next plan →
          </button>
        )}
      </div>

    </div>
  );
}
