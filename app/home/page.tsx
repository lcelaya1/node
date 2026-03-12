"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCollections, Collection, CollectionItem } from "@/context/CollectionsContext";

function getDateLabel(dateStr: string): string {
  const event = new Date(dateStr + "T12:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  event.setHours(0, 0, 0, 0);

  if (event.getTime() === today.getTime()) return "Today";
  if (event.getTime() === tomorrow.getTime()) return "Tomorrow";
  if (event < nextWeek) return event.toLocaleDateString("en-GB", { weekday: "long" });
  return event.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function MiniCalendarThumbnail({ data }: { data: Record<string, unknown> }) {
  const date = data.date ? new Date((data.date as string) + "T12:00:00") : null;
  const day = date ? date.getDate() : "--";
  const month = date ? date.toLocaleDateString("en-GB", { month: "short" }).toUpperCase() : "";
  const weekday = date ? date.toLocaleDateString("en-GB", { weekday: "short" }) : "";
  const time = (data.time as string) || "";
  const h = time ? parseInt(time.split(":")[0]) : null;
  const fmtHour = (n: number) => `${String(n).padStart(2, "0")}:00`;

  return (
    <div className="bg-white rounded-[18px] overflow-hidden flex-shrink-0 shadow-sm" style={{ width: 110, height: 120 }}>
      <div className="px-2.5 pt-2 pb-1">
        <div className="flex items-center gap-1.5">
          <span style={{ color: "#FF3B30", fontSize: 9, fontWeight: 700 }}>{month}</span>
          <span style={{ color: "#8e8e93", fontSize: 9 }}>{weekday}</span>
        </div>
        <p style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.05, color: "#000", fontFamily: "-apple-system, sans-serif" }}>{day}</p>
      </div>
      <div className="px-2.5 flex flex-col gap-1">
        {h !== null && (
          <>
            <div className="flex items-center gap-1.5">
              <span style={{ fontSize: 8, color: "#8e8e93", width: 28 }}>{fmtHour(h - 1)}</span>
              <div style={{ height: 0.5, flex: 1, backgroundColor: "#e5e5ea" }} />
            </div>
            <div className="flex items-center gap-1.5">
              <span style={{ fontSize: 8, color: "#FF3B30", fontWeight: 600, width: 28 }}>{fmtHour(h)}</span>
              <div style={{ height: 1, flex: 1, backgroundColor: "#FF3B30" }} />
              <svg width="6" height="8" viewBox="0 0 6 8" fill="none" style={{ flexShrink: 0 }}>
                <path d="M1 1l4 3-4 3V1z" fill="#FF3B30" />
              </svg>
            </div>
            <div className="flex items-center gap-1.5">
              <span style={{ fontSize: 8, color: "#8e8e93", width: 28 }}>{fmtHour(h + 1)}</span>
              <div style={{ height: 0.5, flex: 1, backgroundColor: "#e5e5ea" }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MiniMapThumbnail() {
  return (
    <div className="rounded-[18px] overflow-hidden flex-shrink-0 shadow-sm" style={{ width: 110, height: 120 }}>
      <svg width="110" height="120" viewBox="0 0 110 120">
        <rect width="110" height="120" fill="#F2EDE3" />
        <rect x="0" y="47" width="110" height="8" fill="white" opacity="0.85" />
        <rect x="0" y="78" width="110" height="7" fill="white" opacity="0.85" />
        <rect x="36" y="0" width="9" height="120" fill="white" opacity="0.85" />
        <rect x="71" y="0" width="8" height="120" fill="white" opacity="0.85" />
        <rect x="0" y="0" width="34" height="45" fill="#E8E0D4" rx="3" />
        <rect x="47" y="0" width="22" height="45" fill="#E8E0D4" rx="3" />
        <rect x="81" y="0" width="29" height="45" fill="#C5E8A8" rx="3" />
        <rect x="0" y="57" width="34" height="19" fill="#E8E0D4" rx="3" />
        <rect x="47" y="57" width="22" height="19" fill="#F0D888" rx="3" />
        <rect x="81" y="57" width="29" height="19" fill="#E8E0D4" rx="3" />
        <rect x="0" y="87" width="34" height="33" fill="#E8E0D4" rx="3" />
        <rect x="47" y="87" width="22" height="33" fill="#E8E0D4" rx="3" />
        <rect x="81" y="87" width="29" height="33" fill="#C5E8A8" rx="3" />
        <circle cx="55" cy="62" r="9" fill="#FF375F" opacity="0.18" />
        <circle cx="55" cy="62" r="6" fill="#FF375F" />
        <circle cx="55" cy="62" r="2.5" fill="white" />
      </svg>
    </div>
  );
}

function MiniNoteThumbnail({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="rounded-[18px] overflow-hidden flex-shrink-0 p-2.5 shadow-sm" style={{ width: 110, height: 120, backgroundColor: "#FFD60A" }}>
      <p style={{ fontSize: 9, fontWeight: 800, color: "#000", marginBottom: 4, fontFamily: "-apple-system, sans-serif" }}>Description</p>
      <p style={{ fontSize: 8, color: "#3a3a3a", lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical" as const }}>
        {(data.text as string) || "No description"}
      </p>
    </div>
  );
}

function MiniPhotoThumbnail({ data }: { data: Record<string, unknown> }) {
  const src = (data.url as string) || (data.src as string);
  return (
    <div className="rounded-[18px] overflow-hidden flex-shrink-0 shadow-sm" style={{ width: 110, height: 120, backgroundColor: "#1c1c1e" }}>
      {src ? (
        <img src={src} alt="photo" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <svg width="26" height="22" viewBox="0 0 26 22" fill="none">
            <rect x="1" y="4" width="24" height="17" rx="3.5" stroke="#48484a" strokeWidth="1.5" />
            <circle cx="13" cy="13" r="4" stroke="#48484a" strokeWidth="1.5" />
            <path d="M9 4V3a2 2 0 012-2h4a2 2 0 012 2v1" stroke="#48484a" strokeWidth="1.5" />
          </svg>
        </div>
      )}
    </div>
  );
}

function MiniTasksThumbnail({ data }: { data: Record<string, unknown> }) {
  type Task = { id: string; text: string; done: boolean };
  const items: Task[] = (data.items as Task[]) || (data.tasks as Task[]) || [];
  return (
    <div className="bg-white rounded-[18px] overflow-hidden flex-shrink-0 p-2.5 shadow-sm" style={{ width: 110, height: 120 }}>
      <p style={{ fontSize: 9, fontWeight: 800, color: "#000", marginBottom: 5, fontFamily: "-apple-system, sans-serif" }}>Tasks</p>
      <div className="flex flex-col gap-1.5">
        {items.slice(0, 4).map((task) => (
          <div key={task.id} className="flex items-center gap-1.5">
            <div style={{
              width: 11, height: 11, borderRadius: "50%", flexShrink: 0,
              backgroundColor: task.done ? "#007AFF" : "transparent",
              border: task.done ? "none" : "1.5px solid #c7c7cc",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {task.done && (
                <svg width="6" height="5" viewBox="0 0 6 5" fill="none">
                  <path d="M1 2.5L2.3 4 5 1" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span style={{
              fontSize: 8, color: task.done ? "#8e8e93" : "#000",
              textDecoration: task.done ? "line-through" : "none",
              overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: 76,
            }}>
              {task.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniPriceThumbnail({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="bg-white rounded-[18px] overflow-hidden flex-shrink-0 p-2.5 shadow-sm" style={{ width: 110, height: 120 }}>
      <p style={{ fontSize: 9, fontWeight: 800, color: "#000", marginBottom: 10, fontFamily: "-apple-system, sans-serif" }}>Cost</p>
      <div className="flex items-baseline gap-0.5">
        <span style={{ fontSize: 13, color: "#8e8e93", fontWeight: 300 }}>{(data.currency as string) || "$"}</span>
        <span style={{ fontSize: 30, fontWeight: 900, lineHeight: 1, color: "#000", fontFamily: "-apple-system, 'SF Pro Display', sans-serif" }}>
          {(data.amount as string) || "—"}
        </span>
      </div>
      {data.description && (
        <p style={{ fontSize: 8, color: "#8e8e93", marginTop: 3 }}>{data.description as string}</p>
      )}
    </div>
  );
}

function MiniCardThumbnail({ item }: { item: CollectionItem }) {
  const data = item.data as Record<string, unknown>;
  switch (item.type) {
    case "datetime": return <MiniCalendarThumbnail data={data} />;
    case "location": return <MiniMapThumbnail />;
    case "note":     return <MiniNoteThumbnail data={data} />;
    case "image":    return <MiniPhotoThumbnail data={data} />;
    case "tasks":    return <MiniTasksThumbnail data={data} />;
    case "price":    return <MiniPriceThumbnail data={data} />;
    default:         return null;
  }
}

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6">
      <div className="relative w-32 h-28 flex items-center justify-center">
        <div className="absolute left-0 top-4 w-14 h-14 rounded-2xl overflow-hidden shadow-md" style={{ transform: "rotate(-8deg)" }}>
          <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center text-2xl">🏠</div>
        </div>
        <div className="absolute right-0 top-0 w-14 h-14 rounded-2xl overflow-hidden shadow-md" style={{ transform: "rotate(6deg)" }}>
          <div className="w-full h-full bg-gradient-to-br from-teal-200 to-cyan-100 flex items-center justify-center text-2xl">🗺️</div>
        </div>
        <div className="relative z-10 w-16 h-16 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center border border-gray-100">
          <p className="text-[9px] font-bold text-red-500 uppercase">May</p>
          <div className="relative flex items-center justify-center w-10 h-10">
            <p className="text-2xl font-black text-gray-900 z-10">20</p>
            <div className="absolute inset-0 rounded-full border-2 border-red-500" style={{ transform: "rotate(-5deg)" }} />
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-lg font-bold text-gray-800 leading-snug">
          Plan Trips, Track Anniversaries,<br />or Organise Parties.
        </p>
        <p className="text-lg font-bold text-gray-800 mt-0.5">Then Share with Friends.</p>
      </div>

      <button
        onClick={onNew}
        className="flex items-center gap-2 bg-[#F97316] text-white px-7 py-3.5 rounded-full text-base font-semibold shadow-sm active:scale-[0.97] transition-transform"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2V14M2 8H14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        New Collection
      </button>
    </div>
  );
}

function CollectionCard({ collection }: { collection: Collection }) {
  const router = useRouter();

  const datetimeItem = collection.items.find((i) => i.type === "datetime");
  const dateData = datetimeItem?.data as { date?: string } | undefined;

  const dateLabel = dateData?.date ? getDateLabel(dateData.date) : "";

  return (
    <button
      className="w-full text-left bg-white rounded-3xl p-5 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform"
      onClick={() => router.push(`/home/${collection.id}`)}
    >
      {/* Date label */}
      {dateLabel && (
        <div className="mb-2">
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ color: "#8e8e93", backgroundColor: "#f2f2f7" }}
          >
            {dateLabel}
          </span>
        </div>
      )}

      {/* Title & description */}
      <h3
        className="font-black text-black text-xl leading-tight mb-0.5"
        style={{ fontFamily: "-apple-system, 'SF Pro Display', sans-serif" }}
      >
        {collection.title}
      </h3>
      {collection.description && (
        <p className="text-gray-400 text-sm mb-4 line-clamp-1">{collection.description}</p>
      )}

      {/* Mini card thumbnails */}
      {collection.items.length > 0 && (
        <div className="flex gap-2 overflow-x-auto -mx-1 px-1" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {collection.items.map((item) => (
            <MiniCardThumbnail key={item.id} item={item} />
          ))}
        </div>
      )}
    </button>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { collections } = useCollections();
  const [tab, setTab] = useState<"next" | "past">("next");

  const now = new Date();
  const todayStr = now.toLocaleDateString("en-GB", {
    weekday: "short", day: "numeric", month: "short",
  });

  const nextCollections = collections.filter((c) => {
    const di = c.items.find((i) => i.type === "datetime");
    if (!di) return true;
    const d = di.data as { date: string };
    return !d.date || new Date(d.date + "T12:00:00") >= now;
  });

  const pastCollections = collections.filter((c) => {
    const di = c.items.find((i) => i.type === "datetime");
    if (!di) return false;
    const d = di.data as { date: string };
    return d.date && new Date(d.date + "T12:00:00") < now;
  });

  const displayed = tab === "next" ? nextCollections : pastCollections;

  return (
    <div className="min-h-[100svh] bg-[#f7f7f7] flex flex-col">
      {/* Header */}
      <div className="bg-[#f7f7f7] px-5 pt-14 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTab("next")}
                className="text-2xl font-black transition-colors"
                style={{
                  color: tab === "next" ? "#1c1c1e" : "#aeaeb2",
                  fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
                }}
              >
                Next
              </button>
              <button
                onClick={() => setTab("past")}
                className="text-2xl font-black transition-colors ml-1"
                style={{
                  color: tab === "past" ? "#1c1c1e" : "#aeaeb2",
                  fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
                }}
              >
                Past
              </button>
            </div>
            <p className="text-sm mt-0.5" style={{ color: "#aeaeb2", fontFamily: "-apple-system, sans-serif" }}>
              {todayStr}
            </p>
          </div>
          <button className="w-10 h-10 rounded-full overflow-hidden bg-yellow-100 flex items-center justify-center text-xl shadow-sm border border-white">
            🌕
          </button>
        </div>
      </div>

      {/* Content */}
      {displayed.length === 0 ? (
        <EmptyState onNew={() => router.push("/home/new")} />
      ) : (
        <div className="flex-1 px-5 pb-28 flex flex-col gap-4">
          {displayed.map((c) => (
            <CollectionCard key={c.id} collection={c} />
          ))}
        </div>
      )}

      {/* Circular FAB — bottom left */}
      {displayed.length > 0 && (
        <div className="fixed bottom-8 left-6 z-30">
          <button
            onClick={() => router.push("/home/new")}
            className="w-14 h-14 rounded-full bg-[#F97316] flex items-center justify-center shadow-lg active:scale-[0.97] transition-transform"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 3V19M3 11H19" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
