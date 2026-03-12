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
import DateTimeModal from "@/components/modals/DateTimeModal";
import NoteModal from "@/components/modals/NoteModal";
import LocationModal from "@/components/modals/LocationModal";
import ImageModal from "@/components/modals/ImageModal";
import PriceModal from "@/components/modals/PriceModal";
import TasksModal from "@/components/modals/TasksModal";

// ─── Slot definitions — 68×68px icons ────────────────────────────────────────
const SLOTS = [
  {
    type: "datetime" as const,
    prompt: "When are you Meeting?",
    emptyIcon: (
      <div style={{
        width: 68, height: 72, borderRadius: 14, overflow: "hidden",
        boxShadow: "0 3px 14px rgba(0,0,0,0.13)",
        display: "flex", flexDirection: "column", background: "white",
      }}>
        <div style={{
          background: "#f43f3f", height: 21,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 9, fontWeight: 700, color: "white", letterSpacing: 1,
        }}>MAY</div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "relative", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", inset: 0, border: "2.5px solid #f43f3f", borderRadius: "50%" }} />
            <span style={{ fontSize: 26, fontWeight: 800, color: "#1c1c1e", letterSpacing: -1, fontFamily: "-apple-system" }}>20</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    type: "location" as const,
    prompt: "Where are you Meeting?",
    emptyIcon: (
      <div style={{
        width: 68, height: 68, borderRadius: 14, overflow: "hidden",
        boxShadow: "0 3px 14px rgba(0,0,0,0.13)",
        background: "linear-gradient(135deg, #5bc4a8 0%, #7ecfba 30%, #9dd6b5 50%, #c5e8c0 70%, #a8d9b0 100%)",
        display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
      }}>
        <div style={{
          position: "absolute", top: 8, left: 6, width: 28, height: 20,
          background: "rgba(100,175,120,0.45)", borderRadius: 5, transform: "rotate(-12deg)",
        }} />
        <div style={{
          width: 24, height: 24, background: "#ff9500",
          borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)", position: "relative", zIndex: 2, marginBottom: 6,
        }}>
          <span style={{ transform: "rotate(45deg)", fontSize: 11, color: "white" }}>★</span>
        </div>
      </div>
    ),
  },
  {
    type: "note" as const,
    prompt: "Add a Description",
    emptyIcon: (
      <div style={{
        width: 68, height: 68, borderRadius: 14, overflow: "hidden",
        boxShadow: "0 3px 14px rgba(0,0,0,0.13)",
        background: "#ffd54f", padding: "8px 9px",
        display: "flex", flexDirection: "column", alignItems: "flex-start",
      }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: "#3a3000", marginBottom: 5 }}>Notes</div>
        {[100, 100, 70, 100, 55, 100].map((w, i) => (
          <div key={i} style={{ height: 3.5, background: "rgba(80,60,0,0.18)", borderRadius: 2, width: `${w}%`, marginBottom: i < 5 ? 3.5 : 0 }} />
        ))}
      </div>
    ),
  },
  {
    type: "price" as const,
    prompt: "Estimated Cost?",
    emptyIcon: (
      <div style={{
        width: 68, height: 68, borderRadius: 14, overflow: "hidden",
        boxShadow: "0 3px 14px rgba(0,0,0,0.13)",
        background: "#f0fdf4", border: "1px solid #bbf7d0",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32,
      }}>💰</div>
    ),
  },
  {
    type: "image" as const,
    prompt: "Add a Photo",
    emptyIcon: (
      <div style={{
        width: 68, height: 68, borderRadius: 14, overflow: "hidden",
        boxShadow: "0 3px 14px rgba(0,0,0,0.13)", position: "relative",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 40, background: "linear-gradient(180deg, #87ceeb 0%, #b0ddf0 100%)" }} />
        <div style={{ position: "absolute", top: 8, right: 12, width: 12, height: 12, background: "#ffd700", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "18px solid transparent", borderRight: "18px solid transparent", borderBottom: "20px solid #8a8a9a" }} />
        <div style={{ position: "absolute", bottom: 0, left: -10, right: -10, height: 32, background: "#5a9a5a", borderRadius: "50% 50% 0 0" }} />
        <div style={{ position: "absolute", bottom: 5, right: 5, width: 16, height: 12, background: "rgba(255,255,255,0.7)", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5 }}>
          <div style={{ width: 6, height: 6, background: "rgba(80,80,80,0.5)", borderRadius: "50%" }} />
        </div>
      </div>
    ),
  },
  {
    type: "tasks" as const,
    prompt: "Who Brings What?",
    emptyIcon: (
      <div style={{
        width: 68, height: 68, borderRadius: 14, overflow: "hidden",
        boxShadow: "0 3px 14px rgba(0,0,0,0.13)",
        background: "white", border: "1px solid #e5e5ea",
        padding: "10px 10px",
        display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center",
      }}>
        {[false, true, false, false].map((checked, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, width: "100%", marginBottom: i < 3 ? 6 : 0 }}>
            <div style={{
              width: 12, height: 12, borderRadius: "50%", flexShrink: 0,
              backgroundColor: checked ? "#007AFF" : "transparent",
              border: checked ? "none" : "1.5px solid #c7c7cc",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {checked && (
                <svg width="7" height="6" viewBox="0 0 7 6" fill="none">
                  <path d="M1 3L2.5 4.5L6 1" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <div style={{ height: 2, flex: 1, background: "#e5e5ea", borderRadius: 1 }} />
          </div>
        ))}
      </div>
    ),
  },
];

const INITIAL_DATA: Record<string, object> = {
  datetime: { date: "", time: "" },
  location: { address: "" },
  note: { text: "" },
  price: { amount: "", currency: "€", description: "" },
  image: { url: "", caption: "" },
  tasks: { items: [] },
};

export default function NewCollectionPage() {
  const router = useRouter();
  const { addCollection } = useCollections();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [itemData, setItemData] = useState<Record<string, object>>(
    Object.fromEntries(SLOTS.map((s) => [s.type, INITIAL_DATA[s.type]]))
  );

  const updateData = (type: string, data: object) => {
    setItemData((prev) => ({ ...prev, [type]: data }));
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const items: CollectionItem[] = SLOTS.map((slot) => ({
      id: crypto.randomUUID(),
      type: slot.type,
      data: itemData[slot.type] as CollectionItem["data"],
    }));
    addCollection({ title: title.trim(), description: description.trim(), items });
    router.push("/home");
  };

  const isFilled = (type: string): boolean => {
    const data = itemData[type];
    if (type === "datetime") return !!(data as DateTimeData).date;
    if (type === "location") return !!(data as LocationData).address;
    if (type === "note")     return !!(data as NoteData).text;
    if (type === "price")    return !!(data as PriceData).amount;
    if (type === "image")    return !!(data as ImageData).url;
    if (type === "tasks")    return ((data as TasksData).items?.length ?? 0) > 0;
    return false;
  };

  return (
    <>
      <div
        className="min-h-[100svh] flex flex-col"
        style={{
          background: "linear-gradient(170deg, #d9eef5 0%, #e4f0ec 20%, #ecf4ef 40%, #eef5ee 60%, #eaf2ec 80%, #e5eee9 100%)",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Blobs */}
        <div style={{ position: "absolute", top: -60, right: -40, width: 220, height: 240, background: "radial-gradient(ellipse, rgba(140,210,185,0.45) 0%, transparent 68%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", top: 200, right: -20, width: 180, height: 220, background: "radial-gradient(ellipse, rgba(155,215,190,0.3) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", top: 500, right: 10, width: 150, height: 180, background: "radial-gradient(ellipse, rgba(170,218,195,0.25) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

        {/* Close button */}
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "48px 20px 0", position: "relative", zIndex: 10 }}>
          <button
            onClick={() => router.push("/home")}
            style={{
              width: 34, height: 34, borderRadius: "50%", border: "none", cursor: "pointer",
              background: "rgba(205,212,208,0.78)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, color: "#636366",
            }}
          >✕</button>
        </div>

        {/* Title & Description */}
        <div style={{ padding: "0 24px", position: "relative", zIndex: 5 }}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a Title..."
            autoFocus
            style={{
              fontSize: 34, fontWeight: 700,
              color: title ? "#1c1c1e" : "#c5cac8",
              letterSpacing: "-0.8px", lineHeight: 1.15,
              marginTop: 20, marginBottom: 8,
              background: "none", border: "none", outline: "none", width: "100%",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
              caretColor: "#007aff",
            }}
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a Description..."
            style={{
              fontSize: 16, color: description ? "#3c3c43" : "#b8bebb",
              marginBottom: 28,
              background: "none", border: "none", outline: "none", width: "100%",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
              caretColor: "#007aff",
            }}
          />
        </div>

        {/* Alternating card slots — tap whole card to open modal */}
        <div style={{ flex: 1, overflowY: "auto", position: "relative", zIndex: 5 }}>
          <div style={{ display: "flex", flexDirection: "column", padding: "0 16px 130px" }}>
            {SLOTS.map((slot, index) => {
              const isLeft = index % 2 === 0;
              const isLast = index === SLOTS.length - 1;
              const filled = isFilled(slot.type);

              return (
                <div
                  key={slot.type}
                  style={{
                    width: "79%",
                    alignSelf: isLeft ? "flex-start" : "flex-end",
                    marginBottom: isLast ? 0 : -36,
                    zIndex: SLOTS.length - index,
                    position: "relative",
                  }}
                >
                  <button
                    onClick={() => setOpenModal(slot.type)}
                    style={{
                      width: "100%",
                      background: filled ? "rgba(210,230,218,0.72)" : "rgba(226,232,228,0.62)",
                      border: `2px ${filled ? "solid" : "dashed"} ${filled ? "#a8d4b8" : "#bdc8c3"}`,
                      borderRadius: 24,
                      minHeight: 210,
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "flex-end",
                      padding: "20px 20px 24px",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "transform 0.15s, box-shadow 0.15s",
                    }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
                    onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    onTouchStart={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
                    onTouchEnd={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    {slot.emptyIcon}
                    <span style={{
                      fontSize: 15,
                      fontWeight: filled ? 600 : 400,
                      color: filled ? "#2c6e49" : "#9aa09c",
                      textAlign: "center", letterSpacing: "-0.2px",
                      marginTop: 12,
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                    }}>
                      {filled && <span style={{ color: "#34c759" }}>✓ </span>}
                      {slot.prompt}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Done button */}
        <div style={{
          position: "fixed", bottom: 30, left: "50%", transform: "translateX(-50%)",
          width: "calc(100% - 48px)", maxWidth: 342, zIndex: 100,
        }}>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            style={{
              width: "100%", padding: 17,
              background: "#1a8ef5", border: "none", borderRadius: 50,
              fontSize: 17, fontWeight: 700, color: "white", letterSpacing: "-0.2px",
              cursor: title.trim() ? "pointer" : "not-allowed",
              boxShadow: title.trim() ? "0 6px 22px rgba(26,142,245,0.4)" : "none",
              opacity: title.trim() ? 1 : 0.4,
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
              transition: "opacity 0.2s, box-shadow 0.2s",
            }}
          >
            Template Done
          </button>
        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <DateTimeModal
        open={openModal === "datetime"}
        data={itemData.datetime as DateTimeData}
        onClose={() => setOpenModal(null)}
        onSave={(d) => updateData("datetime", d)}
      />
      <NoteModal
        open={openModal === "note"}
        data={itemData.note as NoteData}
        onClose={() => setOpenModal(null)}
        onSave={(d) => updateData("note", d)}
      />
      <LocationModal
        open={openModal === "location"}
        data={itemData.location as LocationData}
        onClose={() => setOpenModal(null)}
        onSave={(d) => updateData("location", d)}
      />
      <ImageModal
        open={openModal === "image"}
        data={itemData.image as ImageData}
        onClose={() => setOpenModal(null)}
        onSave={(d) => updateData("image", d)}
      />
      <PriceModal
        open={openModal === "price"}
        data={itemData.price as PriceData}
        onClose={() => setOpenModal(null)}
        onSave={(d) => updateData("price", d)}
      />
      <TasksModal
        open={openModal === "tasks"}
        data={itemData.tasks as TasksData}
        onClose={() => setOpenModal(null)}
        onSave={(d) => updateData("tasks", d)}
      />
    </>
  );
}
