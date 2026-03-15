"use client";

import { LocationData } from "@/context/CollectionsContext";

type Props = {
  data: LocationData;
  onOptions?: () => void;
};

// Apple Maps–style SVG city map
function AppleMapsView() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 300"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Ground / base */}
      <rect width="400" height="300" fill="#F2EDE3" />

      {/* Park — top right */}
      <rect x="252" y="0" width="148" height="95" rx="0" fill="#C5E8A8" />
      <text x="290" y="42" fontSize="9" fill="#5C8C45" fontFamily="-apple-system, sans-serif" fontWeight="500">
        Al Watan Park
      </text>

      {/* Large diagonal boulevard */}
      <path d="M0 200 L400 100" stroke="#FFFFFF" strokeWidth="18" />
      <path d="M0 200 L400 100" stroke="#EDE8DF" strokeWidth="20" strokeDasharray="0" />
      <path d="M0 200 L400 100" stroke="#FFFFFF" strokeWidth="16" />

      {/* Major horizontal road */}
      <rect x="0" y="132" width="400" height="14" fill="#FFFFFF" />
      <rect x="0" y="130" width="400" height="18" fill="none" stroke="#E8E0D3" strokeWidth="1" />

      {/* Major vertical road */}
      <rect x="174" y="0" width="14" height="300" fill="#FFFFFF" />
      <rect x="172" y="0" width="18" height="300" fill="none" stroke="#E8E0D3" strokeWidth="1" />

      {/* Secondary horizontal roads */}
      <rect x="0" y="72" width="400" height="7" fill="#FFFFFF" opacity="0.85" />
      <rect x="0" y="195" width="400" height="7" fill="#FFFFFF" opacity="0.85" />
      <rect x="0" y="248" width="400" height="6" fill="#FFFFFF" opacity="0.7" />

      {/* Secondary vertical roads */}
      <rect x="96" y="0" width="7" height="300" fill="#FFFFFF" opacity="0.85" />
      <rect x="298" y="0" width="7" height="300" fill="#FFFFFF" opacity="0.85" />
      <rect x="52" y="0" width="5" height="300" fill="#FFFFFF" opacity="0.6" />
      <rect x="350" y="0" width="5" height="300" fill="#FFFFFF" opacity="0.6" />

      {/* Building blocks — top-left quadrant */}
      <rect x="10" y="10" width="74" height="52" rx="4" fill="#E5DDD2" />
      <rect x="10" y="82" width="74" height="40" rx="4" fill="#E5DDD2" />
      <rect x="108" y="10" width="54" height="52" rx="4" fill="#E5DDD2" />
      <rect x="108" y="82" width="54" height="40" rx="4" fill="#E5DDD2" />

      {/* Building blocks — bottom-left quadrant */}
      <rect x="10" y="150" width="74" height="34" rx="4" fill="#E5DDD2" />
      <rect x="10" y="206" width="74" height="32" rx="4" fill="#E5DDD2" />
      <rect x="10" y="258" width="74" height="34" rx="4" fill="#E5DDD2" />
      <rect x="108" y="150" width="54" height="34" rx="4" fill="#E5DDD2" />
      <rect x="108" y="206" width="54" height="32" rx="4" fill="#E5DDD2" />

      {/* Building blocks — right quadrants */}
      <rect x="196" y="10" width="88" height="52" rx="4" fill="#E5DDD2" />
      <rect x="196" y="150" width="88" height="34" rx="4" fill="#E5DDD2" />
      <rect x="196" y="206" width="88" height="32" rx="4" fill="#E5DDD2" />
      <rect x="316" y="150" width="76" height="34" rx="4" fill="#E5DDD2" />
      <rect x="316" y="206" width="76" height="32" rx="4" fill="#E5DDD2" />
      <rect x="316" y="258" width="76" height="34" rx="4" fill="#E5DDD2" />

      {/* Highlighted area (golden yellow — like a district) */}
      <rect x="10" y="206" width="74" height="32" rx="4" fill="#F0D888" />

      {/* Area / district labels */}
      <text x="200" y="172" fontSize="10" fill="#5C4A38" fontFamily="-apple-system, sans-serif" fontWeight="600">
        AL FUTAH
      </text>
      <text x="320" y="172" fontSize="9" fill="#5C4A38" fontFamily="-apple-system, sans-serif" fontWeight="500">
        AL KH...
      </text>
      <text x="15" y="225" fontSize="8" fill="#8A7260" fontFamily="-apple-system, sans-serif">
        Dar Alamirat
      </text>

      {/* Road label on major horizontal */}
      <text x="14" y="128" fontSize="7.5" fill="#9A8E82" fontFamily="-apple-system, sans-serif">
        AL SUM...
      </text>

      {/* Speed sign on road */}
      <circle cx="58" cy="210" r="9" fill="#FFFFFF" stroke="#D0C8BC" strokeWidth="1" />
      <circle cx="58" cy="210" r="7" fill="#FFFFFF" stroke="#E03030" strokeWidth="1.5" />
      <text x="58" y="214" fontSize="7" fill="#1C1C1E" fontFamily="-apple-system, sans-serif" fontWeight="700" textAnchor="middle">
        35
      </text>

      {/* Pin shadow */}
      <ellipse cx="181" cy="150" rx="10" ry="3.5" fill="rgba(0,0,0,0.12)" />

      {/* Location pin — Apple Maps style */}
      <circle cx="181" cy="132" r="18" fill="#FF375F" />
      <circle cx="181" cy="132" r="18" fill="none" stroke="rgba(255,55,95,0.3)" strokeWidth="5" />
      {/* Inner white dot */}
      <circle cx="181" cy="132" r="7" fill="#FFFFFF" />
    </svg>
  );
}

export default function MapCard({ data, onOptions }: Props) {
  const label = data.address || "Location";

  return (
    <div
      className="rounded-[28px] overflow-hidden shadow-lg"
      style={{ minHeight: 260, position: "relative" }}
    >
      {/* Full-bleed map */}
      <div style={{ position: "absolute", inset: 0 }}>
        <AppleMapsView />
      </div>

      {/* Top overlay bar */}
      <div
        className="relative z-10 flex items-center justify-between px-4 pt-4 pb-2"
        style={{
          background:
            "linear-gradient(to bottom, rgba(242,237,227,0.92) 0%, rgba(242,237,227,0.0) 100%)",
        }}
      >
        <h3
          className="font-bold text-black text-base"
          style={{
            fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
            textShadow: "0 1px 2px rgba(255,255,255,0.6)",
          }}
        >
          {label.length > 24 ? label.slice(0, 24) + "…" : label}
        </h3>
        <button
          onClick={onOptions}
          className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
          style={{ backgroundColor: "rgba(255,255,255,0.75)" }}
        >
          <span className="text-gray-600 font-bold" style={{ fontSize: 14, letterSpacing: 1 }}>
            •••
          </span>
        </button>
      </div>

      {/* Map fills remaining space */}
      <div style={{ height: 220 }} />
    </div>
  );
}
