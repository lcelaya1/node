import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { AppNavbar } from "../components/AppNavbar";
import { DiaryMemoryCard, type DiaryMemoryGroup } from "../components/DiaryMemoryCard";
import { loadPlanMemories, type PlanMemoryImage } from "../lib/planMemories";
import { loadSavedPlans, type SavedPlan } from "../lib/plans";
import { supabase } from "../lib/supabase";
import feedIcon from "../../assets/svg/Feed.svg";
import calendarIcon from "../../assets/svg/Calendar.svg";
import emptyTallImage from "../../assets/V2 APP (12/Memory 1.png";
import emptyTopLeftImage from "../../assets/V2 APP (12/Memory 2.png";
import emptyTopRightImage from "../../assets/V2 APP (12/Memory 3.png";
import emptyBottomLeftImage from "../../assets/V2 APP (12/Memory 4.png";
import emptyBottomRightImage from "../../assets/V2 APP (12/Memory 5.png";

type DiaryViewMode = "grid" | "calendar";

function DiaryViewSwitch({
  onChange,
  value,
}: {
  onChange: (value: DiaryViewMode) => void;
  value: DiaryViewMode;
}) {
  const buttonBaseClass =
    "flex items-center justify-center rounded-[999px] p-[8px] transition-colors";

  return (
    <div className="flex h-[44px] items-center gap-[4px] rounded-[222px] bg-surface-secondary px-[6px]">
      <button
        type="button"
        onClick={() => onChange("grid")}
        aria-pressed={value === "grid"}
        className={`${buttonBaseClass} ${
          value === "grid"
            ? "bg-button-primary"
            : "bg-transparent text-primary-token hover:bg-surface-primary"
        }`}
      >
        <img
          alt=""
          aria-hidden="true"
          className={`size-[20px] ${
            value === "grid" ? "brightness-0 invert" : "brightness-0"
          }`}
          src={feedIcon}
        />
      </button>

      <button
        type="button"
        onClick={() => onChange("calendar")}
        aria-pressed={value === "calendar"}
        className={`${buttonBaseClass} ${
          value === "calendar"
            ? "bg-button-primary"
            : "bg-transparent text-primary-token hover:bg-surface-primary"
        }`}
      >
        <img
          alt=""
          aria-hidden="true"
          className={`size-[20px] ${
            value === "calendar" ? "brightness-0 invert" : "brightness-0"
          }`}
          src={calendarIcon}
        />
      </button>
    </div>
  );
}

function Header({
  onViewModeChange,
  viewMode,
}: {
  onViewModeChange: (value: DiaryViewMode) => void;
  viewMode: DiaryViewMode;
}) {
  return (
    <div className="flex items-center justify-between pt-[32px]">
      <h1 className="type-heading-2xl text-primary-token">Diary</h1>
      <DiaryViewSwitch onChange={onViewModeChange} value={viewMode} />
    </div>
  );
}

function EmptyCollage() {
  return (
    <div className="flex h-[168px] gap-[8px]">
      <div className="h-full w-[177px] overflow-hidden rounded-[6px]">
        <img alt="" className="size-full object-cover" src={emptyTallImage} />
      </div>

      <div className="grid h-full w-[168px] grid-cols-[80px_80px] grid-rows-[80px_80px] gap-[8px]">
        <div className="overflow-hidden rounded-[10px]">
          <img alt="" className="size-full object-cover" src={emptyTopLeftImage} />
        </div>
        <div className="overflow-hidden rounded-[10px]">
          <img alt="" className="size-full object-cover" src={emptyTopRightImage} />
        </div>
        <div className="overflow-hidden rounded-[10px]">
          <img alt="" className="size-full object-cover" src={emptyBottomLeftImage} />
        </div>
        <div className="overflow-hidden rounded-[10px]">
          <img alt="" className="size-full object-cover" src={emptyBottomRightImage} />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[calc(100dvh-238px)] w-full items-center justify-center">
      <div className="flex w-full max-w-[353px] flex-col items-center gap-[40px]">
        <EmptyCollage />

        <div className="flex w-full flex-col items-center gap-[8px] text-center">
          <p className="type-heading-l text-primary-token">
            You don&apos;t have any pictures yet
          </p>
          <p className="w-full type-body-s text-primary-token">
            After you finish a plan, you could upload the pictures of the plan so you can store and remember them
          </p>
        </div>
      </div>
    </div>
  );
}

type CalendarMonth = {
  key: string;
  label: string;
  weeks: Array<Array<Date | null>>;
};

const weekLabels = ["Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat.", "Sun."];

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function buildMonthWeeks(monthDate: Date) {
  const firstDay = startOfMonth(monthDate);
  const lastDay = endOfMonth(monthDate);
  const mondayIndex = (firstDay.getDay() + 6) % 7;
  const weeks: Array<Array<Date | null>> = [];
  let currentWeek: Array<Date | null> = Array.from({ length: mondayIndex }, () => null);

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    currentWeek.push(new Date(monthDate.getFullYear(), monthDate.getMonth(), day));

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  return weeks;
}

function formatDayKey(date: Date) {
  return [
    date.getFullYear(),
    `${date.getMonth() + 1}`.padStart(2, "0"),
    `${date.getDate()}`.padStart(2, "0"),
  ].join("-");
}

function formatMonthKey(date: Date) {
  return [
    date.getFullYear(),
    `${date.getMonth() + 1}`.padStart(2, "0"),
  ].join("-");
}

function addMonths(date: Date, offset: number) {
  return new Date(date.getFullYear(), date.getMonth() + offset, 1);
}

function CalendarView({
  memories,
}: {
  memories: PlanMemoryImage[];
}) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const currentMonthRef = useRef<HTMLElement | null>(null);
  const memoriesByDay = useMemo(() => {
    const map = new Map<string, PlanMemoryImage>();

    memories.forEach((memory) => {
      const date = new Date(memory.createdAt);
      if (Number.isNaN(date.getTime())) return;

      const key = formatDayKey(date);
      if (!map.has(key)) {
        map.set(key, memory);
      }
    });

    return map;
  }, [memories]);

  const months = useMemo<CalendarMonth[]>(() => {
    const today = new Date();
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    return Array.from({ length: 25 }, (_, index) => addMonths(currentMonth, index - 12))
      .map((monthDate) => ({
        key: formatMonthKey(monthDate),
        label: new Intl.DateTimeFormat("en-GB", {
          month: "long",
          year: "numeric",
        }).format(monthDate),
        weeks: buildMonthWeeks(monthDate),
      }))
      .sort((left, right) => {
        const leftDate = new Date(`${left.key}-01`);
        const rightDate = new Date(`${right.key}-01`);

        const leftOffset =
          (leftDate.getFullYear() - currentMonth.getFullYear()) * 12 +
          (leftDate.getMonth() - currentMonth.getMonth());
        const rightOffset =
          (rightDate.getFullYear() - currentMonth.getFullYear()) * 12 +
          (rightDate.getMonth() - currentMonth.getMonth());

        if (leftOffset >= 0 && rightOffset < 0) return -1;
        if (leftOffset < 0 && rightOffset >= 0) return 1;
        if (leftOffset >= 0 && rightOffset >= 0) return rightOffset - leftOffset;
        return rightOffset - leftOffset;
      });
  }, [memories]);

  const hasScrolledRef = useRef(false);

  useLayoutEffect(() => {
    if (hasScrolledRef.current) return;

    const container = scrollContainerRef.current;
    const currentMonthElement = currentMonthRef.current;

    if (!container || !currentMonthElement) return;

    hasScrolledRef.current = true;

    // Wait one frame so the browser finishes layout before measuring offsetTop
    requestAnimationFrame(() => {
      container.scrollTop = Math.max(currentMonthElement.offsetTop - 12, 0);
    });
  }, [months]);

  return (
    <div ref={scrollContainerRef} className="flex max-h-[calc(100dvh-220px)] flex-col gap-[28px] overflow-y-auto pr-[2px]">
      {months.map((month) => (
        <section
          key={month.key}
          ref={month.key === formatMonthKey(new Date()) ? currentMonthRef : undefined}
          className="flex flex-col gap-[16px]"
        >
          <h2 className="type-body-m-medium text-primary-token">{month.label}</h2>

          <div className="grid grid-cols-7 gap-x-[8px] gap-y-[12px]">
            {weekLabels.map((label) => (
              <div key={label} className="flex items-center justify-center">
                <span className="type-body-xs text-secondary-token">{label}</span>
              </div>
            ))}

            {month.weeks.flat().map((date, index) => {
              if (!date) {
                return <div key={`${month.key}-empty-${index}`} className="h-[44px]" />;
              }

              const dayKey = formatDayKey(date);
              const memory = memoriesByDay.get(dayKey);

              return (
                <div key={dayKey} className="flex h-[44px] items-center justify-center">
                  {memory ? (
                    <div className="relative flex size-[40px] items-center justify-center overflow-hidden rounded-full">
                      <img
                        alt={memory.name}
                        className="absolute inset-0 size-full object-cover"
                        src={memory.url}
                      />
                      <div className="absolute inset-0 bg-[rgba(9,9,11,0.12)]" />
                      <span className="relative type-body-xs text-invert-token">
                        {date.getDate()}
                      </span>
                    </div>
                  ) : (
                    <span className="type-body-s text-primary-token">
                      {date.getDate()}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

export default function DiaryScreen() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<DiaryViewMode>("grid");
  const [memories, setMemories] = useState<PlanMemoryImage[]>([]);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);

  useEffect(() => {
    let active = true;

    const run = async () => {
      const [nextMemories, nextPlans] = await Promise.all([
        loadPlanMemories(),
        loadSavedPlans(),
      ]);

      if (!active) return;

      setMemories(nextMemories);
      setSavedPlans(nextPlans);
    };

    void run();

    return () => {
      active = false;
    };
  }, []);


  const memoryGroups = useMemo(() => {
    const planMap = new Map(savedPlans.map((plan) => [plan.id, plan]));
    const groups = new Map<string, DiaryMemoryGroup>();

    memories.forEach((memory) => {
      const existing = groups.get(memory.planId);
      const plan = planMap.get(memory.planId);
      const description =
        plan?.description?.trim() ||
        "Photos saved from this plan so you can come back to the experience whenever you want.";

      if (existing) {
        existing.images.push(memory);
        return;
      }

      groups.set(memory.planId, {
        createdAt: memory.createdAt,
        description,
        images: [memory],
        planId: memory.planId,
        title: plan?.title?.trim() || "Plan Title",
      });
    });

    return Array.from(groups.values()).sort((left, right) =>
      right.createdAt.localeCompare(left.createdAt),
    );
  }, [memories, savedPlans]);

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-surface-primary">
      <div className="shrink-0 px-[20px]">
        <Header
          onViewModeChange={setViewMode}
          viewMode={viewMode}
        />
      </div>

      <div
        className="flex flex-1 flex-col overflow-y-auto px-[20px] pt-[24px]"
        style={{ paddingBottom: "calc(108px + env(safe-area-inset-bottom))" }}
      >
        {memoryGroups.length > 0 ? (
          viewMode === "calendar" ? (
            <CalendarView memories={memories} />
          ) : (
            <div className="flex flex-col gap-[20px]">
              {memoryGroups.map((group) => (
                <DiaryMemoryCard key={group.planId} group={group} />
              ))}
            </div>
          )
        ) : (
          <EmptyState />
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-card-token bg-surface-primary">
        <AppNavbar
          activeTab="diary"
          activeTone="brand"
          onCreatePlanClick={() => navigate("/add-specs")}
          onJoinPlanClick={() => navigate("/join-plan")}
          onTabClick={(tab) => {
            if (tab === "home") navigate("/");
            if (tab === "groups") navigate("/groups");
            if (tab === "diary") navigate("/diary");
            if (tab === "profile") navigate("/profile");
          }}
        />
      </div>
    </div>
  );
}
