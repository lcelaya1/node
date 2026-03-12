"use client";

export default function FeatureCarousel() {
  return (
    <div className="w-full overflow-x-auto no-scrollbar px-4">
      <div className="flex gap-3 pb-2" style={{ width: "max-content" }}>
        {/* Tasks Card */}
        <div className="bg-white rounded-3xl shadow-sm p-4 flex flex-col gap-2 w-28 h-32 flex-shrink-0">
          <div className="flex flex-col gap-1.5 flex-1">
            {[false, true, false].map((checked, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div
                  className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center flex-shrink-0 ${
                    checked
                      ? "bg-gray-800 border-gray-800"
                      : "border-gray-300"
                  }`}
                >
                  {checked && (
                    <svg
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      fill="none"
                    >
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
                <div className="h-1.5 bg-gray-200 rounded-full flex-1" />
              </div>
            ))}
          </div>
          <p className="text-xs font-semibold text-black">Tasks</p>
        </div>

        {/* Photo Card */}
        <div
          className="rounded-3xl overflow-hidden w-28 h-32 flex-shrink-0 relative flex items-end"
          style={{
            background:
              "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 40%, #14b8a6 100%)",
            transform: "rotate(-3deg)",
            marginTop: 8,
          }}
        >
          {/* Bridge silhouette */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              viewBox="0 0 112 128"
              fill="none"
              className="w-full h-full opacity-80"
            >
              {/* Sky */}
              <rect width="112" height="128" fill="#0e7490" />
              {/* Water */}
              <rect y="90" width="112" height="38" fill="#164e63" />
              {/* Bridge towers */}
              <rect x="30" y="30" width="8" height="70" fill="#dc2626" />
              <rect x="74" y="30" width="8" height="70" fill="#dc2626" />
              {/* Cables */}
              <line
                x1="34"
                y1="32"
                x2="10"
                y2="90"
                stroke="#dc2626"
                strokeWidth="1"
              />
              <line
                x1="34"
                y1="32"
                x2="78"
                y2="90"
                stroke="#dc2626"
                strokeWidth="1"
              />
              <line
                x1="78"
                y1="32"
                x2="102"
                y2="90"
                stroke="#dc2626"
                strokeWidth="1"
              />
              <line
                x1="78"
                y1="32"
                x2="34"
                y2="90"
                stroke="#dc2626"
                strokeWidth="1"
              />
              {/* Road deck */}
              <rect x="4" y="88" width="104" height="5" fill="#b91c1c" />
            </svg>
          </div>
          <div className="relative z-10 px-3 pb-2">
            <p className="text-xs font-semibold text-white drop-shadow">
              Photo
            </p>
          </div>
        </div>

        {/* Website Card */}
        <div className="bg-white rounded-3xl shadow-sm p-4 flex flex-col gap-2 w-28 h-32 flex-shrink-0">
          <div className="flex gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle
                  cx="6"
                  cy="6"
                  r="4"
                  stroke="#9ca3af"
                  strokeWidth="1.5"
                />
                <path
                  d="M9 9L12 12"
                  stroke="#9ca3af"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 7C2 7 4 4 7 4C10 4 12 7 12 7C12 7 10 10 7 10C4 10 2 7 2 7Z"
                  stroke="#9ca3af"
                  strokeWidth="1.5"
                />
                <circle cx="7" cy="7" r="1.5" fill="#9ca3af" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="h-1.5 bg-gray-200 rounded-full w-full" />
            <div className="h-1.5 bg-gray-200 rounded-full w-4/5" />
            <div className="h-1.5 bg-gray-200 rounded-full w-3/5" />
          </div>
          <p className="text-xs font-semibold text-black">Website</p>
        </div>

        {/* Notes Card */}
        <div
          className="rounded-3xl p-4 flex flex-col w-28 h-32 flex-shrink-0"
          style={{ backgroundColor: "#f5e642" }}
        >
          <div className="flex-1">
            <p className="text-[9px] text-gray-700 leading-tight">
              Ideas, by definition, are always fragile.
            </p>
            <p className="text-[9px] text-gray-600 leading-tight mt-1">
              If they were resolved, they wouldn&apos;t be ideas.
            </p>
          </div>
          <p className="text-xs font-semibold text-black">Notes</p>
        </div>
      </div>
    </div>
  );
}
