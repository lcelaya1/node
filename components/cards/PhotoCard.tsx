"use client";

import { ImageData } from "@/context/CollectionsContext";

type Props = {
  data: ImageData;
  onOptions?: () => void;
};

export default function PhotoCard({ data, onOptions }: Props) {
  return (
    <div
      className="rounded-[28px] overflow-hidden shadow-lg relative"
      style={{ minHeight: 280, backgroundColor: "#1c1c1e" }}
    >
      {data.url ? (
        /* Uploaded photo */
        <img
          src={data.url}
          alt={data.caption || "Photo"}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        /* Placeholder — atmospheric dark photo style */
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background:
              "linear-gradient(160deg, #2c2c2e 0%, #1a1a1c 40%, #0f0f10 100%)",
          }}
        >
          <div className="flex flex-col items-center gap-3 opacity-40">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect
                x="2"
                y="8"
                width="36"
                height="26"
                rx="5"
                stroke="white"
                strokeWidth="2"
              />
              <circle cx="20" cy="21" r="7" stroke="white" strokeWidth="2" />
              <circle cx="20" cy="21" r="3" fill="white" />
              <rect x="14" y="4" width="12" height="6" rx="2" fill="white" />
            </svg>
            <p
              className="text-white text-sm"
              style={{ fontFamily: "-apple-system, sans-serif" }}
            >
              No photo added
            </p>
          </div>
        </div>
      )}

      {/* Options button */}
      <button
        onClick={onOptions}
        className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center z-10"
        style={{ backgroundColor: "rgba(150,150,150,0.5)" }}
      >
        <span
          className="text-white font-bold"
          style={{ fontSize: 13, letterSpacing: 1 }}
        >
          •••
        </span>
      </button>

      {/* Caption overlay at bottom */}
      {data.caption && (
        <div
          className="absolute bottom-0 left-0 right-0 px-5 py-4"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
          }}
        >
          <p
            className="text-white text-sm font-medium"
            style={{ fontFamily: "-apple-system, sans-serif" }}
          >
            {data.caption}
          </p>
        </div>
      )}
    </div>
  );
}
