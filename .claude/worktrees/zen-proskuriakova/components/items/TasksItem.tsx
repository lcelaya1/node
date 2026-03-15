"use client";

import { useState } from "react";
import { TasksData } from "@/context/CollectionsContext";

type Props = {
  data: TasksData;
  onChange: (data: TasksData) => void;
};

export default function TasksItem({ data, onChange }: Props) {
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (!newTask.trim()) return;
    onChange({
      items: [
        ...data.items,
        { id: crypto.randomUUID(), text: newTask.trim(), done: false },
      ],
    });
    setNewTask("");
  };

  const toggleTask = (id: string) => {
    onChange({
      items: data.items.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      ),
    });
  };

  const removeTask = (id: string) => {
    onChange({ items: data.items.filter((t) => t.id !== id) });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200 flex flex-col items-center justify-center gap-0.5 shadow-sm p-2">
          {[false, true, false].map((c, i) => (
            <div key={i} className="flex items-center gap-0.5 w-full">
              <div
                className={`w-2.5 h-2.5 rounded-sm border flex-shrink-0 ${
                  c ? "bg-gray-700 border-gray-700" : "border-gray-300"
                }`}
              />
              <div className="h-0.5 bg-gray-200 rounded-full flex-1" />
            </div>
          ))}
        </div>
        <div>
          <p className="font-bold text-black">Tasks</p>
          <p className="text-xs text-gray-400">Who brings what?</p>
        </div>
      </div>

      {/* Task list */}
      {data.items.length > 0 && (
        <div className="flex flex-col gap-2">
          {data.items.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3"
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  task.done
                    ? "bg-black border-black"
                    : "border-gray-300"
                }`}
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
              </button>
              <span
                className={`flex-1 text-sm ${
                  task.done ? "line-through text-gray-400" : "text-black"
                }`}
              >
                {task.text}
              </span>
              <button
                onClick={() => removeTask(task.id)}
                className="text-gray-300 hover:text-gray-500 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 4L12 12M12 4L4 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add task input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a task..."
          className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 text-base text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-black/10"
        />
        <button
          onClick={addTask}
          disabled={!newTask.trim()}
          className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center disabled:opacity-30 transition-opacity"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 2V14M2 8H14"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
