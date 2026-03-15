"use client";

import { DateTimeData } from "@/context/CollectionsContext";

type Props = {
  data: DateTimeData;
  onOptions?: () => void;
};

export default function CalendarCard({ data, onOptions }: Props) {
  // Parse date — fall back to today
  const date = data.date ? new Date(data.date + "T12:00:00") : new Date();
  const month = date.toLocaleString("en-US", { month: "short" }); // "Mar"
  const dayName = date.toLocaleString("en-US", { weekday: "long" }); // "Friday"
  const dayNum = date.getDate(); // 13

  // Parse time — fall back to current hour
  const now = new Date();
  const rawTime = data.time || `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
  const [eventHour, eventMin] = rawTime.split(":").map(Number);

  // Build 4 hourly time slots centered on the event hour
  const slots = [-1, 0, 1, 2].map((offset) => {
    const h = (eventHour + offset + 24) % 24;
    return {
      label: `${String(h).padStart(2, "0")}:${String(eventMin).padStart(2, "0")}`,
      isEvent: offset === 0,
    };
  });

  return (
    <div
      className="bg-white rounded-[28px] overflow-hidden shadow-lg"
      style={{ minHeight: 300 }}
    >
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-baseline gap-2">
            <span
              className="text-base font-bold tracking-tight"
              style={{ color: "#FF3B30" }}
            >
              {month}
            </span>
            <span className="text-base font-light text-gray-400">{dayName}</span>
          </div>
          <button
            onClick={onOptions}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#f0f0f0" }}
          >
            <span className="text-gray-500 font-bold" style={{ fontSize: 14, letterSpacing: 1 }}>
              •••
            </span>
          </button>
        </div>

        {/* Huge day number */}
        <p
          className="font-black text-black leading-none mb-5"
          style={{ fontSize: 96, fontFamily: "-apple-system, 'SF Pro Display', sans-serif" }}
        >
          {dayNum}
        </p>

        {/* Time slots — Apple Calendar day view style */}
        <div className="flex flex-col" style={{ gap: 14 }}>
          {slots.map(({ label, isEvent }) => (
            <div key={label} className="flex items-center gap-3">
              {/* Time label */}
              <span
                className="tabular-nums flex-shrink-0"
                style={{
                  fontSize: 12,
                  fontFamily: "-apple-system, sans-serif",
                  color: isEvent ? "#1c1c1e" : "#aeaeb2",
                  fontWeight: isEvent ? 500 : 400,
                  width: 40,
                }}
              >
                {label}
              </span>

              {/* Line + event marker */}
              <div className="flex items-center flex-1 gap-1.5">
                {isEvent && (
                  // Red play-triangle — Apple's current-time indicator
                  <svg width="8" height="10" viewBox="0 0 8 10" fill="none" className="flex-shrink-0">
                    <path d="M1 1L7 5L1 9V1Z" fill="#FF3B30" />
                  </svg>
                )}
                <div
                  className="flex-1"
                  style={{
                    height: 1,
                    backgroundColor: isEvent ? "#ff3b30" : "#e5e5ea",
                    opacity: isEvent ? 0.5 : 1,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
