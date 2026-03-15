"use client";

import { DateTimeData } from "@/context/CollectionsContext";

type Props = {
  data: DateTimeData;
  onChange: (data: DateTimeData) => void;
};

export default function DateTimeItem({ data, onChange }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200 flex flex-col items-center justify-center shadow-sm">
          <p className="text-[8px] font-bold text-red-500 uppercase leading-none">
            May
          </p>
          <p className="text-base font-black text-gray-900 leading-none">20</p>
        </div>
        <div>
          <p className="font-bold text-black">Date &amp; Time</p>
          <p className="text-xs text-gray-400">When are you meeting?</p>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
          Date
        </label>
        <input
          type="date"
          value={data.date}
          onChange={(e) => onChange({ ...data, date: e.target.value })}
          className="w-full bg-gray-100 rounded-2xl px-4 py-3.5 text-base text-black outline-none focus:ring-2 focus:ring-black/10"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
          Time
        </label>
        <input
          type="time"
          value={data.time}
          onChange={(e) => onChange({ ...data, time: e.target.value })}
          className="w-full bg-gray-100 rounded-2xl px-4 py-3.5 text-base text-black outline-none focus:ring-2 focus:ring-black/10"
        />
      </div>
    </div>
  );
}
