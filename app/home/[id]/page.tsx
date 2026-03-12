"use client";

import { useParams, useRouter } from "next/navigation";
import { useCollections, CollectionItem } from "@/context/CollectionsContext";
import CalendarCard from "@/components/cards/CalendarCard";
import MapCard from "@/components/cards/MapCard";
import NotesCard from "@/components/cards/NotesCard";
import PhotoCard from "@/components/cards/PhotoCard";
import TasksCard from "@/components/cards/TasksCard";
import PriceCard from "@/components/cards/PriceCard";
import type {
  DateTimeData,
  LocationData,
  NoteData,
  PriceData,
  ImageData,
  TasksData,
} from "@/context/CollectionsContext";

// Display order for the stacked cards
const CARD_ORDER = ["datetime", "location", "note", "image", "tasks", "price"];

// Slight horizontal offsets per card position — creates the fanned-out look
const CARD_OFFSETS = [
  { x: 0, rotate: 0 },
  { x: 8, rotate: 0.5 },
  { x: -4, rotate: -0.3 },
  { x: 6, rotate: 0.4 },
  { x: -2, rotate: -0.2 },
  { x: 4, rotate: 0.3 },
];

function renderCard(item: CollectionItem) {
  switch (item.type) {
    case "datetime":
      return <CalendarCard data={item.data as DateTimeData} />;
    case "location":
      return <MapCard data={item.data as LocationData} />;
    case "note":
      return <NotesCard data={item.data as NoteData} />;
    case "image":
      return <PhotoCard data={item.data as ImageData} />;
    case "tasks":
      return <TasksCard data={item.data as TasksData} />;
    case "price":
      return <PriceCard data={item.data as PriceData} />;
    default:
      return null;
  }
}

export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { collections } = useCollections();

  const collection = collections.find((c) => c.id === params.id);

  if (!collection) {
    return (
      <div className="min-h-[100svh] flex flex-col items-center justify-center gap-4 px-5">
        <p className="text-gray-500">Collection not found.</p>
        <button
          onClick={() => router.push("/home")}
          className="text-blue-500 font-semibold"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Sort items by the preferred display order
  const sortedItems = [...collection.items].sort((a, b) => {
    const ai = CARD_ORDER.indexOf(a.type);
    const bi = CARD_ORDER.indexOf(b.type);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return (
    <div
      className="min-h-[100svh] flex flex-col"
      style={{
        background:
          "radial-gradient(ellipse 70% 50% at 5% 5%, rgba(150,220,195,0.45) 0%, transparent 55%), radial-gradient(ellipse 60% 45% at 95% 85%, rgba(145,210,230,0.4) 0%, transparent 55%), #f3faf7",
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-12 pb-5">
        <button
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(120,120,128,0.18)" }}
        >
          <span
            className="text-black/60 font-bold"
            style={{ fontSize: 15, letterSpacing: 2 }}
          >
            •••
          </span>
        </button>
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

      {/* Title & description */}
      <div className="px-5 mb-6">
        <h1
          className="font-black text-black text-4xl leading-tight"
          style={{ fontFamily: "-apple-system, 'SF Pro Display', sans-serif" }}
        >
          {collection.title}
        </h1>
        {collection.description && (
          <p
            className="text-gray-400 text-base mt-1"
            style={{ fontFamily: "-apple-system, 'SF Pro Text', sans-serif" }}
          >
            {collection.description}
          </p>
        )}
      </div>

      {/* Stacked cards — scrollable */}
      <div className="flex-1 overflow-y-auto pb-28 px-4">
        <div className="relative">
          {sortedItems.map((item, index) => {
            const offset = CARD_OFFSETS[index % CARD_OFFSETS.length];
            return (
              <div
                key={item.id}
                style={{
                  position: "relative",
                  marginTop: index === 0 ? 0 : -55,
                  zIndex: index + 1,
                  transform: `translateX(${offset.x}px) rotate(${offset.rotate}deg)`,
                  transformOrigin: "center top",
                  // Drop shadow on the card container reinforces depth
                  filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
                }}
              >
                {renderCard(item)}
              </div>
            );
          })}

          {/* Spacer so last card isn't under the bottom bar */}
          <div style={{ height: 40 }} />
        </div>
      </div>

      {/* Bottom bar — fixed */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 pb-10 pt-4 flex items-center justify-between"
        style={{
          background:
            "linear-gradient(to top, rgba(243,250,247,0.95) 60%, transparent 100%)",
        }}
      >
        {/* Invite button */}
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-full"
          style={{
            backgroundColor: "rgba(120,120,128,0.15)",
            fontFamily: "-apple-system, sans-serif",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="6" r="3" stroke="#3c3c43" strokeWidth="1.4" />
            <path
              d="M1 14C1 11.2 3.8 9 7 9"
              stroke="#3c3c43"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M12 10V14M10 12H14"
              stroke="#3c3c43"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <span
            className="text-sm font-semibold"
            style={{ color: "#3c3c43" }}
          >
            Invite
          </span>
        </button>

        {/* Add FAB */}
        <button
          onClick={() => router.push("/home/new")}
          className="w-12 h-12 rounded-full bg-black flex items-center justify-center shadow-lg active:scale-90 transition-transform"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M9 2V16M2 9H16"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
