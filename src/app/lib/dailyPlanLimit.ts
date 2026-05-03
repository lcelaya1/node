export type DailyPlanAction = "created" | "joined";

type DailyPlanLimitState = {
  created: boolean;
  dateKey: string;
  joined: boolean;
};

const STORAGE_KEY = "node-daily-plan-limit-v1";
export const DAILY_PLAN_LIMIT_EVENT = "node-daily-plan-limit";

function canUseStorage() {
  return typeof window !== "undefined" && "localStorage" in window;
}

function getTodayKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseState(raw: string | null): DailyPlanLimitState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<DailyPlanLimitState>;
    if (typeof parsed?.dateKey !== "string") return null;
    return {
      created: Boolean(parsed.created),
      dateKey: parsed.dateKey,
      joined: Boolean(parsed.joined),
    };
  } catch {
    return null;
  }
}

export function getDailyPlanLimitState(): DailyPlanLimitState {
  const empty: DailyPlanLimitState = {
    created: false,
    dateKey: getTodayKey(),
    joined: false,
  };
  if (!canUseStorage()) return empty;
  const parsed = parseState(window.localStorage.getItem(STORAGE_KEY));
  if (!parsed || parsed.dateKey !== empty.dateKey) return empty;
  return parsed;
}

export function markDailyPlanAction(action: DailyPlanAction) {
  if (!canUseStorage()) return;
  const state = getDailyPlanLimitState();
  const next: DailyPlanLimitState = {
    ...state,
    [action]: true,
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(DAILY_PLAN_LIMIT_EVENT));
}
