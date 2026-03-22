import type { DemoUser } from "./demoUsers";

export type SavedPlan = {
  budget?: string;
  creator?: DemoUser | null;
  createdAt: string;
  description: string;
  id: string;
  participants?: DemoUser[];
  picturePreview: string;
  source?: "created" | "joined";
  title: string;
  whenDate?: string;
  whenTime?: string;
  when: string;
  where: string;
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
const DATABASE_VERSION = 1;
const STORE_NAME = "plans";

function openPlansDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      reject(new Error("IndexedDB is not available."));
      return;
    }

    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("createdAt", "createdAt");
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open plans database."));
  });
}

export async function loadSavedPlans(): Promise<SavedPlan[]> {
  const database = await openPlansDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const plans = (request.result as SavedPlan[]) ?? [];
      resolve(plans.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    };

    request.onerror = () => {
      reject(request.error ?? new Error("Could not load saved plans."));
    };

    transaction.oncomplete = () => database.close();
    transaction.onerror = () => reject(transaction.error ?? new Error("Could not load saved plans."));
  });
}

export async function loadSavedPlan(planId: string): Promise<SavedPlan | null> {
  const database = await openPlansDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(planId);

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
  const database = await openPlansDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    store.put(plan);

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
  const database = await openPlansDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    store.delete(planId);

    transaction.oncomplete = () => {
      database.close();
      resolve();
    };

    transaction.onerror = () => reject(transaction.error ?? new Error("Could not delete plan."));
  });
}
