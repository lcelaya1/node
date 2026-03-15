"use client";

import { PriceData } from "@/context/CollectionsContext";

type Props = {
  data: PriceData;
  onOptions?: () => void;
};

export default function PriceCard({ data, onOptions }: Props) {
  const hasAmount = !!data.amount;

  return (
    <div
      className="bg-white rounded-[28px] p-5 shadow-lg"
      style={{ minHeight: 160 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3
          className="font-bold text-black text-lg"
          style={{ fontFamily: "-apple-system, 'SF Pro Text', sans-serif" }}
        >
          Estimated Cost
        </h3>
        <button
          onClick={onOptions}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#f0f0f0" }}
        >
          <span
            className="text-gray-500 font-bold"
            style={{ fontSize: 14, letterSpacing: 1 }}
          >
            •••
          </span>
        </button>
      </div>

      {hasAmount ? (
        <div>
          {/* Big price display */}
          <div className="flex items-baseline gap-1 mb-1">
            <span
              className="font-light text-gray-500"
              style={{ fontSize: 24, fontFamily: "-apple-system, sans-serif" }}
            >
              {data.currency || "$"}
            </span>
            <span
              className="font-black text-black"
              style={{
                fontSize: 48,
                lineHeight: 1,
                fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
              }}
            >
              {data.amount}
            </span>
          </div>
          {data.description && (
            <p
              className="text-gray-400"
              style={{ fontFamily: "-apple-system, sans-serif", fontSize: 14 }}
            >
              {data.description}
            </p>
          )}
        </div>
      ) : (
        <p
          className="text-gray-400"
          style={{ fontFamily: "-apple-system, sans-serif", fontSize: 15 }}
        >
          No price estimate added yet.
        </p>
      )}
    </div>
  );
}
