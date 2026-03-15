"use client";

import { useEffect, useRef, useState } from "react";
import { NoteData } from "@/context/CollectionsContext";

type Props = {
  open: boolean;
  data: NoteData;
  onClose: () => void;
  onSave: (data: NoteData) => void;
};

export default function NoteModal({ open, data, onClose, onSave }: Props) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState(data.text || "");
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  // Sync incoming data when opened
  useEffect(() => {
    if (open) {
      setBody(data.text || "");
      setTitle("");
    }
  }, [open, data.text]);

  if (!open) return null;

  const handleClose = () => {
    const combined = title.trim()
      ? `${title.trim()}\n\n${body.trim()}`
      : body.trim();
    onSave({ text: combined });
    onClose();
  };

  return (
    <div
      className="slide-up"
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "#f5e642",
        display: "flex", flexDirection: "column",
        maxWidth: 430, margin: "0 auto",
      }}
    >
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "56px 20px 16px",
      }}>
        <button style={{
          width: 34, height: 34, borderRadius: "50%",
          background: "rgba(0,0,0,0.08)", border: "none",
          fontSize: 16, color: "#3d3000", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 500,
        }}>
          ···
        </button>
        <div style={{ display: "flex", gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(0,0,0,0.2)" }} />
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(0,0,0,0.45)" }} />
        </div>
        <button
          onClick={handleClose}
          style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "rgba(0,0,0,0.08)", border: "none",
            fontSize: 16, color: "#3d3000", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          ✕
        </button>
      </div>

      {/* Content area */}
      <div style={{ flex: 1, padding: "8px 24px 100px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add Title"
          onKeyDown={(e) => e.key === "Enter" && bodyRef.current?.focus()}
          style={{
            background: "none", border: "none", outline: "none",
            fontSize: 30, fontWeight: 700,
            color: title ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.25)",
            fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
            letterSpacing: "-0.5px",
            marginBottom: 12,
            width: "100%",
            caretColor: "rgba(0,0,0,0.6)",
          }}
        />

        {/* Body */}
        <textarea
          ref={bodyRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Start writing..."
          autoFocus={!title}
          style={{
            background: "none", border: "none", outline: "none", resize: "none",
            flex: 1, fontSize: 18, lineHeight: 1.6,
            color: body ? "rgba(0,0,0,0.75)" : "rgba(0,0,0,0.25)",
            fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
            width: "100%",
            caretColor: "rgba(0,0,0,0.6)",
          }}
        />
      </div>

      {/* Black FAB — cosmetic, matches reference */}
      <div style={{ position: "absolute", bottom: 32, right: 24 }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: "#1c1c1e",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4V16M4 10H16" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
