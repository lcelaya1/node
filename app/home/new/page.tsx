"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useCollections,
  ItemType,
  CollectionItem,
  LocationData,
  DateTimeData,
  NoteData,
  PriceData,
  ImageData,
  TasksData,
} from "@/context/CollectionsContext";
import BottomSheet from "@/components/BottomSheet";
import ItemTypeGrid from "@/components/ItemTypeGrid";
import LocationItem from "@/components/items/LocationItem";
import DateTimeItem from "@/components/items/DateTimeItem";
import NoteItem from "@/components/items/NoteItem";
import PriceItem from "@/components/items/PriceItem";
import ImageItem from "@/components/items/ImageItem";
import TasksItem from "@/components/items/TasksItem";

const DEFAULT_DATA: Record<ItemType, object> = {
  location: { address: "" } as LocationData,
  datetime: { date: "", time: "" } as DateTimeData,
  note: { text: "" } as NoteData,
  price: { amount: "", currency: "$", description: "" } as PriceData,
  image: { url: "", caption: "" } as ImageData,
  tasks: { items: [] } as TasksData,
};

const ITEM_LABELS: Record<ItemType, string> = {
  location: "Direction",
  datetime: "Date & Time",
  note: "Note",
  price: "Estimated Price",
  image: "Photo",
  tasks: "Tasks",
};

function ItemForm({
  item,
  onChange,
}: {
  item: CollectionItem;
  onChange: (data: object) => void;
}) {
  switch (item.type) {
    case "location":
      return (
        <LocationItem
          data={item.data as LocationData}
          onChange={onChange}
        />
      );
    case "datetime":
      return (
        <DateTimeItem
          data={item.data as DateTimeData}
          onChange={onChange}
        />
      );
    case "note":
      return (
        <NoteItem
          data={item.data as NoteData}
          onChange={onChange}
        />
      );
    case "price":
      return (
        <PriceItem
          data={item.data as PriceData}
          onChange={onChange}
        />
      );
    case "image":
      return (
        <ImageItem
          data={item.data as ImageData}
          onChange={onChange}
        />
      );
    case "tasks":
      return (
        <TasksItem
          data={item.data as TasksData}
          onChange={onChange}
        />
      );
  }
}

export default function NewCollectionPage() {
  const router = useRouter();
  const { addCollection } = useCollections();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const addItem = (type: ItemType) => {
    const newItem: CollectionItem = {
      id: crypto.randomUUID(),
      type,
      data: DEFAULT_DATA[type] as CollectionItem["data"],
    };
    setItems((prev) => [...prev, newItem]);
    setExpandedItemId(newItem.id);
    setShowAddSheet(false);
  };

  const updateItem = (id: string, data: object) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, data: data as CollectionItem["data"] } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (expandedItemId === id) setExpandedItemId(null);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    addCollection({ title: title.trim(), description: description.trim(), items });
    router.push("/home");
  };

  const usedTypes = items.map((i) => i.type);

  return (
    <div className="form-gradient min-h-[100svh] flex flex-col">
      {/* Close button */}
      <div className="flex justify-end px-5 pt-12 pb-2">
        <button
          onClick={() => router.push("/home")}
          className="w-10 h-10 rounded-full bg-gray-200/80 flex items-center justify-center active:scale-90 transition-transform"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 2L12 12M12 2L2 12"
              stroke="#6b7280"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Title & Description */}
      <div className="px-5 pb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a Title..."
          className="w-full text-4xl font-black text-black placeholder:text-gray-300 bg-transparent outline-none leading-tight mb-2"
          autoFocus
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a Description..."
          className="w-full text-base text-gray-500 placeholder:text-gray-300 bg-transparent outline-none"
        />
      </div>

      {/* Item slots */}
      <div className="flex-1 px-5 pb-4 flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.id}>
            {/* Collapsed slot header */}
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                border: "2px dashed #d1d5db",
                backgroundColor: "#f9fafb",
              }}
            >
              {/* Top bar - always visible */}
              <button
                className="w-full flex items-center justify-between px-5 py-4"
                onClick={() =>
                  setExpandedItemId(
                    expandedItemId === item.id ? null : item.id
                  )
                }
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">
                    {
                      {
                        location: "📍",
                        datetime: "📅",
                        note: "📝",
                        price: "💰",
                        image: "🖼️",
                        tasks: "✅",
                      }[item.type]
                    }
                  </span>
                  <span className="font-semibold text-black">
                    {ITEM_LABELS[item.type]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    style={{
                      transform:
                        expandedItemId === item.id
                          ? "rotate(180deg)"
                          : "rotate(0)",
                      transition: "transform 0.2s",
                    }}
                  >
                    <path
                      d="M3 6L8 11L13 6"
                      stroke="#9ca3af"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.id);
                    }}
                    className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center"
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                    >
                      <path
                        d="M2 2L8 8M8 2L2 8"
                        stroke="#6b7280"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </button>

              {/* Expanded form */}
              {expandedItemId === item.id && (
                <div className="px-5 pb-5 border-t border-gray-200">
                  <div className="pt-4">
                    <ItemForm
                      item={item}
                      onChange={(data) => updateItem(item.id, data)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Add new slot */}
        <button
          onClick={() => setShowAddSheet(true)}
          className="w-full rounded-3xl py-8 flex flex-col items-center gap-2 active:scale-[0.98] transition-transform"
          style={{
            border: "2px dashed #d1d5db",
            backgroundColor: "#f9fafb",
          }}
        >
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 2V14M2 8H14"
                stroke="#6b7280"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-400">Add to collection</p>
        </button>
      </div>

      {/* Done button */}
      <div className="sticky bottom-0 px-5 pb-10 pt-4 bg-gradient-to-t from-white/80 to-transparent">
        <button
          onClick={handleSave}
          disabled={!title.trim()}
          className="w-full bg-[#3B82F6] text-white py-4 rounded-full text-lg font-semibold disabled:opacity-40 active:scale-[0.98] transition-all shadow-sm"
        >
          Done
        </button>
      </div>

      {/* Add Item Bottom Sheet */}
      <BottomSheet
        open={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        title="Add to Collection"
      >
        <ItemTypeGrid
          onSelect={addItem}
          disabledTypes={usedTypes}
        />
        <div className="h-4" />
      </BottomSheet>
    </div>
  );
}
