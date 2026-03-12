"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useCollections,
  CollectionItem,
  LocationData,
  DateTimeData,
  NoteData,
  PriceData,
  ImageData,
  TasksData,
} from "@/context/CollectionsContext";
import LocationItem from "@/components/items/LocationItem";
import DateTimeItem from "@/components/items/DateTimeItem";
import NoteItem from "@/components/items/NoteItem";
import PriceItem from "@/components/items/PriceItem";
import ImageItem from "@/components/items/ImageItem";
import TasksItem from "@/components/items/TasksItem";

// ─── Slot definitions — all 6 are mandatory and pre-shown ───────────────────
const SLOTS = [
  {
    type: "datetime" as const,
    prompt: "When are you Meeting?",
    emptyIcon: (
      // Apple Calendar mini icon
      <div
        className="flex flex-col items-center rounded-2xl overflow-hidden shadow-sm"
        style={{ width: 52, height: 52, border: "1px solid #e5e5ea" }}
      >
        <div
          className="w-full flex items-center justify-center"
          style={{ backgroundColor: "#FF3B30", height: 16 }}
        >
          <span style={{ fontSize: 8, fontWeight: 700, color: "white", fontFamily: "-apple-system" }}>
            MAY
          </span>
        </div>
        <div
          className="flex-1 bg-white w-full flex items-center justify-center relative"
        >
          <span
            style={{
              fontSize: 24,
              fontWeight: 900,
              color: "#1c1c1e",
              fontFamily: "-apple-system, 'SF Pro Display'",
              lineHeight: 1,
            }}
          >
            20
          </span>
          <div
            className="absolute inset-1 rounded-full border-2"
            style={{ borderColor: "#FF3B30" }}
          />
        </div>
      </div>
    ),
  },
  {
    type: "location" as const,
    prompt: "Where are you Meeting?",
    emptyIcon: (
      // Apple Maps mini icon
      <div
        className="flex items-center justify-center rounded-[14px] overflow-hidden shadow-sm"
        style={{ width: 52, height: 52 }}
      >
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          <rect width="52" height="52" fill="#C5E8A8" />
          <rect x="0" y="22" width="52" height="8" fill="#FFFFFF" />
          <rect x="22" y="0" width="8" height="52" fill="#FFFFFF" />
          <circle cx="26" cy="26" r="8" fill="#FF375F" />
          <circle cx="26" cy="26" r="8" fill="none" stroke="rgba(255,55,95,0.3)" strokeWidth="4" />
          <circle cx="26" cy="26" r="3.5" fill="white" />
          <circle cx="38" cy="14" r="6" fill="#FF375F" />
          <path d="M35.5 11.5L36.3 13.5H38.4L36.8 14.7L37.3 16.8L35.5 15.5L33.7 16.8L34.2 14.7L32.6 13.5H34.7L35.5 11.5Z" fill="white" />
        </svg>
      </div>
    ),
  },
  {
    type: "note" as const,
    prompt: "Add a Description",
    emptyIcon: (
      // Apple Notes mini icon
      <div
        className="flex flex-col rounded-2xl overflow-hidden shadow-sm p-2.5"
        style={{ width: 52, height: 52, backgroundColor: "#FFD60A" }}
      >
        <div style={{ height: 2, backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 1, marginBottom: 3 }} />
        <div style={{ height: 2, backgroundColor: "rgba(0,0,0,0.15)", borderRadius: 1, marginBottom: 3 }} />
        <div style={{ height: 2, backgroundColor: "rgba(0,0,0,0.1)", borderRadius: 1, width: "70%" }} />
      </div>
    ),
  },
  {
    type: "price" as const,
    prompt: "Estimated Cost?",
    emptyIcon: (
      <div
        className="flex items-center justify-center rounded-2xl shadow-sm"
        style={{ width: 52, height: 52, backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0" }}
      >
        <span style={{ fontSize: 26 }}>💰</span>
      </div>
    ),
  },
  {
    type: "image" as const,
    prompt: "Add a Photo",
    emptyIcon: (
      <div
        className="flex items-center justify-center rounded-2xl overflow-hidden shadow-sm"
        style={{ width: 52, height: 52, background: "linear-gradient(135deg, #0ea5e9, #06b6d4)" }}
      >
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <rect x="2" y="5" width="22" height="16" rx="3" stroke="white" strokeWidth="1.8" />
          <circle cx="9" cy="11" r="2.5" stroke="white" strokeWidth="1.5" />
          <path d="M2 18L8 13L12 16L16 12L24 18" stroke="white" strokeWidth="1.5" />
        </svg>
      </div>
    ),
  },
  {
    type: "tasks" as const,
    prompt: "Who Brings What?",
    emptyIcon: (
      <div
        className="flex flex-col items-start justify-center rounded-2xl shadow-sm p-2"
        style={{ width: 52, height: 52, backgroundColor: "white", border: "1px solid #e5e5ea" }}
      >
        {[false, true, false].map((checked, i) => (
          <div key={i} className="flex items-center gap-1 w-full mb-1">
            <div
              className="flex-shrink-0 flex items-center justify-center rounded-sm"
              style={{
                width: 10, height: 10,
                border: `1.5px solid ${checked ? "#007AFF" : "#c7c7cc"}`,
                backgroundColor: checked ? "#007AFF" : "transparent",
              }}
            >
              {checked && (
                <svg width="6" height="5" viewBox="0 0 6 5" fill="none">
                  <path d="M0.5 2.5L2 4L5.5 1" stroke="white" strokeWidth="1" strokeLinecap="round" />
                </svg>
              )}
            </div>
            <div style={{ height: 1.5, flex: 1, backgroundColor: "#e5e5ea", borderRadius: 1 }} />
          </div>
        ))}
      </div>
    ),
  },
];

function ItemFormSwitch({ item, onChange }: { item: CollectionItem; onChange: (data: object) => void }) {
  switch (item.type) {
    case "datetime":
      return <DateTimeItem data={item.data as DateTimeData} onChange={onChange} />;
    case "location":
      return <LocationItem data={item.data as LocationData} onChange={onChange} />;
    case "note":
      return <NoteItem data={item.data as NoteData} onChange={onChange} />;
    case "price":
      return <PriceItem data={item.data as PriceData} onChange={onChange} />;
    case "image":
      return <ImageItem data={item.data as ImageData} onChange={onChange} />;
    case "tasks":
      return <TasksItem data={item.data as TasksData} onChange={onChange} />;
  }
}

const INITIAL_DATA: Record<string, object> = {
  datetime: { date: "", time: "" },
  location: { address: "" },
  note: { text: "" },
  price: { amount: "", currency: "$", description: "" },
  image: { url: "", caption: "" },
  tasks: { items: [] },
};

export default function NewCollectionPage() {
  const router = useRouter();
  const { addCollection } = useCollections();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expandedType, setExpandedType] = useState<string | null>(null);
  const [itemData, setItemData] = useState<Record<string, object>>(
    Object.fromEntries(SLOTS.map((s) => [s.type, INITIAL_DATA[s.type]]))
  );

  const updateData = (type: string, data: object) => {
    setItemData((prev) => ({ ...prev, [type]: data }));
  };

  const handleSave = () => {
    if (!title.trim()) return;

    // Build CollectionItem array — include all 6 mandatory items
    const items: CollectionItem[] = SLOTS.map((slot) => ({
      id: crypto.randomUUID(),
      type: slot.type,
      data: itemData[slot.type] as CollectionItem["data"],
    }));

    addCollection({ title: title.trim(), description: description.trim(), items });
    router.push("/home");
  };

  return (
    <div
      className="min-h-[100svh] flex flex-col"
      style={{
        background:
          "radial-gradient(ellipse 70% 50% at 5% 5%, rgba(150,220,195,0.45) 0%, transparent 55%), radial-gradient(ellipse 60% 45% at 95% 85%, rgba(145,210,230,0.4) 0%, transparent 55%), #f3faf7",
      }}
    >
      {/* Close button */}
      <div className="flex justify-end px-5 pt-12 pb-3">
        <button
          onClick={() => router.push("/home")}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(120,120,128,0.18)" }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path
              d="M1.5 1.5L11.5 11.5M11.5 1.5L1.5 11.5"
              stroke="#3c3c43"
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
          className="w-full bg-transparent outline-none leading-tight mb-2"
          style={{
            fontSize: 36,
            fontWeight: 900,
            fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
            color: title ? "#1c1c1e" : "#c7c7cc",
          }}
          autoFocus
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a Description..."
          className="w-full bg-transparent outline-none"
          style={{
            fontSize: 16,
            fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
            color: description ? "#3c3c43" : "#c7c7cc",
          }}
        />
      </div>

      {/* Mandatory item slots — all pre-shown, stacked like images 3 & 4 */}
      <div className="flex-1 overflow-y-auto pb-28">
        <div className="relative px-4">
          {SLOTS.map((slot, index) => {
            const isExpanded = expandedType === slot.type;
            const data = itemData[slot.type];
            // Detect if the slot has been filled
            const isFilled = (() => {
              if (slot.type === "datetime") return !!(data as DateTimeData).date;
              if (slot.type === "location") return !!(data as LocationData).address;
              if (slot.type === "note") return !!(data as NoteData).text;
              if (slot.type === "price") return !!(data as PriceData).amount;
              if (slot.type === "image") return !!(data as ImageData).url;
              if (slot.type === "tasks") return (data as TasksData).items?.length > 0;
              return false;
            })();

            return (
              <div
                key={slot.type}
                style={{
                  position: "relative",
                  marginTop: index === 0 ? 0 : -30,
                  zIndex: index + 1,
                }}
              >
                <div
                  className="rounded-[28px] overflow-hidden"
                  style={{
                    border: "2px dashed #d1d5db",
                    backgroundColor: "rgba(245,247,245,0.85)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {/* Slot header — always visible */}
                  <button
                    className="w-full flex items-center justify-between px-5 py-4"
                    onClick={() => setExpandedType(isExpanded ? null : slot.type)}
                  >
                    <div className="flex items-center gap-3">
                      {slot.emptyIcon}
                      <div className="text-left">
                        <p
                          className="font-semibold"
                          style={{
                            fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
                            fontSize: 15,
                            color: isFilled ? "#1c1c1e" : "#636366",
                          }}
                        >
                          {slot.prompt}
                        </p>
                        {isFilled && (
                          <p style={{ fontSize: 12, color: "#34c759", fontWeight: 600, fontFamily: "-apple-system" }}>
                            ✓ Filled
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Expand / collapse indicator */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(120,120,128,0.12)" }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        style={{
                          transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.25s",
                        }}
                      >
                        <path
                          d="M2.5 5L7 9.5L11.5 5"
                          stroke="#636366"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </button>

                  {/* Expanded form */}
                  {isExpanded && (
                    <div
                      className="px-5 pb-5"
                      style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
                    >
                      <div className="pt-4">
                        <ItemFormSwitch
                          item={{
                            id: slot.type,
                            type: slot.type,
                            data: data as CollectionItem["data"],
                          }}
                          onChange={(d) => updateData(slot.type, d)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div style={{ height: 16 }} />
        </div>
      </div>

      {/* Done button */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 pb-10 pt-4"
        style={{
          background: "linear-gradient(to top, rgba(243,250,247,0.97) 60%, transparent 100%)",
        }}
      >
        <button
          onClick={handleSave}
          disabled={!title.trim()}
          className="w-full py-4 rounded-full text-lg font-semibold disabled:opacity-40 active:scale-[0.98] transition-all shadow-sm"
          style={{
            backgroundColor: "#3B82F6",
            color: "white",
            fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}
