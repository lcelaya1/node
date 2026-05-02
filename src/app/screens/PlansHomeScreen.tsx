import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AppNavbar } from "../components/AppNavbar";
import { HomeHeader } from "../components/HomeHeader";
import { loadSavedPlans, type SavedPlan } from "../lib/plans";
import NoPlansScreen from "./NoPlansScreen";

const fallbackPlanImage = "https://www.figma.com/api/mcp/asset/f09dd6ab-6d26-46fd-85b8-0715408f10cb";
const avatarFallback = "https://www.figma.com/api/mcp/asset/920565ce-048b-463b-b67c-d2fb3054dbdb";
const unreadStorageKey = "plans-home-unread-counts-v1";

type FilterType = "all" | "today" | "tomorrow" | "weekend";

function getPlanTimestamp(plan: SavedPlan): number | null {
  if (!plan.whenDate) return null;

  // Prefer the explicit ISO date stored by the form (YYYY-MM-DD).
  const isoMatch = plan.whenDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const month = Number(isoMatch[2]) - 1;
    const day = Number(isoMatch[3]);
    return new Date(year, month, day).getTime();
  }

  // Fallback for legacy/free-text values.
  const parsed = Date.parse(plan.whenDate);
  if (!Number.isNaN(parsed)) {
    const parsedDate = new Date(parsed);
    return new Date(
      parsedDate.getFullYear(),
      parsedDate.getMonth(),
      parsedDate.getDate(),
    ).getTime();
  }

  return null;
}

function matchesFilter(plan: SavedPlan, filter: FilterType): boolean {
  if (filter === "all") return true;

  const now = new Date();
  const planTimestamp = getPlanTimestamp(plan);

  if (planTimestamp !== null) {
    const planDate = new Date(planTimestamp);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const tomorrow = today + 24 * 60 * 60 * 1000;
    const dayStart = new Date(planDate.getFullYear(), planDate.getMonth(), planDate.getDate()).getTime();

    if (filter === "today") return dayStart === today;
    if (filter === "tomorrow") return dayStart === tomorrow;
    if (filter === "weekend") {
      const day = planDate.getDay();
      return day === 0 || day === 6;
    }
  }

  const whenText = `${plan.whenDate ?? ""} ${plan.when ?? ""}`.toLowerCase();

  if (filter === "today") return whenText.includes("today");
  if (filter === "tomorrow") return whenText.includes("tomorrow");
  if (filter === "weekend") {
    return (
      whenText.includes("weekend") ||
      whenText.includes("saturday") ||
      whenText.includes("sunday")
    );
  }

  return false;
}

function getChatTime(plan: SavedPlan): string {
  const source = `${plan.whenTime ?? ""} ${plan.when ?? ""}`;
  const match = source.match(/(\d{1,2}:\d{2})/);
  if (match?.[1]) return match[1];
  return "17:33";
}

function getChatPreview(plan: SavedPlan): { author: string; text: string } {
  const author =
    plan.creator?.name ??
    plan.participants?.[0]?.name ??
    "Marta";

  return {
    author,
    text: `Are we still on for ${plan.title || "the plan"}?`,
  };
}

type NotificationProps = {
  count?: number;
};

function Notification({ count = 3 }: NotificationProps) {
  return (
    <div className="flex size-[24px] items-center justify-center rounded-full bg-button-secondary">
      <span className="type-body-s text-invert-token">{count}</span>
    </div>
  );
}

type HomePlanCardProps = {
  isCreatedByUser?: boolean;
  onClick?: () => void;
  title: string;
  imageSrc?: string;
};

function HomePlanCard({
  isCreatedByUser = false,
  onClick,
  title,
  imageSrc,
}: HomePlanCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex w-[144px] shrink-0 flex-col gap-[8px] rounded-[8px] text-left"
    >
      {isCreatedByUser ? (
        <div className="pointer-events-none absolute left-0 top-0 z-[1] h-[72px] w-[72px] overflow-hidden rounded-tl-[8px]">
          <div
            className="absolute left-[-42px] top-[10px] w-[128px] -rotate-45 py-[4px] text-center"
            style={{ backgroundColor: "var(--color-surface-bg-secondary)" }}
          >
            <span className="text-[10px] leading-[14px] text-primary-token">You</span>
          </div>
        </div>
      ) : null}

      <div className="h-[110px] w-full shrink-0 overflow-hidden rounded-[8px]">
        <img
          alt={title}
          className="size-full object-cover"
          src={imageSrc || fallbackPlanImage}
        />
      </div>

      <div className="flex w-full flex-col items-start">
        <p
          className="type-body-s-medium w-full whitespace-normal break-words text-left text-primary-token"
        >
          {title}
        </p>
      </div>
    </button>
  );
}

type FilterButtonProps = {
  isActive: boolean;
  label: string;
  onClick: () => void;
};

function FilterButton({ isActive, label, onClick }: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`relative shrink-0 rounded-[999px] px-[16px] py-[6px] ${
        isActive ? "bg-[#e4e4e7]" : "bg-surface-primary"
      }`}
    >
      <span className="type-body-s text-primary-token">{label}</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[999px] border border-card-token"
      />
    </button>
  );
}

type PlanChatRowProps = {
  plan: SavedPlan;
  onClick?: () => void;
  showDivider?: boolean;
  unreadCount?: number;
};

function PlanChatRow({ plan, onClick, showDivider = true, unreadCount = 0 }: PlanChatRowProps) {
  const preview = getChatPreview(plan);

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-between py-[14px] text-left"
      >
        <div className="flex min-w-0 flex-1 items-center gap-[8px]">
          <img
            alt=""
            className="size-[42px] shrink-0 rounded-full object-cover"
            src={plan.picturePreview || avatarFallback}
          />

          <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
            <p className="type-body-s-medium truncate text-primary-token">
              {plan.title || "Title of the plan here"}
            </p>
            <p className="type-body-xs truncate text-primary-token">
              <span className="text-primary-token">{preview.author}:</span>{" "}
              <span className="text-secondary-token">{preview.text}</span>
            </p>
          </div>
        </div>

        <div className="ml-[12px] flex h-[40px] shrink-0 flex-col items-end justify-between">
          <span className={`text-[10px] leading-[16px] ${unreadCount > 0 ? "text-[#fc312e]" : "text-secondary-token"}`}>
            {getChatTime(plan)}
          </span>
          {unreadCount > 0 ? <Notification count={unreadCount} /> : null}
        </div>
      </button>

      {showDivider ? (
        <div className="relative h-0 w-full shrink-0">
          <div className="absolute inset-[-0.5px_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 393 1">
              <path d="M0 0.5H393" stroke="var(--stroke-0, #E4E4E7)" />
            </svg>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default function PlansHomeScreen() {
  const navigate = useNavigate();
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");
  const [unreadByPlanId, setUnreadByPlanId] = useState<Record<string, number>>({});

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      const plans = await loadSavedPlans();
      if (!isMounted) return;
      setSavedPlans(plans);
    };

    void run();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const upcomingPlanIds = savedPlans
      .filter((plan) => !plan.completedAt)
      .map((plan) => String(plan.id));

    if (upcomingPlanIds.length === 0) return;

    setUnreadByPlanId((previous) => {
      let stored: Record<string, number> = {};
      try {
        const parsed = JSON.parse(window.localStorage.getItem(unreadStorageKey) || "{}");
        if (parsed && typeof parsed === "object") {
          stored = parsed as Record<string, number>;
        }
      } catch {
        stored = {};
      }

      const next: Record<string, number> = { ...stored, ...previous };
      let changed = false;

      for (const planId of upcomingPlanIds) {
        if (typeof next[planId] !== "number") {
          next[planId] = Math.floor(Math.random() * 10) + 1;
          changed = true;
        }
      }

      for (const key of Object.keys(next)) {
        if (!upcomingPlanIds.includes(key)) {
          delete next[key];
          changed = true;
        }
      }

      const hasStateDiff = JSON.stringify(next) !== JSON.stringify(previous);

      if (changed) {
        window.localStorage.setItem(unreadStorageKey, JSON.stringify(next));
      }

      return changed || hasStateDiff ? next : previous;
    });
  }, [savedPlans]);

  const openPlanChat = (plan: SavedPlan, selectedIndex: number) => {
    const planId = String(plan.id);

    setUnreadByPlanId((previous) => {
      if ((previous[planId] ?? 0) === 0) return previous;
      const next = { ...previous, [planId]: 0 };
      window.localStorage.setItem(unreadStorageKey, JSON.stringify(next));
      return next;
    });

    navigate("/chat", {
      state: {
        imageSrc: plan.picturePreview || fallbackPlanImage,
        plan,
        selectedIndex,
      },
    });
  };

  if (savedPlans.length === 0) {
    return <NoPlansScreen />;
  }

  const upcomingPlans = savedPlans.filter((plan) => !plan.completedAt);

  if (upcomingPlans.length === 0) {
    return <NoPlansScreen />;
  }

  const filteredPlans = upcomingPlans.filter((plan) => matchesFilter(plan, selectedFilter));
  const visiblePlans = filteredPlans.slice(0, 6);
  const chatPlans = upcomingPlans.slice(0, 3);

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-surface-primary">
      <div
        className="flex flex-1 flex-col gap-[24px] overflow-y-auto px-[20px]"
        style={{ paddingBottom: "calc(108px + env(safe-area-inset-bottom))" }}
      >
        <HomeHeader title="Hello, Cristina!" topPaddingClassName="pt-[32px]" />

        <div className="flex flex-col gap-[12px]">
          <div className="flex flex-col gap-[8px]">
            <h2 className="type-body-m-medium text-primary-token">Upcoming Plans</h2>
            <div className="flex items-start gap-[6px] overflow-x-auto pb-[2px]">
              <FilterButton
                label="All"
                isActive={selectedFilter === "all"}
                onClick={() => setSelectedFilter("all")}
              />
              <FilterButton
                label="Today"
                isActive={selectedFilter === "today"}
                onClick={() => setSelectedFilter("today")}
              />
              <FilterButton
                label="Tomorrow"
                isActive={selectedFilter === "tomorrow"}
                onClick={() => setSelectedFilter("tomorrow")}
              />
              <FilterButton
                label="This weekend"
                isActive={selectedFilter === "weekend"}
                onClick={() => setSelectedFilter("weekend")}
              />
            </div>
          </div>

          <div className="-mr-[20px] flex h-[135px] w-auto items-start gap-[8px] overflow-x-auto overflow-y-hidden pb-[2px] pr-[20px]">
            {visiblePlans.length === 0 ? (
              <div className="flex h-full w-full items-center justify-center rounded-[8px] border border-card-token border-dashed">
                <p className="type-body-s text-secondary-token">No plans for this filter</p>
              </div>
            ) : (
              visiblePlans.map((plan, index) => (
                <HomePlanCard
                  key={plan.id}
                  imageSrc={plan.picturePreview || fallbackPlanImage}
                  isCreatedByUser={plan.source === "created"}
                  onClick={() => openPlanChat(plan, index)}
                  title={plan.title || "Title of the plan"}
                />
              ))
            )}
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col items-start">
          <div className="relative w-full shrink-0">
            <div className="flex size-full flex-row items-center justify-center">
              <div className="relative flex size-full items-center justify-center">
                <div className="relative flex min-w-px flex-1 flex-col justify-center">
                  <h2 className="type-body-m-medium text-primary-token">Chats</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            {chatPlans.map((plan, index) => (
              <PlanChatRow
                key={`${plan.id}-chat`}
                plan={plan}
                unreadCount={unreadByPlanId[String(plan.id)] ?? 0}
                showDivider={index < chatPlans.length - 1}
                onClick={() => openPlanChat(plan, index)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-card-token bg-surface-primary">
        <AppNavbar
          activeTab="home"
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
