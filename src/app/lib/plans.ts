export type SavedPlan = {
  createdAt: string;
  description: string;
  id: string;
  picturePreview: string;
  title: string;
  when: string;
  where: string;
};

const STORAGE_KEY = "node.savedPlans";

export function loadSavedPlans(): SavedPlan[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawPlans = window.localStorage.getItem(STORAGE_KEY);
    if (!rawPlans) {
      return [];
    }

    const parsedPlans = JSON.parse(rawPlans) as SavedPlan[];
    return Array.isArray(parsedPlans) ? parsedPlans : [];
  } catch {
    return [];
  }
}

export function savePlan(plan: SavedPlan): SavedPlan[] {
  const nextPlans = [plan, ...loadSavedPlans()];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPlans));
  return nextPlans;
}
