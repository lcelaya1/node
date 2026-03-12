"use client";

import { useRef, useState } from "react";
import { DateTimeData } from "@/context/CollectionsContext";

type Props = {
  open: boolean;
  data: DateTimeData;
  onClose: () => void;
  onSave: (data: DateTimeData) => void;
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const TABS = ["One Day", "Multi-Day", "Repeating"];

export default function DateTimeModal({ open, data, onClose, onSave }: Props) {
  const [local, setLocal] = useState<DateTimeData>(data);
  const [tab, setTab] = useState(0);
  const [showStartTime, setShowStartTime] = useState(!!data.time);
  const [showEndTime, setShowEndTime] = useState(false);
  const [endTime, setEndTime] = useState("");
  const dateInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const parsed = local.date ? new Date(local.date + "T12:00:00") : null;
  const dayNum = parsed ? parsed.getDate() : new Date().getDate();
  const monthStr = parsed ? MONTHS[parsed.getMonth()] : MONTHS[new Date().getMonth()];

  const handleSave = () => {
    onSave(local);
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
          padding: "0 0 40px", maxHeight: "88vh", overflowY: "auto",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
        }}
      >
        {/* Handle */}
        <div style={{ width: 36, height: 4, background: "#d1d5db", borderRadius: 2, margin: "12px auto 0" }} />

        <div style={{ padding: "20px 24px 0" }}>
          {/* Segmented tabs */}
          <div style={{
            display: "flex", alignItems: "center",
            background: "#f2f2f7", borderRadius: 20, padding: 4, marginBottom: 28,
          }}>
            {TABS.map((t, i) => (
              <button key={t} onClick={() => setTab(i)} style={{
                flex: 1, padding: "8px 0", borderRadius: 16, border: "none",
                background: tab === i ? "#1c1c1e" : "transparent",
                color: tab === i ? "white" : "#636366",
                fontSize: 14, fontWeight: 600, cursor: "pointer",
                fontFamily: "-apple-system, sans-serif",
                transition: "all 0.2s",
              }}>
                {t}
              </button>
            ))}
          </div>

          {/* Start Date */}
          <p style={{ fontSize: 13, fontWeight: 700, color: "#8e8e93", letterSpacing: 0.5, marginBottom: 12, textTransform: "uppercase", fontFamily: "-apple-system, sans-serif" }}>
            Start Date
          </p>

          {/* Large date display */}
          <button
            onClick={() => dateInputRef.current?.showPicker?.() ?? dateInputRef.current?.click()}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left", marginBottom: 24 }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ position: "relative", display: "inline-block" }}>
                <span style={{
                  fontSize: 80, fontWeight: 300, color: "#d1d5db", lineHeight: 1,
                  fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
                  letterSpacing: -4,
                }}>
                  {String(dayNum).padStart(2, "\u2009")}
                </span>
                {!local.date && (
                  <div style={{
                    position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 36, height: 36, borderRadius: "50%",
                    background: "#1c1c1e",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3V13M3 8H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <p style={{ fontSize: 22, fontWeight: 300, color: "#9ca3af", marginTop: -4, fontFamily: "-apple-system, sans-serif" }}>
              {monthStr}
            </p>
          </button>

          {/* Hidden date input */}
          <input
            ref={dateInputRef}
            type="date"
            value={local.date}
            onChange={(e) => setLocal({ ...local, date: e.target.value })}
            style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 1, height: 1 }}
          />

          {/* Divider */}
          <div style={{ height: 1, background: "#f2f2f7", margin: "0 -24px 20px" }} />

          {/* Start Time */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontSize: 17, color: "#8e8e93", fontFamily: "-apple-system, sans-serif" }}>Start Time</span>
            {showStartTime ? (
              <input
                type="time"
                value={local.time}
                onChange={(e) => setLocal({ ...local, time: e.target.value })}
                style={{
                  background: "#f2f2f7", border: "none", borderRadius: 20,
                  padding: "6px 14px", fontSize: 15, fontWeight: 600,
                  color: "#1c1c1e", outline: "none",
                  fontFamily: "-apple-system, sans-serif",
                }}
              />
            ) : (
              <button
                onClick={() => setShowStartTime(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  background: "#f2f2f7", border: "none", borderRadius: 20,
                  padding: "6px 14px", cursor: "pointer",
                  fontSize: 15, fontWeight: 600, color: "#1c1c1e",
                  fontFamily: "-apple-system, sans-serif",
                }}
              >
                <span style={{ fontSize: 16 }}>+</span> Add Time
              </button>
            )}
          </div>

          {/* End Time */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <span style={{ fontSize: 17, color: "#8e8e93", fontFamily: "-apple-system, sans-serif" }}>End Time</span>
            {showEndTime ? (
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                style={{
                  background: "#f2f2f7", border: "none", borderRadius: 20,
                  padding: "6px 14px", fontSize: 15, fontWeight: 600,
                  color: "#1c1c1e", outline: "none",
                  fontFamily: "-apple-system, sans-serif",
                }}
              />
            ) : (
              <button
                onClick={() => setShowEndTime(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  background: "#f2f2f7", border: "none", borderRadius: 20,
                  padding: "6px 14px", cursor: "pointer",
                  fontSize: 15, fontWeight: 600, color: "#1c1c1e",
                  fontFamily: "-apple-system, sans-serif",
                }}
              >
                <span style={{ fontSize: 16 }}>+</span> Add Time
              </button>
            )}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "#f2f2f7", margin: "0 -24px 20px" }} />

          {/* Event title */}
          <input
            type="text"
            placeholder="Event Title"
            style={{
              width: "100%", background: "#f2f2f7", border: "none",
              borderRadius: 14, padding: "14px 16px",
              fontSize: 17, color: "#1c1c1e",
              outline: "none", boxSizing: "border-box",
              fontFamily: "-apple-system, sans-serif",
              marginBottom: 24,
            }}
          />

          {/* Done button */}
          <button
            onClick={handleSave}
            style={{
              width: "100%", padding: 16,
              background: local.date ? "#1c1c1e" : "#c7c7cc",
              border: "none", borderRadius: 16,
              fontSize: 17, fontWeight: 700, color: "white",
              cursor: "pointer",
              fontFamily: "-apple-system, sans-serif",
              transition: "background 0.2s",
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
