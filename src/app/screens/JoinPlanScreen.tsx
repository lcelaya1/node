import { useState } from "react";
import { useNavigate } from "react-router";

// ── Date helpers ──────────────────────────────────────────────────────────────
function getDateLabel(offset: number) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function getWeekendLabel() {
  const today = new Date();
  const day = today.getDay(); // 0 Sun … 6 Sat
  const daysToSat = day === 0 ? 6 : 6 - day;
  const sat = new Date(today);
  sat.setDate(today.getDate() + daysToSat);
  const sun = new Date(sat);
  sun.setDate(sat.getDate() + 1);
  const satDay = sat.getDate();
  const sunLabel = sun.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return `${satDay} – ${sunLabel}`;
}

// ── Small shared components ───────────────────────────────────────────────────
function SectionLabel({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex items-end justify-between w-full">
      <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[16px] leading-[21px] font-medium text-[#09090b]">
        {title}
      </p>
      {hint && (
        <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[12px] leading-[16px] italic text-[#71717a]">
          {hint}
        </p>
      )}
    </div>
  );
}

function OptionPill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center justify-center py-[12px] rounded-[999px] border transition-colors ${
        selected ? "border-[#09090b]" : "border-[#e4e4e7]"
      }`}
    >
      <span className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[18px] text-[#09090b] whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}

// ── Battery icon ──────────────────────────────────────────────────────────────
function BatteryIcon({ level }: { level: "low" | "mid" | "full" }) {
  const fills = { low: "25%", mid: "55%", full: "85%" };
  return (
    <svg width="24" height="36" viewBox="0 0 24 36" fill="none">
      {/* Cap */}
      <rect x="9" y="1" width="6" height="3" rx="1" fill="#222" />
      {/* Body outline */}
      <rect x="3" y="4" width="18" height="30" rx="3" stroke="#222" strokeWidth="1.5" />
      {/* Fill */}
      <clipPath id={`battery-clip-${level}`}>
        <rect x="3" y="4" width="18" height="30" rx="3" />
      </clipPath>
      <rect
        x="5"
        y={level === "full" ? "7" : level === "mid" ? "15" : "22"}
        width="14"
        height={level === "full" ? "25" : level === "mid" ? "17" : "10"}
        rx="1.5"
        fill="#222"
        clipPath={`url(#battery-clip-${level})`}
      />
    </svg>
  );
}

function BatteryOption({
  level,
  label,
  selected,
  onClick,
}: {
  level: "low" | "mid" | "full";
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 flex-col items-center justify-center gap-[4px] py-[12px] rounded-[8px] border transition-colors ${
        selected ? "border-[#09090b]" : "border-[#e4e4e7]"
      }`}
    >
      <BatteryIcon level={level} />
      <span className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[18px] text-[#09090b]">
        {label}
      </span>
    </button>
  );
}

// ── Date option card ──────────────────────────────────────────────────────────
function DateCard({
  title,
  dateLabel,
  selected,
  onClick,
}: {
  title: string;
  dateLabel: string;
  selected: boolean;
  onClick: () => void;
}) {
  const [dayPart, monthPart] = dateLabel.split(" ");
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 flex-col items-start justify-between px-[12px] py-[8px] rounded-[8px] border h-[114px] transition-colors ${
        selected ? "border-[#09090b]" : "border-[#e4e4e7]"
      }`}
    >
      <span
        className={`font-['Milling_Trial:Duplex_1mm',sans-serif] text-[16px] leading-[21px] font-medium ${
          selected ? "text-[#fc312e]" : "text-[#09090b]"
        }`}
      >
        {title}
      </span>
      <div className="flex items-end gap-[2px]">
        <span className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[20px] leading-[24px] font-medium text-[#09090b]">
          {dayPart}
        </span>
        <span className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[18px] text-[#71717a]">
          {monthPart}
        </span>
      </div>
    </button>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function JoinPlanScreen() {
  const navigate = useNavigate();

  const [date, setDate] = useState<"today" | "tomorrow" | "weekend">("today");
  const [battery, setBattery] = useState<"low" | "mid" | "full">("low");
  const [budget, setBudget] = useState<"free" | "€" | "€€" | "€€€">("€");
  const [distance, setDistance] = useState<"close" | "ride" | "anywhere">("close");

  const todayLabel = getDateLabel(0);
  const tomorrowLabel = getDateLabel(1);
  const weekendLabel = getWeekendLabel();

  return (
    <div className="bg-[#fefefe] size-full flex flex-col overflow-y-auto">
      <div className="flex flex-col flex-1 px-[20px] pt-[62px] pb-[32px] gap-[24px]">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-[2px]">
            <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[20px] leading-[24px] font-medium text-[#09090b]">
              First, set the vibe.
            </p>
            <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[18px] text-[#09090b]">
              We'll handle the rest.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center p-[10px] -mr-[10px]"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M1 1L17 17M17 1L1 17" stroke="#09090b" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* When are you free? */}
        <div className="flex flex-col gap-[12px]">
          <SectionLabel title="When are you free?" />
          <div className="flex gap-[8px]">
            <DateCard title="Today" dateLabel={todayLabel} selected={date === "today"} onClick={() => setDate("today")} />
            <DateCard title="Tomorrow" dateLabel={tomorrowLabel} selected={date === "tomorrow"} onClick={() => setDate("tomorrow")} />
            <DateCard title="Weekend" dateLabel={weekendLabel} selected={date === "weekend"} onClick={() => setDate("weekend")} />
          </div>
        </div>

        {/* Social battery */}
        <div className="flex flex-col gap-[12px]">
          <SectionLabel title="How's your social battery?" hint="chill" />
          <div className="flex gap-[8px]">
            <BatteryOption level="low" label="Low" selected={battery === "low"} onClick={() => setBattery("low")} />
            <BatteryOption level="mid" label="Mid" selected={battery === "mid"} onClick={() => setBattery("mid")} />
            <BatteryOption level="full" label="Full" selected={battery === "full"} onClick={() => setBattery("full")} />
          </div>
        </div>

        {/* Budget */}
        <div className="flex flex-col gap-[12px]">
          <SectionLabel title="What's the budget?" hint="cheap eats, casual" />
          <div className="flex gap-[8px]">
            <OptionPill label="Free" selected={budget === "free"} onClick={() => setBudget("free")} />
            <OptionPill label="€" selected={budget === "€"} onClick={() => setBudget("€")} />
            <OptionPill label="€€" selected={budget === "€€"} onClick={() => setBudget("€€")} />
            <OptionPill label="€€€" selected={budget === "€€€"} onClick={() => setBudget("€€€")} />
          </div>
        </div>

        {/* Distance */}
        <div className="flex flex-col gap-[12px]">
          <SectionLabel title="Stay close or explore?" hint="less than 2km" />
          <div className="flex gap-[8px]">
            <OptionPill label="Close-by" selected={distance === "close"} onClick={() => setDistance("close")} />
            <OptionPill label="Short ride" selected={distance === "ride"} onClick={() => setDistance("ride")} />
            <OptionPill label="Anywhere" selected={distance === "anywhere"} onClick={() => setDistance("anywhere")} />
          </div>
        </div>

        {/* Search button */}
        <button
          type="button"
          onClick={() => navigate("/choose-plan")}
          className="w-full h-[45px] rounded-[999px] flex items-center justify-center gap-[6px] mt-auto shrink-0"
          style={{ background: "linear-gradient(180deg, rgba(255,72,62,1) 0%, rgba(255,48,43,1) 100%)" }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="7.5" cy="7.5" r="6" stroke="#fefefe" strokeWidth="1.5" />
            <path d="M12 12L16.5 16.5" stroke="#fefefe" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[16px] leading-[21px] text-[#fefefe]">
            Search for plans
          </span>
        </button>

      </div>
    </div>
  );
}
