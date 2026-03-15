"use client";

import { useRef } from "react";
import { ImageData } from "@/context/CollectionsContext";

type Props = {
  data: ImageData;
  onChange: (data: ImageData) => void;
};

export default function ImageItem({ data, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      onChange({ ...data, url });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #0ea5e9, #06b6d4)" }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect
              x="1"
              y="3"
              width="16"
              height="12"
              rx="2"
              stroke="white"
              strokeWidth="1.5"
            />
            <circle cx="6" cy="7.5" r="1.5" fill="white" />
            <path d="M1 13L5 9L8.5 12L11 10L17 13" stroke="white" strokeWidth="1.2" />
          </svg>
        </div>
        <div>
          <p className="font-bold text-black">Photo</p>
          <p className="text-xs text-gray-400">Add an image to your plan</p>
        </div>
      </div>

      {/* Upload area */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full rounded-3xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
        style={{ minHeight: 180 }}
      >
        {data.url ? (
          <img
            src={data.url}
            alt="Uploaded"
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="h-48 flex flex-col items-center justify-center gap-2">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #e0f2fe, #cffafe)" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 16V8M8 12L12 8L16 12"
                  stroke="#0891b2"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 20H20"
                  stroke="#0891b2"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-600">
              Tap to upload photo
            </p>
            <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {data.url && (
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 bg-gray-100 text-gray-700 rounded-2xl py-3 text-sm font-semibold"
          >
            Change Photo
          </button>
          <button
            onClick={() => onChange({ url: "", caption: "" })}
            className="flex-1 bg-red-50 text-red-500 rounded-2xl py-3 text-sm font-semibold"
          >
            Remove
          </button>
        </div>
      )}

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
          Caption (optional)
        </label>
        <input
          type="text"
          value={data.caption}
          onChange={(e) => onChange({ ...data, caption: e.target.value })}
          placeholder="Add a caption..."
          className="w-full bg-gray-100 rounded-2xl px-4 py-3.5 text-base text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-black/10"
        />
      </div>
    </div>
  );
}
