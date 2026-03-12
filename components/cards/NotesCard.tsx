"use client";

import { NoteData } from "@/context/CollectionsContext";

type Props = {
  data: NoteData;
  title?: string;
  onOptions?: () => void;
};

export default function NotesCard({ data, title = "Description", onOptions }: Props) {
  return (
    <div
      className="rounded-[28px] shadow-lg p-5"
      style={{
        // Apple Notes yellow — warm golden tone
        backgroundColor: "#FFD60A",
        minHeight: 180,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3
          className="font-bold text-black text-lg"
          style={{ fontFamily: "-apple-system, 'SF Pro Text', sans-serif" }}
        >
          {title}
        </h3>
        <button
          onClick={onOptions}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ml-2"
          style={{ backgroundColor: "rgba(0,0,0,0.08)" }}
        >
          <span className="text-black/60 font-bold" style={{ fontSize: 14, letterSpacing: 1 }}>
            •••
          </span>
        </button>
      </div>

      {/* Note body */}
      {data.text ? (
        <p
          className="text-black/75 leading-relaxed"
          style={{
            fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
            fontSize: 15,
            fontWeight: 400,
          }}
        >
          {data.text}
        </p>
      ) : (
        <p
          className="text-black/30"
          style={{
            fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
            fontSize: 15,
          }}
        >
          No description added yet.
        </p>
      )}
    </div>
  );
}
