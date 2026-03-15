"use client";

import { ItemType } from "@/context/CollectionsContext";

type ItemTypeDef = {
  type: ItemType;
  label: string;
  bg: string;
  content: React.ReactNode;
};

const itemTypes: ItemTypeDef[] = [
  {
    type: "note",
    label: "Note",
    bg: "#f5e642",
    content: (
      <div className="flex flex-col gap-1 text-left">
        <p className="text-[9px] text-gray-700 leading-tight">
          Ideas, by definition,
          <br />
          are always fragile.
        </p>
        <p className="text-[9px] text-gray-500 leading-tight">
          If they were resolved, they
          <br />
          wouldn&apos;t be ideas.
        </p>
      </div>
    ),
  },
  {
    type: "tasks",
    label: "Tasks",
    bg: "#ffffff",
    content: (
      <div className="flex flex-col gap-1.5 w-full">
        {[false, true, false].map((checked, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center flex-shrink-0 ${
                checked ? "bg-gray-700 border-gray-700" : "border-gray-300"
              }`}
            >
              {checked && (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                  <path
                    d="M1 3.5L3 5.5L8 1"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full flex-1" />
          </div>
        ))}
      </div>
    ),
  },
  {
    type: "location",
    label: "Location",
    bg: "linear-gradient(135deg, #38bdf8 0%, #14b8a6 100%)",
    content: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="18" fill="none" />
        {/* Map background */}
        <rect x="2" y="2" width="32" height="32" rx="8" fill="#bbf7d0" />
        <path d="M2 15 L34 15" stroke="#86efac" strokeWidth="0.5" />
        <path d="M2 22 L34 22" stroke="#86efac" strokeWidth="0.5" />
        <path d="M12 2 L12 34" stroke="#86efac" strokeWidth="0.5" />
        <path d="M22 2 L22 34" stroke="#86efac" strokeWidth="0.5" />
        {/* Pin */}
        <circle cx="18" cy="14" r="5" fill="#f97316" />
        <circle cx="18" cy="14" r="2" fill="white" />
        <path d="M18 19 L18 24" stroke="#f97316" strokeWidth="2" />
        {/* Star on pin */}
        <circle cx="26" cy="10" r="5" fill="#f97316" />
        <path
          d="M26 7.5L26.8 9.5H28.9L27.3 10.7L27.8 12.8L26 11.5L24.2 12.8L24.7 10.7L23.1 9.5H25.2L26 7.5Z"
          fill="white"
        />
      </svg>
    ),
  },
  {
    type: "image",
    label: "Photo",
    bg: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
    content: (
      <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
        {/* Simple mountain/photo icon */}
        <rect width="64" height="64" rx="12" fill="#0e7490" />
        <path d="M8 50 L24 30 L36 42 L44 34 L56 50 Z" fill="#164e63" />
        <circle cx="46" cy="22" r="8" fill="#fbbf24" />
        {/* Bridge simplified */}
        <rect x="10" y="46" width="44" height="3" fill="#7f1d1d" />
        <rect x="20" y="28" width="4" height="20" fill="#dc2626" />
        <rect x="40" y="28" width="4" height="20" fill="#dc2626" />
      </svg>
    ),
  },
  {
    type: "datetime",
    label: "Date",
    bg: "#ffffff",
    content: (
      <div className="flex flex-col items-center">
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
          May
        </p>
        <div className="relative">
          <p className="text-3xl font-black text-gray-900 leading-none">20</p>
          <div
            className="absolute -inset-2 rounded-full border-2 border-red-500"
            style={{ transform: "rotate(-5deg)" }}
          />
        </div>
      </div>
    ),
  },
  {
    type: "price",
    label: "Price",
    bg: "#f0fdf4",
    content: (
      <div className="flex flex-col items-center gap-1">
        <span className="text-3xl">💰</span>
        <div className="h-1.5 bg-green-200 rounded-full w-12" />
        <div className="h-1.5 bg-green-100 rounded-full w-8" />
      </div>
    ),
  },
];

type Props = {
  onSelect: (type: ItemType) => void;
  disabledTypes?: ItemType[];
};

export default function ItemTypeGrid({ onSelect, disabledTypes = [] }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {itemTypes.map((item) => {
        const disabled = disabledTypes.includes(item.type);
        return (
          <button
            key={item.type}
            onClick={() => !disabled && onSelect(item.type)}
            disabled={disabled}
            className={`flex flex-col items-center gap-2 ${disabled ? "opacity-40" : "card-hover"}`}
          >
            <div
              className="w-full aspect-square rounded-3xl flex items-center justify-center p-3 shadow-sm"
              style={{
                background: item.bg,
                border:
                  item.bg === "#ffffff" || item.bg === "#f0fdf4"
                    ? "1px solid #e5e7eb"
                    : "none",
              }}
            >
              {item.content}
            </div>
            <span className="text-sm font-semibold text-black">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
