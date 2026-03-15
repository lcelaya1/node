"use client";

import { PriceData } from "@/context/CollectionsContext";

type Props = {
  data: PriceData;
  onChange: (data: PriceData) => void;
};

const currencies = ["$", "€", "£", "¥", "₿"];

export default function PriceItem({ data, onChange }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center text-xl">
          💰
        </div>
        <div>
          <p className="font-bold text-black">Estimated Price</p>
          <p className="text-xs text-gray-400">How much will it cost?</p>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
          Currency
        </label>
        <div className="flex gap-2">
          {currencies.map((c) => (
            <button
              key={c}
              onClick={() => onChange({ ...data, currency: c })}
              className={`w-11 h-11 rounded-2xl text-base font-bold transition-all ${
                data.currency === c
                  ? "bg-black text-white shadow-sm"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
          Amount
        </label>
        <div className="flex items-center bg-gray-100 rounded-2xl px-4 py-3.5 gap-2">
          <span className="text-xl font-semibold text-gray-600">
            {data.currency || "$"}
          </span>
          <input
            type="number"
            value={data.amount}
            onChange={(e) => onChange({ ...data, amount: e.target.value })}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="flex-1 bg-transparent text-base text-black placeholder:text-gray-400 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
          Description (optional)
        </label>
        <input
          type="text"
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          placeholder="e.g. Per person, total cost..."
          className="w-full bg-gray-100 rounded-2xl px-4 py-3.5 text-base text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-black/10"
        />
      </div>
    </div>
  );
}
