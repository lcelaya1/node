import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useLocation, useNavigate } from "react-router";
import { AppIcon } from "../components/AppIcon";
import { AppNavbar } from "../components/AppNavbar";
import { DiaryMemoryCard, type DiaryMemoryGroup } from "../components/DiaryMemoryCard";
import { Sheet, SheetContent, SheetTitle } from "../components/ui/sheet";
import { cn } from "../components/ui/utils";
import { loadPlanMemories, type PlanMemoryImage } from "../lib/planMemories";
import { loadSavedPlans, type SavedPlan } from "../lib/plans";
import { supabase } from "../lib/supabase";
import feedIcon from "../../assets/svg/Feed.svg";
import calendarIcon from "../../assets/svg/Calendar.svg";
import emptyMemoryLeft from "../../assets/diary-empty/empty-collage-left.png";
import emptyMemoryRight from "../../assets/diary-empty/empty-collage-right.png";

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
    <div className="flex h-[44px] shrink-0 items-center gap-[4px] rounded-[222px] bg-surface-secondary px-[6px]">
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
  onAddMemoryClick,
  onViewModeChange,
  viewMode,
}: {
  onAddMemoryClick: () => void;
  onViewModeChange: (value: DiaryViewMode) => void;
  viewMode: DiaryViewMode;
}) {
  return (
    <div className="flex w-full shrink-0 flex-col gap-[24px] pt-[32px]">
      <h1 className="type-heading-2xl text-primary-token">Memories</h1>

      <div className="flex w-full shrink-0 items-center justify-between">
        <button
          type="button"
          onClick={onAddMemoryClick}
          aria-label="Add memory"
          className="relative flex shrink-0 items-center justify-center gap-[4px] rounded-[888px] bg-button-primary px-[16px] py-[8px] transition-opacity active:opacity-90"
        >
          <span className="whitespace-nowrap text-center text-[14px] font-normal leading-[18px] text-invert-token">
            Add memory
          </span>
          <span className="inline-flex shrink-0 text-invert-token" aria-hidden>
            <AppIcon name="Add" size={19} className="shrink-0 text-invert-token" />
          </span>
        </button>

        <DiaryViewSwitch onChange={onViewModeChange} value={viewMode} />
      </div>
    </div>
  );
}

function EmptyCollage() {
  return (
    <div className="flex h-[85.509px] shrink-0 items-start gap-[8px]">
      <div className="relative h-full w-[85.509px] shrink-0 overflow-hidden rounded-[3.054px] bg-surface-secondary">
        <img
          alt=""
          className="pointer-events-none absolute inset-0 max-w-none size-full rounded-[3.054px] object-cover"
          src={emptyMemoryLeft}
        />
      </div>

      <div className="relative h-full w-[85.509px] shrink-0 overflow-hidden rounded-[3.054px] bg-surface-secondary">
        <img
          alt=""
          className="pointer-events-none absolute inset-0 max-w-none size-full rounded-[3.054px] object-cover"
          src={emptyMemoryRight}
        />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[calc(100dvh-238px)] w-full items-center justify-center">
      <div className="flex w-full max-w-[353px] flex-col items-center gap-[24px]">
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

function formatDayHeading(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function addMonths(date: Date, offset: number) {
  return new Date(date.getFullYear(), date.getMonth() + offset, 1);
}

/** Una entrada por plan con solo las fotos añadidas en ese día (para el modal del calendario). */
function buildGroupsForCalendarDay(
  dayItems: PlanMemoryImage[],
  memoryGroups: DiaryMemoryGroup[],
): DiaryMemoryGroup[] {
  const fullByPlan = new Map(memoryGroups.map((g) => [g.planId, g]));
  const byPlan = new Map<string, PlanMemoryImage[]>();

  dayItems.forEach((memory) => {
    const list = byPlan.get(memory.planId) ?? [];
    list.push(memory);
    byPlan.set(memory.planId, list);
  });

  const rows: DiaryMemoryGroup[] = [];

  byPlan.forEach((images, planId) => {
    images.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    const full = fullByPlan.get(planId);
    let description: string | undefined;
    images.some((img) => {
      const trimmed = img.note?.trim();
      if (trimmed) {
        description = trimmed;
        return true;
      }
      return false;
    });
    if (!description?.trim() && full?.description?.trim()) {
      description = full.description.trim();
    }

    rows.push({
      createdAt: images[images.length - 1]?.createdAt ?? images[0].createdAt,
      description,
      images,
      planId,
      title: full?.title?.trim() || "Plan Title",
    });
  });

  return rows.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

function CalendarView({
  dayModal,
  dayModalGroups,
  memories,
  memoryGroups,
  setDayModal,
}: {
  dayModal: { date: Date; items: PlanMemoryImage[] } | null;
  dayModalGroups: DiaryMemoryGroup[];
  memories: PlanMemoryImage[];
  memoryGroups: DiaryMemoryGroup[];
  setDayModal: Dispatch<SetStateAction<{ date: Date; items: PlanMemoryImage[] } | null>>;
}) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const groupByPlanId = useMemo(() => {
    const map = new Map<string, DiaryMemoryGroup>();
    memoryGroups.forEach((g) => map.set(g.planId, g));
    return map;
  }, [memoryGroups]);

  const memoriesByDay = useMemo(() => {
    const map = new Map<string, PlanMemoryImage[]>();

    memories.forEach((memory) => {
      const date = new Date(memory.createdAt);
      if (Number.isNaN(date.getTime())) return;

      const key = formatDayKey(date);
      const list = map.get(key) ?? [];
      list.push(memory);
      map.set(key, list);
    });

    map.forEach((list) => {
      list.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
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

        // Current month always first
        if (leftOffset === 0) return -1;
        if (rightOffset === 0) return 1;
        // Past months before future months
        if (leftOffset < 0 && rightOffset > 0) return -1;
        if (leftOffset > 0 && rightOffset < 0) return 1;
        // Both past: most recent first
        if (leftOffset < 0 && rightOffset < 0) return rightOffset - leftOffset;
        // Both future: nearest first
        return leftOffset - rightOffset;
      });
  }, [memories]);

  return (
    <>
      <Sheet open={dayModal !== null} onOpenChange={(open) => !open && setDayModal(null)}>
        <SheetContent
          side="bottom"
          className={cn(
            // Como máximo 468px; con pocos planes el sheet encoge al contenido; si hay muchos, scroll en la lista.
            "flex max-h-[468px] min-h-0 w-full flex-col gap-0 overflow-hidden rounded-t-[36px] border-0 bg-surface-primary px-5 pb-[calc(20px+env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_40px_rgba(9,9,11,0.12)]",
            "[&>button.absolute]:hidden",
          )}
        >
          <div className="shrink-0">
            <div
              aria-hidden
              className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#09090b]/15"
            />

            <SheetTitle className="mb-4 px-2 text-center font-primary text-[22px] font-medium leading-[26px] text-primary-token">
              {dayModal ? formatDayHeading(dayModal.date) : ""}
            </SheetTitle>
          </div>

          {/* Outer solo scrollea; inner flex para gap. Si el outer fuera flex-col, los planes heredan flex-shrink y se aplastan. */}
          <div
            className="-mr-1 min-h-0 w-full min-w-0 shrink-0 overflow-y-auto overscroll-y-contain pb-1 pr-1"
            style={{
              WebkitOverflowScrolling: "touch",
              maxHeight:
                "calc(468px - 12px - 20px - env(safe-area-inset-bottom, 0px) - 5.75rem)",
            }}
          >
            <div className="flex min-w-0 flex-col gap-5">
              {dayModal && dayModal.items.length === 0 ? (
                <p className="text-center type-body-s text-secondary-token">
                  No memories on this date.
                </p>
              ) : null}

              {dayModalGroups.map((g) => (
                <DiaryMemoryCard
                  key={g.planId}
                  calendarReturnDayKey={dayModal ? formatDayKey(dayModal.date) : undefined}
                  group={g}
                  routerState={groupByPlanId.get(g.planId)}
                />
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div ref={scrollContainerRef} className="flex flex-1 min-h-0 flex-col gap-[28px] overflow-y-auto pr-[2px]">
        {months.map((month) => (
          <section
            key={month.key}
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
                const dayMemories = memoriesByDay.get(dayKey) ?? [];
                const thumbnail = dayMemories[0];
                const count = dayMemories.length;

                return (
                  <div key={dayKey} className="flex h-[44px] items-center justify-center">
                    <button
                      type="button"
                      aria-label={
                        thumbnail
                          ? `View memories, ${formatDayHeading(date)}, ${count} photo${count === 1 ? "" : "s"}`
                          : `No memories on ${formatDayHeading(date)}`
                      }
                      className={cn(
                        "flex size-[44px] items-center justify-center rounded-[12px] outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring",
                        thumbnail ? "p-[2px]" : "hover:bg-surface-secondary/80",
                      )}
                      onClick={() => setDayModal({ date: new Date(date), items: dayMemories })}
                    >
                      {thumbnail ? (
                        <div className="relative flex size-[40px] items-center justify-center overflow-hidden rounded-full">
                          <img
                            alt=""
                            aria-hidden
                            className="absolute inset-0 size-full object-cover"
                            src={thumbnail.url}
                          />
                          <div className="absolute inset-0 bg-[rgba(9,9,11,0.12)]" />
                          <span className="relative type-body-xs font-medium tabular-nums text-invert-token">
                            {date.getDate()}
                          </span>
                        </div>
                      ) : (
                        <span className="type-body-s tabular-nums text-primary-token">
                          {date.getDate()}
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

export default function DiaryScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [viewMode, setViewMode] = useState<DiaryViewMode>("grid");
  const [memories, setMemories] = useState<PlanMemoryImage[]>([]);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [memoriesReady, setMemoriesReady] = useState(false);
  const [dayModal, setDayModal] = useState<{ date: Date; items: PlanMemoryImage[] } | null>(null);

  useEffect(() => {
    let active = true;
    setMemoriesReady(false);

    const run = async () => {
      const [nextMemories, nextPlans] = await Promise.all([
        loadPlanMemories(),
        loadSavedPlans(),
      ]);

      if (!active) return;

      setMemories(nextMemories);
      setSavedPlans(nextPlans);
      setMemoriesReady(true);
    };

    void run();

    return () => {
      active = false;
    };
  }, [location.key]);


  const memoryGroups = useMemo(() => {
    const planMap = new Map(savedPlans.map((plan) => [plan.id, plan]));
    const groups = new Map<string, DiaryMemoryGroup>();

    memories.forEach((memory) => {
      const existing = groups.get(memory.planId);
      const plan = planMap.get(memory.planId);
      const note = memory.note?.trim();

      if (existing) {
        if (!existing.description && note) {
          existing.description = note;
        }
        existing.images.push(memory);
        return;
      }

      groups.set(memory.planId, {
        createdAt: memory.createdAt,
        description: note || undefined,
        images: [memory],
        planId: memory.planId,
        title: plan?.title?.trim() || "Plan Title",
      });
    });

    return Array.from(groups.values())
      .map((group) => ({
        ...group,
        images: [...group.images].sort(
          (left, right) =>
            new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
        ),
      }))
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }, [memories, savedPlans]);

  const dayModalGroups = useMemo(() => {
    if (!dayModal) return [];
    return buildGroupsForCalendarDay(dayModal.items, memoryGroups);
  }, [dayModal, memoryGroups]);

  useEffect(() => {
    const reopen = (location.state as { diaryReopenCalendarDay?: string } | null)
      ?.diaryReopenCalendarDay;
    if (!reopen || !memoriesReady) return;

    const parts = reopen.split("-");
    const y = Number(parts[0]);
    const mo = Number(parts[1]);
    const da = Number(parts[2]);
    if (!Number.isFinite(y) || !Number.isFinite(mo) || !Number.isFinite(da)) {
      navigate(location.pathname, { replace: true, state: {} });
      return;
    }

    const items = memories
      .filter((memory) => {
        const d = new Date(memory.createdAt);
        if (Number.isNaN(d.getTime())) return false;
        return formatDayKey(d) === reopen;
      })
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

    setViewMode("calendar");
    setDayModal({ date: new Date(y, mo - 1, da), items });
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.state, location.pathname, memories, memoriesReady, navigate]);

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-surface-primary">
      <div className="shrink-0 px-[20px]">
        <Header
          onAddMemoryClick={() =>
            navigate("/add-memories", { state: { hideSkip: true } })
          }
          onViewModeChange={setViewMode}
          viewMode={viewMode}
        />
      </div>

      <div
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto px-[20px] pt-[24px]"
        style={{
          paddingBottom: "calc(108px + env(safe-area-inset-bottom))",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {memoryGroups.length > 0 ? (
          viewMode === "calendar" ? (
            <CalendarView
              dayModal={dayModal}
              dayModalGroups={dayModalGroups}
              memories={memories}
              memoryGroups={memoryGroups}
              setDayModal={setDayModal}
            />
          ) : (
            <div className="flex min-w-0 flex-col gap-[20px]">
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
