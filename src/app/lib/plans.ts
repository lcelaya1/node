export type SavedPlan = {
  createdAt: string;
  description: string;
  id: string;
  picturePreview: string;
  title: string;
  when: string;
  where: string;
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
