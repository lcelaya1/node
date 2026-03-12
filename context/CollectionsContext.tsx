"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type ItemType =
  | "location"
  | "datetime"
  | "note"
  | "price"
  | "image"
  | "tasks";

export type LocationData = {
  address: string;
  lat?: number;
  lng?: number;
};

export type DateTimeData = {
  date: string;
  time: string;
};

export type NoteData = {
  text: string;
};

export type PriceData = {
  amount: string;
  currency: string;
  description: string;
};

export type ImageData = {
  url: string;
  caption: string;
};

export type TasksData = {
  items: { id: string; text: string; done: boolean }[];
};

export type ItemData =
  | LocationData
  | DateTimeData
  | NoteData
  | PriceData
  | ImageData
  | TasksData;

export type CollectionItem = {
  id: string;
  type: ItemType;
  data: ItemData;
};

export type Collection = {
  id: string;
  title: string;
  description: string;
  items: CollectionItem[];
  createdAt: string;
};

type CollectionsContextType = {
  collections: Collection[];
  addCollection: (collection: Omit<Collection, "id" | "createdAt">) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
};

const CollectionsContext = createContext<CollectionsContextType | null>(null);

export function CollectionsProvider({ children }: { children: ReactNode }) {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("canopi_collections");
    if (stored) {
      try {
        setCollections(JSON.parse(stored));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("canopi_collections", JSON.stringify(collections));
  }, [collections]);

  const addCollection = (collection: Omit<Collection, "id" | "createdAt">) => {
    const newCollection: Collection = {
      ...collection,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setCollections((prev) => [newCollection, ...prev]);
  };

  const updateCollection = (id: string, updates: Partial<Collection>) => {
    setCollections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCollection = (id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <CollectionsContext.Provider
      value={{ collections, addCollection, updateCollection, deleteCollection }}
    >
      {children}
    </CollectionsContext.Provider>
  );
}

export function useCollections() {
  const ctx = useContext(CollectionsContext);
  if (!ctx)
    throw new Error("useCollections must be used within CollectionsProvider");
  return ctx;
}
