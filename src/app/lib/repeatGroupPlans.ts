import { supabase } from "./supabase";

export type RepeatGroupPlan = {
  createdAt: string;
  createdByName: string;
  groupId: string;
  id: string;
  title: string;
  when: string;
  where: string;
};

const STORAGE_KEY = "node-repeat-group-plans";

function canUseStorage() {
  return typeof window !== "undefined" && "localStorage" in window;
}

async function getCurrentUserId() {
  if (!supabase) return null;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user.id;
}

function fromStorage(raw: string | null): RepeatGroupPlan[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as RepeatGroupPlan[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function loadRepeatGroupPlans(groupId: string): Promise<RepeatGroupPlan[]> {
  if (!groupId.trim()) return [];

  const userId = await getCurrentUserId();
  const byId = new Map<string, RepeatGroupPlan>();

  if (supabase && userId) {
    const { data, error } = await supabase
      .from("repeat_group_plans")
      .select("id, group_id, title, when_text, where_text, created_by_name, created_at")
      .eq("group_id", groupId)
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (!error && data) {
      data.forEach((plan) => {
        byId.set(plan.id, {
          createdAt: plan.created_at,
          createdByName: plan.created_by_name ?? "You",
          groupId: plan.group_id,
          id: plan.id,
          title: plan.title,
          when: plan.when_text ?? "",
          where: plan.where_text ?? "",
        });
      });
    }
  }

  if (canUseStorage()) {
    const local = fromStorage(window.localStorage.getItem(STORAGE_KEY));
    local
      .filter((plan) => plan.groupId === groupId)
      .forEach((plan) => {
        if (!byId.has(plan.id)) byId.set(plan.id, plan);
      });
  }

  return [...byId.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function createRepeatGroupPlan(
  input: Omit<RepeatGroupPlan, "createdAt" | "id">,
): Promise<RepeatGroupPlan> {
  const nextPlan: RepeatGroupPlan = {
    ...input,
    createdAt: new Date().toISOString(),
    id: `grp-plan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };

  const userId = await getCurrentUserId();

  if (supabase && userId) {
    await supabase.from("repeat_group_plans").upsert({
      created_at: nextPlan.createdAt,
      created_by_name: nextPlan.createdByName,
      group_id: nextPlan.groupId,
      id: nextPlan.id,
      title: nextPlan.title,
      user_id: userId,
      when_text: nextPlan.when,
      where_text: nextPlan.where,
    });
  }

  if (canUseStorage()) {
    const existing = fromStorage(window.localStorage.getItem(STORAGE_KEY));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([nextPlan, ...existing]));
  }

  return nextPlan;
}
