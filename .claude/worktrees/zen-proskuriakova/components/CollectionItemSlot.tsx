"use client";

import { CollectionItem, ItemType } from "@/context/CollectionsContext";

const typeConfig: Record<
  ItemType,
  { label: string; icon: React.ReactNode; color: string }
> = {
  location: {
    label: "Where are you Going?",
    color: "#bbf7d0",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="10" fill="#bbf7d0" />
        <path d="M2 18 L38 18" stroke="#86efac" strokeWidth="0.5" />
        <path d="M2 26 L38 26" stroke="#86efac" strokeWidth="0.5" />
        <path d="M13 2 L13 38" stroke="#86efac" strokeWidth="0.5" />
        <path d="M26 2 L26 38" stroke="#86efac" strokeWidth="0.5" />
        <circle cx="20" cy="16" r="5" fill="#f97316" />
        <circle cx="20" cy="16" r="2" fill="white" />
        <path d="M20 21 L20 27" stroke="#f97316" strokeWidth="2" />
        <circle cx="29" cy="10" r="5" fill="#f97316" />
        <path
          d="M29 7.5L29.8 9.5H31.9L30.3 10.7L30.8 12.8L29 11.5L27.2 12.8L27.7 10.7L26.1 9.5H28.2L29 7.5Z"
          fill="white"
        />
      </svg>
    ),
  },
  datetime: {
    label: "When are you Meeting?",
    color: "#ffffff",
    icon: (
      <div className="flex flex-col items-center w-12">
        <div
          className="bg-white rounded-2xl px-3 py-1 shadow-md flex flex-col items-center"
          style={{ border: "1px solid #e5e7eb" }}
        >
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
            May
          </p>
          <div className="relative flex items-center justify-center w-8 h-8">
            <p className="text-xl font-black text-gray-900 leading-none z-10">
              20
            </p>
            <div
              className="absolute inset-0 rounded-full border-2 border-red-500"
              style={{ transform: "rotate(-5deg)" }}
            />
          </div>
        </div>
      </div>
    ),
  },
  note: {
    label: "Good to Know",
    color: "#f5e642",
    icon: (
      <div
        className="rounded-2xl p-3 shadow-sm w-12 h-12 flex items-start"
        style={{ backgroundColor: "#f5e642" }}
      >
        <p className="text-[7px] text-gray-700 leading-tight">
          Ideas, by definition, are always fragile.
        </p>
      </div>
    ),
  },
  price: {
    label: "Estimated Cost",
    color: "#f0fdf4",
    icon: (
      <div className="text-3xl">💰</div>
    ),
  },
  image: {
    label: "Add a Photo",
    color: "#0e7490",
    icon: (
      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-cyan-700 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path
            d="M3 22 L10 14 L16 18 L20 13 L25 22 Z"
            fill="#164e63"
          />
          <circle cx="20" cy="9" r="3.5" fill="#fbbf24" />
        </svg>
      </div>
    ),
  },
  tasks: {
    label: "Who Brings What?",
    color: "#ffffff",
    icon: (
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 w-12 h-12 flex flex-col gap-1 justify-center">
        {[false, true, false].map((checked, i) => (
          <div key={i} className="flex items-center gap-1">
            <div
              className={`w-3 h-3 rounded-sm border flex items-center justify-center flex-shrink-0 ${
                checked ? "bg-gray-700 border-gray-700" : "border-gray-300"
              }`}
            >
              {checked && (
                <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
                  <path
                    d="M1 2.5L2.5 4L6 1"
                    stroke="white"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>
            <div className="h-1 bg-gray-200 rounded-full flex-1" />
          </div>
        ))}
      </div>
    ),
  },
};

function getItemPreview(item: CollectionItem): string {
  switch (item.type) {
    case "location": {
      const d = item.data as { address: string };
      return d.address || "";
    }
    case "datetime": {
      const d = item.data as { date: string; time: string };
      return [d.date, d.time].filter(Boolean).join(" at ") || "";
    }
    case "note": {
      const d = item.data as { text: string };
      return d.text || "";
    }
    case "price": {
      const d = item.data as { amount: string; currency: string };
      return d.amount ? `${d.currency}${d.amount}` : "";
    }
    case "image": {
      const d = item.data as { caption: string };
      return d.caption || "Photo attached";
    }
    case "tasks": {
      const d = item.data as { items: { text: string; done: boolean }[] };
      return `${d.items.length} task${d.items.length !== 1 ? "s" : ""}`;
    }
    default:
      return "";
  }
}

type Props = {
  item?: CollectionItem;
  type?: ItemType;
  onAdd: () => void;
  onRemove?: () => void;
};

export default function CollectionItemSlot({ item, type, onAdd, onRemove }: Props) {
  const config = item ? typeConfig[item.type] : type ? typeConfig[type] : null;
  const preview = item ? getItemPreview(item) : "";

  return (
    <div
      className="relative rounded-3xl p-5 flex flex-col items-center justify-center gap-3 min-h-[160px]"
      style={{
        border: "2px dashed #d1d5db",
        backgroundColor: "#f9fafb",
      }}
    >
      {/* Add / Remove button */}
      <button
        onClick={item ? onRemove : onAdd}
        className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
        style={{
          backgroundColor: "rgba(255,255,255,0.8)",
          border: "1px solid #e5e7eb",
        }}
      >
        {item ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 2L10 10M10 2L2 10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 1V11M1 6H11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      {/* Icon */}
      {config && (
        <div className="flex items-center justify-center">{config.icon}</div>
      )}

      {/* Label */}
      <div className="text-center">
        <p
          className={`font-semibold text-base ${item ? "text-black" : "text-gray-500"}`}
        >
          {config?.label}
        </p>
        {preview && (
          <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{preview}</p>
        )}
      </div>
    </div>
  );
}
