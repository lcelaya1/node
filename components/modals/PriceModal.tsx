"use client";

import { useRef, useState, useEffect } from "react";
import { PriceData } from "@/context/CollectionsContext";

const CURRENCIES = ["$", "€", "£", "¥", "₿"];

type Props = {
  open: boolean;
  data: PriceData;
  onClose: () => void;
  onSave: (data: PriceData) => void;
};

export default function PriceModal({ open, data, onClose, onSave }: Props) {
  const [local, setLocal] = useState<PriceData>(data);
  const amountInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setLocal(data);
  }, [open, data]);

  if (!open) return null;

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
          padding: "0 0 40px",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
        }}
      >
        {/* Handle */}
        <div style={{ width: 36, height: 4, background: "#d1d5db", borderRadius: 2, margin: "12px auto 0" }} />

        <div style={{ padding: "20px 24px 0" }}>
          {/* Currency tabs */}
          <div style={{
            display: "flex", alignItems: "center",
            background: "#f2f2f7", borderRadius: 20, padding: 4, marginBottom: 28,
          }}>
            {CURRENCIES.map((c) => (
              <button
                key={c}
                onClick={() => setLocal({ ...local, currency: c })}
                style={{
                  flex: 1, padding: "8px 0", borderRadius: 16, border: "none",
                  background: local.currency === c ? "#1c1c1e" : "transparent",
                  color: local.currency === c ? "white" : "#636366",
                  fontSize: 16, fontWeight: 600, cursor: "pointer",
                  fontFamily: "-apple-system, sans-serif",
                  transition: "all 0.2s",
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Amount label */}
          <p style={{ fontSize: 13, fontWeight: 700, color: "#8e8e93", letterSpacing: 0.5, marginBottom: 12, textTransform: "uppercase", fontFamily: "-apple-system, sans-serif" }}>
            Amount
          </p>

          {/* Large typographic amount */}
          <button
            onClick={() => amountInputRef.current?.focus()}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, width: "100%", textAlign: "left", marginBottom: 8 }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 36, fontWeight: 300, color: "#9ca3af", fontFamily: "-apple-system, sans-serif" }}>
                {local.currency || "$"}
              </span>
              <span style={{
                fontSize: 80, fontWeight: 300, lineHeight: 1,
                color: local.amount ? "#1c1c1e" : "#d1d5db",
                fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
                letterSpacing: -4,
              }}>
                {local.amount || "0"}
              </span>
            </div>
          </button>

          {/* Hidden number input */}
          <input
            ref={amountInputRef}
            type="number"
            value={local.amount}
            onChange={(e) => setLocal({ ...local, amount: e.target.value })}
            min="0"
            step="1"
            style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 1, height: 1 }}
            onFocus={() => {
              // Make it visible so keyboard appears on mobile
              if (amountInputRef.current) {
                amountInputRef.current.style.opacity = "0.01";
                amountInputRef.current.style.pointerEvents = "auto";
                amountInputRef.current.style.position = "fixed";
                amountInputRef.current.style.bottom = "0";
                amountInputRef.current.style.left = "0";
                amountInputRef.current.style.width = "100%";
                amountInputRef.current.style.zIndex = "999";
              }
            }}
            onBlur={() => {
              if (amountInputRef.current) {
                amountInputRef.current.style.opacity = "0";
                amountInputRef.current.style.pointerEvents = "none";
                amountInputRef.current.style.position = "absolute";
                amountInputRef.current.style.bottom = "auto";
                amountInputRef.current.style.width = "1px";
                amountInputRef.current.style.zIndex = "auto";
              }
            }}
          />

          {/* Divider */}
          <div style={{ height: 1, background: "#f2f2f7", margin: "16px -24px 20px" }} />

          {/* Description */}
          <input
            type="text"
            value={local.description}
            onChange={(e) => setLocal({ ...local, description: e.target.value })}
            placeholder="e.g. Per person, total cost…"
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
              background: local.amount ? "#1c1c1e" : "#c7c7cc",
              border: "none", borderRadius: 16,
              fontSize: 17, fontWeight: 700, color: "white",
              cursor: "pointer",
              fontFamily: "-apple-system, sans-serif",
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
