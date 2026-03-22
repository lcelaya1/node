import { useState } from "react";
import { useNavigate } from "react-router";
import { IconButton } from "../components/IconButton";
import type { JoinFilterState } from "../lib/planCatalog";

// ── Date helpers ──────────────────────────────────────────────────────────────
function getDateLabel(offset: number) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function getWeekendLabel() {
  const today = new Date();
  const day = today.getDay(); // 0 Sun … 6 Sat
  const daysToSat = day === 6 ? 7 : day === 0 ? 6 : 6 - day;
  const sat = new Date(today);
  sat.setDate(today.getDate() + daysToSat);
  const sun = new Date(sat);
  sun.setDate(sat.getDate() + 1);
  const satDay = sat.getDate();
  const sunLabel = sun.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return `${satDay} - ${sunLabel}`;
}

// ── Small shared components ───────────────────────────────────────────────────
function SectionLabel({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex items-end justify-between w-full">
      <p className="type-body-m-medium text-primary-token">
        {title}
      </p>
      {hint && (
        <p className="type-body-xs italic text-secondary-token">
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
        selected ? "border-selected-token" : "border-card-token"
      }`}
    >
      <span className="type-body-s text-primary-token whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}

// ── Battery icon ──────────────────────────────────────────────────────────────
function BatteryIcon({ level }: { level: "low" | "mid" | "full" }) {
  const fills = { low: "25%", mid: "55%", full: "85%" };
  return (
    <svg width="24" height="36" viewBox="0 0 24 36" fill="none" className="icon-primary-token">
      {/* Cap */}
      <rect x="9" y="1" width="6" height="3" rx="1" fill="currentColor" />
      {/* Body outline */}
      <rect x="3" y="4" width="18" height="30" rx="3" stroke="currentColor" strokeWidth="1.5" />
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
        fill="currentColor"
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
      className={`flex flex-1 flex-col items-center justify-center gap-[8px] py-[12px] rounded-[8px] border transition-colors ${
        selected ? "border-selected-token" : "border-card-token"
      }`}
    >
      <BatteryIcon level={level} />
      <span className="type-body-s text-primary-token">
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
  const dateParts = dateLabel.split(" ");
  const monthPart = dateParts.at(-1) ?? "";
  const dayPart = dateParts.slice(0, -1).join(" ");
  const isWeekendRange = dayPart.includes("-");

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 flex-col items-start justify-between px-[8px] py-[8px] rounded-[8px] border h-[114px] transition-colors ${
        selected ? "border-selected-token" : "border-card-token"
      }`}
    >
      <span
        className={`type-body-m-medium ${
          selected ? "text-brand-token" : "text-primary-token"
        }`}
      >
        {title}
      </span>
      <div className="flex items-end gap-[2px]">
        <span className="type-heading-m text-primary-token leading-[1]">{dayPart}</span>
        <span className="type-body-s text-secondary-token">
          {monthPart}
        </span>
      </div>
    </button>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function JoinPlanScreen() {
  const navigate = useNavigate();

  const [date, setDate] = useState<JoinFilterState["date"]>("today");
  const [battery, setBattery] = useState<JoinFilterState["battery"]>("low");
  const [budget, setBudget] = useState<JoinFilterState["budget"]>("€");
  const [distance, setDistance] = useState<JoinFilterState["distance"]>("close");

  const todayLabel = getDateLabel(0);
  const tomorrowLabel = getDateLabel(1);
  const weekendLabel = getWeekendLabel();
  const batteryHint =
    battery === "low"
      ? "chill, no effort"
      : battery === "mid"
      ? "up for most things"
      : "high energy, let's go";
  const budgetHint =
    budget === "free"
      ? undefined
      : budget === "€"
      ? "€1-10"
      : budget === "€€"
      ? "€10-20"
      : "€20-30";
  const distanceHint =
    distance === "close"
      ? "less than 2km"
      : distance === "ride"
      ? "2km - 10km"
      : "10km - 50km";

  return (
    <div
      className="bg-surface-primary size-full flex flex-col overflow-y-auto"
      style={{
        minHeight: "calc(100% + max(16px, env(safe-area-inset-top)))",
      }}
    >
      <div className="flex flex-col flex-1 px-[20px] pt-[32px] pb-[32px] gap-[40px]">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-[2px]">
            <p className="type-heading-m text-primary-token">
              First, set the vibe.
            </p>
            <p className="type-body-s text-primary-token">
              We'll handle the rest.
            </p>
          </div>
          <IconButton
            hierarchy="Primary"
            icon="Close"
            size="Mid"
            onClick={() => navigate(-1)}
            className="-mr-[8px]"
            aria-label="Close"
          />
        </div>

        <div className="flex flex-col gap-[24px]">
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
            <SectionLabel title="How's your social battery?" hint={batteryHint} />
            <div className="flex gap-[8px]">
              <BatteryOption level="low" label="Low" selected={battery === "low"} onClick={() => setBattery("low")} />
              <BatteryOption level="mid" label="Mid" selected={battery === "mid"} onClick={() => setBattery("mid")} />
              <BatteryOption level="full" label="Full" selected={battery === "full"} onClick={() => setBattery("full")} />
            </div>
          </div>

          {/* Budget */}
          <div className="flex flex-col gap-[12px]">
            <SectionLabel title="What's the budget?" hint={budgetHint} />
            <div className="flex gap-[8px]">
              <OptionPill label="Free" selected={budget === "free"} onClick={() => setBudget("free")} />
              <OptionPill label="€" selected={budget === "€"} onClick={() => setBudget("€")} />
              <OptionPill label="€€" selected={budget === "€€"} onClick={() => setBudget("€€")} />
              <OptionPill label="€€€" selected={budget === "€€€"} onClick={() => setBudget("€€€")} />
            </div>
          </div>

          {/* Distance */}
          <div className="flex flex-col gap-[12px]">
            <SectionLabel title="Stay close or explore?" hint={distanceHint} />
            <div className="flex gap-[8px]">
              <OptionPill label="Close-by" selected={distance === "close"} onClick={() => setDistance("close")} />
              <OptionPill label="Short ride" selected={distance === "ride"} onClick={() => setDistance("ride")} />
              <OptionPill label="Worth the trip" selected={distance === "anywhere"} onClick={() => setDistance("anywhere")} />
            </div>
          </div>
        </div>

        {/* Search button */}
        <button
          type="button"
          onClick={() =>
            navigate("/choose-plan", {
              state: {
                filters: {
                  battery,
                  budget,
                  date,
                  distance,
                } satisfies JoinFilterState,
              },
            })
          }
          className="w-full h-[45px] rounded-[999px] flex items-center justify-center gap-[6px] mt-auto shrink-0"
          style={{ background: "linear-gradient(180deg, var(--color-button-secondary) 0%, var(--color-button-secondary) 100%)" }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-invert-token">
            <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 12L16.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="type-body-m text-invert-token">
            Search for plans
          </span>
        </button>

      </div>
    </div>
  );
}
