"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCollections, Collection, ItemType } from "@/context/CollectionsContext";

const ITEM_TYPE_LABELS: Record<ItemType, string> = {
  location: "Direction",
  datetime: "Date & Time",
  note: "Note",
  price: "Price",
  image: "Photo",
  tasks: "Tasks",
};

const ITEM_TYPE_ICONS: Record<ItemType, string> = {
  location: "📍",
  datetime: "📅",
  note: "📝",
  price: "💰",
  image: "🖼️",
  tasks: "✅",
};

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6">
      {/* Icon cluster */}
      <div className="relative w-32 h-28 flex items-center justify-center">
        <div
          className="absolute left-0 top-4 w-14 h-14 rounded-2xl overflow-hidden shadow-md"
          style={{ transform: "rotate(-8deg)" }}
        >
          <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center text-2xl">
            🏠
          </div>
        </div>
        <div
          className="absolute right-0 top-0 w-14 h-14 rounded-2xl overflow-hidden shadow-md"
          style={{ transform: "rotate(6deg)" }}
        >
          <div className="w-full h-full bg-gradient-to-br from-teal-200 to-cyan-100 flex items-center justify-center text-2xl">
            🗺️
          </div>
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
  const createdDate = new Date(collection.createdAt);

  // Prefer the event date from the datetime item
  const datetimeItem = collection.items.find((i) => i.type === "datetime");
  const dateData = datetimeItem?.data as { date?: string } | undefined;
  const displayDate = dateData?.date
    ? new Date(dateData.date + "T12:00:00").toLocaleDateString("en-GB", {
        weekday: "short", day: "numeric", month: "short",
      })
    : createdDate.toLocaleDateString("en-GB", {
        weekday: "short", day: "numeric", month: "short",
      });

  return (
    <button
      className="w-full text-left bg-white rounded-3xl p-5 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform"
      onClick={() => router.push(`/home/${collection.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3
            className="font-bold text-black text-base"
            style={{ fontFamily: "-apple-system, 'SF Pro Text', sans-serif" }}
          >
            {collection.title}
          </h3>
          {collection.description && (
            <p className="text-gray-400 text-sm mt-0.5 line-clamp-1">
              {collection.description}
            </p>
          )}
        </div>
        <span className="text-xs text-gray-400 ml-3 flex-shrink-0">{displayDate}</span>
      </div>

      {collection.items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {collection.items.slice(0, 4).map((item) => (
            <span
              key={item.id}
              className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium"
            >
              {ITEM_TYPE_ICONS[item.type]} {ITEM_TYPE_LABELS[item.type]}
            </span>
          ))}
          {collection.items.length > 4 && (
            <span className="text-xs bg-gray-100 text-gray-400 px-2.5 py-1 rounded-full">
              +{collection.items.length - 4} more
            </span>
          )}
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
        <div className="flex-1 px-5 pb-28 flex flex-col gap-3">
          {displayed.map((c) => (
            <CollectionCard key={c.id} collection={c} />
          ))}
        </div>
      )}

      {/* FAB */}
      {displayed.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30">
          <button
            onClick={() => router.push("/home/new")}
            className="flex items-center gap-2 bg-[#F97316] text-white px-7 py-3.5 rounded-full text-base font-semibold shadow-lg active:scale-[0.97] transition-transform"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2V14M2 8H14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            New Collection
          </button>
        </div>
      )}
    </div>
  );
}
