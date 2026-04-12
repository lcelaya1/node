import type { DemoUser } from "./demoUsers";
import { supabase } from "./supabase";

export type SavedPlan = {
  budget?: string;
  completedAt?: string;
  creator?: DemoUser | null;
  createdAt: string;
  description: string;
  id: string;
  participants?: DemoUser[];
  picturePreview: string;
  source?: "created" | "joined";
  title: string;
  userId?: string;
  whenDate?: string;
  whenTime?: string;
  when: string;
  where: string;
  storageKey?: string;
};

type JoinablePlan = {
  budget?: string;
  creator?: DemoUser | null;
  date?: string;
  description?: string;
  id: number | string;
  location?: string;
  participants?: DemoUser[];
  title: string;
  when?: string;
  whenDate?: string;
  whenTime?: string;
  where?: string;
};

const DATABASE_NAME = "node-app";
const DATABASE_VERSION = 2;
const STORE_NAME = "plans";

async function getCurrentPlansUserId(): Promise<string> {
  if (!supabase) return "guest";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? "guest";
}

function buildStorageKey(userId: string, planId: string): string {
  return `${userId}:${planId}`;
}

function openPlansDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      reject(new Error("IndexedDB is not available."));
      return;
    }

    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (database.objectStoreNames.contains(STORE_NAME)) {
        database.deleteObjectStore(STORE_NAME);
      }

      const store = database.createObjectStore(STORE_NAME, { keyPath: "storageKey" });
      store.createIndex("createdAt", "createdAt");
      store.createIndex("userId", "userId");
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open plans database."));
  });
}

export async function loadSavedPlans(): Promise<SavedPlan[]> {
  const userId = await getCurrentPlansUserId();
  const database = await openPlansDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const plans = (request.result as SavedPlan[]) ?? [];
      resolve(
        plans
          .filter((plan) => plan.userId === userId)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      );
    };

    request.onerror = () => {
      reject(request.error ?? new Error("Could not load saved plans."));
    };

    transaction.oncomplete = () => database.close();
    transaction.onerror = () => reject(transaction.error ?? new Error("Could not load saved plans."));
  });
}

export async function loadSavedPlan(planId: string): Promise<SavedPlan | null> {
  const userId = await getCurrentPlansUserId();
  const database = await openPlansDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(buildStorageKey(userId, planId));

    request.onsuccess = () => {
      resolve((request.result as SavedPlan | undefined) ?? null);
    };

    request.onerror = () => {
      reject(request.error ?? new Error("Could not load saved plan."));
    };

    transaction.oncomplete = () => database.close();
    transaction.onerror = () => reject(transaction.error ?? new Error("Could not load saved plan."));
  });
}

export async function savePlan(plan: SavedPlan): Promise<SavedPlan[]> {
  const userId = await getCurrentPlansUserId();
  const database = await openPlansDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    store.put({
      ...plan,
      storageKey: buildStorageKey(userId, plan.id),
      userId,
    });

    transaction.oncomplete = async () => {
      database.close();

      try {
        resolve(await loadSavedPlans());
      } catch (error) {
        reject(error);
      }
    };

    transaction.onerror = () => reject(transaction.error ?? new Error("Could not save plan."));
  });
}

export function toSavedPlan(plan: JoinablePlan, imageSrc?: string): SavedPlan {
  return {
    budget: plan.budget,
    creator: plan.creator ?? null,
    createdAt: new Date().toISOString(),
    description: plan.description ?? "Joined from the discover flow.",
    id: String(plan.id),
    participants: plan.participants ?? [],
    picturePreview: imageSrc ?? "",
    source: "joined",
    title: plan.title,
    when: plan.when ?? plan.date ?? "May 12 · 6pm",
    whenDate: plan.whenDate,
    whenTime: plan.whenTime,
    where: plan.where ?? plan.location ?? "Location (1.2km)",
  };
}

export async function deletePlan(planId: string): Promise<void> {
  const userId = await getCurrentPlansUserId();
  const database = await openPlansDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    store.delete(buildStorageKey(userId, planId));

    transaction.oncomplete = () => {
      database.close();
      resolve();
    };

    transaction.onerror = () => reject(transaction.error ?? new Error("Could not delete plan."));
  });
}

export async function markPlanCompleted(planId: string): Promise<SavedPlan[]> {
  const userId = await getCurrentPlansUserId();
  const database = await openPlansDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const key = buildStorageKey(userId, planId);
    const request = store.get(key);

    request.onsuccess = () => {
      const existingPlan = (request.result as SavedPlan | undefined) ?? null;
      if (!existingPlan) return;

      store.put({
        ...existingPlan,
        completedAt: new Date().toISOString(),
      });
    };

    request.onerror = () => {
      reject(request.error ?? new Error("Could not load plan to complete."));
    };

    transaction.oncomplete = async () => {
      database.close();

      try {
        resolve(await loadSavedPlans());
      } catch (error) {
        reject(error);
      }
    };

    transaction.onerror = () =>
      reject(transaction.error ?? new Error("Could not mark plan as completed."));
  });
}
