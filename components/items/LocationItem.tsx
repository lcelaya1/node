"use client";

import { LocationData } from "@/context/CollectionsContext";

type Props = {
  data: LocationData;
  onChange: (data: LocationData) => void;
};

export default function LocationItem({ data, onChange }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #38bdf8, #14b8a6)" }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 2C7.24 2 5 4.24 5 7C5 10.75 10 17 10 17C10 17 15 10.75 15 7C15 4.24 12.76 2 10 2ZM10 8.5C9.17 8.5 8.5 7.83 8.5 7C8.5 6.17 9.17 5.5 10 5.5C10.83 5.5 11.5 6.17 11.5 7C11.5 7.83 10.83 8.5 10 8.5Z"
              fill="white"
            />
          </svg>
        </div>
        <div>
          <p className="font-bold text-black">Direction</p>
          <p className="text-xs text-gray-400">Where are you going?</p>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
          Address
        </label>
        <input
          type="text"
          value={data.address}
          onChange={(e) => onChange({ ...data, address: e.target.value })}
          placeholder="Enter address or place name..."
          className="w-full bg-gray-100 rounded-2xl px-4 py-3.5 text-base text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-black/10"
        />
      </div>

      {/* Map preview placeholder */}
      <div
        className="w-full h-32 rounded-2xl overflow-hidden flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #bbf7d0, #a7f3d0)" }}
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M14 2C9.58 2 6 5.58 6 10C6 15.5 14 24 14 24C14 24 22 15.5 22 10C22 5.58 18.42 2 14 2ZM14 12.5C12.62 12.5 11.5 11.38 11.5 10C11.5 8.62 12.62 7.5 14 7.5C15.38 7.5 16.5 8.62 16.5 10C16.5 11.38 15.38 12.5 14 12.5Z"
              fill="#059669"
            />
          </svg>
          {data.address ? (
            <p className="text-sm font-medium text-emerald-800 max-w-[180px] line-clamp-1">
              {data.address}
            </p>
          ) : (
            <p className="text-xs text-emerald-600">Map preview</p>
          )}
        </div>
      </div>
    </div>
  );
}
