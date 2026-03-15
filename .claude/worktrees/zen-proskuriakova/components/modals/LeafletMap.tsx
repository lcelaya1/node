"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

type NominatimResult = {
  display_name: string;
  lat: string;
  lon: string;
};

type Props = {
  onConfirm: (address: string, lat: number, lng: number) => void;
  onClose: () => void;
  initialLat?: number;
  initialLng?: number;
};

export default function LeafletMap({ onConfirm, onClose, initialLat, initialLng }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<import("leaflet").Map | null>(null);
  const markerRef = useRef<import("leaflet").Marker | null>(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [selected, setSelected] = useState<{ address: string; lat: number; lng: number } | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    // Dynamic import to avoid SSR issues
    import("leaflet").then((L) => {
      if (leafletMap.current) return;

      // Fix default icon paths
      delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const lat = initialLat ?? 40.416;
      const lng = initialLng ?? -3.703;
      const zoom = initialLat ? 14 : 5;

      const map = L.map(mapRef.current!, { zoomControl: false }).setView([lat, lng], zoom);
      leafletMap.current = map;

      // Tile layer — Apple Maps-like style via CartoDB Voyager
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '© <a href="https://www.openstreetmap.org">OSM</a> © <a href="https://carto.com">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);

      // Custom red pin icon
      const redIcon = L.divIcon({
        html: `<div style="
          width:28px;height:28px;
          background:#FF375F;border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          box-shadow:0 2px 8px rgba(255,55,95,0.4);
          display:flex;align-items:center;justify-content:center;
        "><div style="
          width:10px;height:10px;
          background:white;border-radius:50%;
          transform:rotate(45deg);
        "></div></div>`,
        className: "",
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      if (initialLat && initialLng) {
        const marker = L.marker([initialLat, initialLng], { icon: redIcon }).addTo(map);
        markerRef.current = marker;
      }

      // Click on map → place marker + reverse geocode
      map.on("click", async (e) => {
        const { lat, lng } = e.latlng;

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng], { icon: redIcon }).addTo(map);
        }

        // Reverse geocode
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          const json = await res.json();
          setSelected({ address: json.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`, lat, lng });
        } catch {
          setSelected({ address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`, lat, lng });
        }
      });
    });

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
        markerRef.current = null;
      }
    };
  }, [initialLat, initialLng]);

  const handleSearch = async () => {
    if (!search.trim()) return;
    setSearching(true);
    setResults([]);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(search)}&format=json&limit=5`,
        { headers: { "Accept-Language": "en" } }
      );
      const json: NominatimResult[] = await res.json();
      setResults(json);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const selectResult = async (r: NominatimResult) => {
    const lat = parseFloat(r.lat);
    const lng = parseFloat(r.lon);
    setSelected({ address: r.display_name, lat, lng });
    setResults([]);
    setShowSearch(false);
    setSearch("");

    if (!leafletMap.current) return;
    const L = await import("leaflet");
    leafletMap.current.setView([lat, lng], 14);

    const redIcon = L.divIcon({
      html: `<div style="width:28px;height:28px;background:#FF375F;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(255,55,95,0.4);display:flex;align-items:center;justify-content:center;"><div style="width:10px;height:10px;background:white;border-radius:50%;transform:rotate(45deg);"></div></div>`,
      className: "", iconSize: [28, 28], iconAnchor: [14, 28],
    });

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng], { icon: redIcon }).addTo(leafletMap.current);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Map */}
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

      {/* Top header overlay */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        padding: "56px 20px 20px",
        background: "linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.6) 70%, transparent 100%)",
        pointerEvents: "none",
        zIndex: 800,
      }}>
        <p style={{
          fontSize: 28, fontWeight: 800, color: "#1c1c1e",
          fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
          letterSpacing: "-0.5px",
        }}>
          {selected ? "Location Set" : "Your Location"}
        </p>
        {selected && (
          <p style={{ fontSize: 13, color: "#636366", marginTop: 2, fontFamily: "-apple-system, sans-serif", maxWidth: "80%" }}>
            {selected.address.split(",").slice(0, 3).join(", ")}
          </p>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: 56, right: 16,
          width: 34, height: 34, borderRadius: "50%",
          background: "rgba(255,255,255,0.85)", border: "none",
          fontSize: 14, cursor: "pointer", zIndex: 900,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        ✕
      </button>

      {/* Search overlay */}
      {showSearch && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "white", zIndex: 1000,
          display: "flex", flexDirection: "column",
          padding: "56px 20px 20px",
        }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search for a place..."
              style={{
                flex: 1, background: "#f2f2f7", border: "none", borderRadius: 14,
                padding: "12px 16px", fontSize: 17, outline: "none",
                fontFamily: "-apple-system, sans-serif",
              }}
            />
            <button
              onClick={() => { setShowSearch(false); setResults([]); }}
              style={{
                background: "none", border: "none", fontSize: 15,
                color: "#007aff", cursor: "pointer", fontFamily: "-apple-system, sans-serif",
                fontWeight: 600,
              }}
            >
              Cancel
            </button>
          </div>

          {searching && (
            <p style={{ color: "#8e8e93", fontSize: 15, padding: "8px 0", fontFamily: "-apple-system, sans-serif" }}>Searching…</p>
          )}

          <div style={{ flex: 1, overflowY: "auto" }}>
            {results.map((r, i) => (
              <button
                key={i}
                onClick={() => selectResult(r)}
                style={{
                  width: "100%", padding: "14px 0",
                  borderBottom: "1px solid #f2f2f7",
                  background: "none", border: "none",
                  borderBottom: "1px solid #f2f2f7",
                  textAlign: "left", cursor: "pointer",
                  display: "flex", flexDirection: "column", gap: 2,
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 600, color: "#1c1c1e", fontFamily: "-apple-system, sans-serif" }}>
                  {r.display_name.split(",")[0]}
                </span>
                <span style={{ fontSize: 13, color: "#8e8e93", fontFamily: "-apple-system, sans-serif" }}>
                  {r.display_name.split(",").slice(1, 3).join(",")}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div style={{
        position: "absolute", bottom: 40, left: 20, right: 20,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        zIndex: 800,
      }}>
        {/* Search pill */}
        <button
          onClick={() => setShowSearch(true)}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "white", border: "none", borderRadius: 24,
            padding: "12px 20px", cursor: "pointer",
            fontSize: 16, fontWeight: 600, color: "#1c1c1e",
            fontFamily: "-apple-system, sans-serif",
            boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="5" stroke="#636366" strokeWidth="1.5" />
            <path d="M10.5 10.5L14 14" stroke="#636366" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Search
        </button>

        {/* Confirm FAB */}
        <button
          onClick={() => {
            if (selected) {
              onConfirm(selected.address, selected.lat, selected.lng);
            }
          }}
          style={{
            width: 52, height: 52, borderRadius: "50%",
            background: selected ? "#1c1c1e" : "#c7c7cc",
            border: "none", cursor: selected ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: selected ? "0 4px 16px rgba(0,0,0,0.3)" : "none",
            transition: "background 0.2s",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10L8 14L16 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
