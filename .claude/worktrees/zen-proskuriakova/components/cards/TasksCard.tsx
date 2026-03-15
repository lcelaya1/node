"use client";

import { TasksData } from "@/context/CollectionsContext";

type Props = {
  data: TasksData;
  title?: string;
  onOptions?: () => void;
};

export default function TasksCard({ data, title = "Tasks", onOptions }: Props) {
  const items = data.items || [];
  const done = items.filter((t) => t.done).length;

  return (
    <div
      className="bg-white rounded-[28px] p-5 shadow-lg"
      style={{ minHeight: 180 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3
            className="font-bold text-black text-lg"
            style={{ fontFamily: "-apple-system, 'SF Pro Text', sans-serif" }}
          >
            {title}
          </h3>
          {items.length > 0 && (
            <p className="text-xs text-gray-400 mt-0.5">
              {done}/{items.length} completed
            </p>
          )}
        </div>
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

      {items.length === 0 ? (
        <p
          className="text-gray-400"
          style={{ fontFamily: "-apple-system, sans-serif", fontSize: 15 }}
        >
          No tasks yet.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((task) => (
            <div key={task.id} className="flex items-center gap-3">
              {/* Checkbox */}
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                style={{
                  borderColor: task.done ? "#007AFF" : "#d1d1d6",
                  backgroundColor: task.done ? "#007AFF" : "transparent",
                }}
              >
                {task.done && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span
                style={{
                  fontFamily: "-apple-system, sans-serif",
                  fontSize: 15,
                  color: task.done ? "#aeaeb2" : "#1c1c1e",
                  textDecoration: task.done ? "line-through" : "none",
                }}
              >
                {task.text}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
