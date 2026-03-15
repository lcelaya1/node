"use client";

import { NoteData } from "@/context/CollectionsContext";

type Props = {
  data: NoteData;
  onChange: (data: NoteData) => void;
};

export default function NoteItem({ data, onChange }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
          style={{ backgroundColor: "#f5e642" }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M3 2H13L16 5V16C16 16.55 15.55 17 15 17H3C2.45 17 2 16.55 2 16V3C2 2.45 2.45 2 3 2Z"
              fill="#ca8a04"
              opacity="0.5"
            />
            <path d="M5 7H13M5 10H11M5 13H9" stroke="#92400e" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <p className="font-bold text-black">Note</p>
          <p className="text-xs text-gray-400">Add a description or any info</p>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
          Description
        </label>
        <textarea
          value={data.text}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Write anything you want to share..."
          rows={5}
          className="w-full bg-gray-100 rounded-2xl px-4 py-3.5 text-base text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-black/10 resize-none"
        />
      </div>
    </div>
  );
}
