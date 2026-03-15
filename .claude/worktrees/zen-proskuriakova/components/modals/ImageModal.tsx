"use client";

import { useRef, useState, useEffect } from "react";
import { ImageData } from "@/context/CollectionsContext";

type Props = {
  open: boolean;
  data: ImageData;
  onClose: () => void;
  onSave: (data: ImageData) => void;
};

export default function ImageModal({ open, data, onClose, onSave }: Props) {
  const [preview, setPreview] = useState(data.url || "");
  const [caption, setCaption] = useState(data.caption || "");
  const galleryRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setPreview(data.url || "");
      setCaption(data.caption || "");
    }
  }, [open, data]);

  if (!open) return null;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSave({ url: preview, caption });
    onClose();
  };

  return (
    <div
      className="slide-up"
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        maxWidth: 430, margin: "0 auto",
        background: "#1c1c1e",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "56px 20px 16px" }}>
        <button
          onClick={onClose}
          style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "rgba(255,255,255,0.12)", border: "none",
            color: "white", fontSize: 16, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          ✕
        </button>
      </div>

      {/* Preview area */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 20px" }}>
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            style={{ width: "100%", maxHeight: 360, objectFit: "cover", borderRadius: 20 }}
          />
        ) : (
          <div style={{
            width: "100%", height: 260, borderRadius: 20,
            border: "2px dashed rgba(255,255,255,0.2)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="28" height="24" viewBox="0 0 28 24" fill="none">
                <rect x="1" y="4" width="26" height="18" rx="4" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" />
                <circle cx="10" cy="13" r="3.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                <path d="M1 19L8 13L13 17L17 13L27 19" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                <path d="M20 1V7M17 4H23" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, fontFamily: "-apple-system, sans-serif" }}>
              No photo selected
            </p>
          </div>
        )}
      </div>

      {/* Caption input */}
      {preview && (
        <div style={{ padding: "16px 20px 0" }}>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Add a caption..."
            style={{
              width: "100%", background: "rgba(255,255,255,0.08)",
              border: "none", borderRadius: 14, padding: "12px 16px",
              fontSize: 15, color: "white", outline: "none",
              fontFamily: "-apple-system, sans-serif",
              boxSizing: "border-box",
            }}
          />
        </div>
      )}

      {/* Action buttons */}
      <div style={{ padding: "20px 20px 44px", display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Choose from gallery */}
        <button
          onClick={() => galleryRef.current?.click()}
          style={{
            width: "100%", padding: 16,
            background: "rgba(255,255,255,0.1)", border: "none",
            borderRadius: 16, cursor: "pointer",
            fontSize: 17, fontWeight: 600, color: "white",
            fontFamily: "-apple-system, sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
            <rect x="1" y="3" width="18" height="14" rx="3" stroke="white" strokeWidth="1.5" />
            <circle cx="7" cy="9.5" r="2.5" stroke="white" strokeWidth="1.5" />
            <path d="M1 15L6 10L10 13L13 10L19 14" stroke="white" strokeWidth="1.3" />
          </svg>
          Choose from Gallery
        </button>

        <input
          ref={galleryRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFile}
        />

        {/* Done */}
        <button
          onClick={handleSave}
          style={{
            width: "100%", padding: 16,
            background: preview ? "white" : "rgba(255,255,255,0.3)",
            border: "none", borderRadius: 16,
            cursor: preview ? "pointer" : "default",
            fontSize: 17, fontWeight: 700,
            color: preview ? "#1c1c1e" : "rgba(255,255,255,0.5)",
            fontFamily: "-apple-system, sans-serif",
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}
