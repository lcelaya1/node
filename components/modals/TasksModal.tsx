"use client";

import { useState, useEffect } from "react";
import { TasksData } from "@/context/CollectionsContext";

type Task = { id: string; text: string; done: boolean };

type Props = {
  open: boolean;
  data: TasksData;
  onClose: () => void;
  onSave: (data: TasksData) => void;
};

export default function TasksModal({ open, data, onClose, onSave }: Props) {
  const [items, setItems] = useState<Task[]>(data.items || []);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    if (open) setItems(data.items || []);
  }, [open, data.items]);

  if (!open) return null;

  const addTask = () => {
    if (!newTask.trim()) return;
    setItems((prev) => [...prev, { id: crypto.randomUUID(), text: newTask.trim(), done: false }]);
    setNewTask("");
  };

  const toggle = (id: string) => setItems((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  const remove = (id: string) => setItems((prev) => prev.filter((t) => t.id !== id));

  const handleSave = () => {
    onSave({ items });
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      {/* Overlay */}
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} />

      {/* Sheet */}
      <div
        className="slide-up"
        style={{
          position: "relative", width: "100%", maxWidth: 430,
          background: "white", borderRadius: "32px 32px 0 0",
          padding: "0 0 40px", maxHeight: "80vh", overflowY: "auto",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
        }}
      >
        {/* Handle */}
        <div style={{ width: 36, height: 4, background: "#d1d5db", borderRadius: 2, margin: "12px auto 0" }} />

        <div style={{ padding: "20px 24px 0" }}>
          {/* Title */}
          <p style={{
            fontSize: 24, fontWeight: 800, color: "#1c1c1e",
            fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
            marginBottom: 20,
          }}>
            Who Brings What?
          </p>

          {/* Task list */}
          {items.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 16 }}>
              {items.map((task) => (
                <div
                  key={task.id}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "14px 0",
                    borderBottom: "1px solid #f2f2f7",
                  }}
                >
                  {/* Circle toggle */}
                  <button
                    onClick={() => toggle(task.id)}
                    style={{
                      width: 24, height: 24, borderRadius: "50%", border: "none",
                      flexShrink: 0, cursor: "pointer",
                      background: task.done ? "#007AFF" : "transparent",
                      border: task.done ? "none" : "2px solid #c7c7cc",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.15s",
                    }}
                  >
                    {task.done && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>

                  <span style={{
                    flex: 1, fontSize: 17,
                    color: task.done ? "#8e8e93" : "#1c1c1e",
                    textDecoration: task.done ? "line-through" : "none",
                    fontFamily: "-apple-system, sans-serif",
                  }}>
                    {task.text}
                  </span>

                  {/* Remove */}
                  <button
                    onClick={() => remove(task.id)}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "#c7c7cc", padding: 4,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add task input */}
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              placeholder="Add a task…"
              style={{
                flex: 1, background: "#f2f2f7", border: "none",
                borderRadius: 14, padding: "13px 16px",
                fontSize: 17, color: "#1c1c1e",
                outline: "none", fontFamily: "-apple-system, sans-serif",
              }}
            />
            <button
              onClick={addTask}
              disabled={!newTask.trim()}
              style={{
                width: 48, height: 48, borderRadius: 14,
                background: newTask.trim() ? "#1c1c1e" : "#e5e7eb",
                border: "none", cursor: newTask.trim() ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2V14M2 8H14" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Done */}
          <button
            onClick={handleSave}
            style={{
              width: "100%", padding: 16,
              background: "#1c1c1e", border: "none", borderRadius: 16,
              fontSize: 17, fontWeight: 700, color: "white",
              cursor: "pointer", fontFamily: "-apple-system, sans-serif",
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
