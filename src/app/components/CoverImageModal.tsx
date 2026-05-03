import { useEffect, useRef, useState } from "react";

type Tab = "stock" | "gallery";
type GalleryState = "prompt" | "photos";

type CoverImageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (image: string) => void;
};

// ── Dupephotos API ───────────────────────────────────────────────────────────
const DUPE_API = "https://content-api-prod-6gxsdymdsq-ue.a.run.app/api/v1/content";
const DUPE_CDN = "https://d3p3fw3rutb1if.cloudfront.net";

type DupePhoto = {
  id: string;
  img_id: string;
  img_preview_id: string;
  content_type: string;
  username: string;
};

async function fetchDupePhotos(): Promise<DupePhoto[]> {
  const res = await fetch(DUPE_API);
  if (!res.ok) throw new Error("Dupe API error");
  const data: DupePhoto[] = await res.json();
  return data.filter((p) => p.content_type === "PHOTO").slice(0, 20);
}

async function searchDupePhotos(query: string): Promise<DupePhoto[]> {
  const res = await fetch(`${DUPE_API}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ label: query, content_type: "PHOTO" }),
  });
  if (!res.ok) throw new Error("Dupe search error");
  const data: DupePhoto[] = await res.json();
  return data.filter((p) => p.content_type === "PHOTO").slice(0, 20);
}

// Session-scoped gallery — survives modal open/close within the same tab
let sessionPhotos: string[] = [];

// ── Component ────────────────────────────────────────────────────────────────
export function CoverImageModal({ isOpen, onClose, onSelect }: CoverImageModalProps) {
  const [tab, setTab] = useState<Tab>("stock");
  const [galleryState, setGalleryState] = useState<GalleryState>(
    sessionPhotos.length > 0 ? "photos" : "prompt"
  );
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>(sessionPhotos);

  const [photos, setPhotos] = useState<DupePhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setTab("stock");
    setSearch("");
    setError(false);
    loadFeed();
  }, [isOpen]);

  const loadFeed = () => {
    setLoading(true);
    setError(false);
    fetchDupePhotos()
      .then(setPhotos)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!value.trim()) { loadFeed(); return; }
    searchTimeout.current = setTimeout(() => {
      setLoading(true);
      setError(false);
      searchDupePhotos(value.trim())
        .then(setPhotos)
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }, 400);
  };

  const handleGalleryAccess = () => {
    galleryInputRef.current?.click();
  };

  const handleGalleryFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    const urls = files.map((f) => URL.createObjectURL(f));
    const merged = [...urls, ...sessionPhotos];
    sessionPhotos = merged;
    setGalleryPhotos(merged);
    setGalleryState("photos");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: "var(--color-overlay-scrim)" }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="fixed left-0 right-0 mx-auto max-w-[393px] bg-surface-primary flex flex-col rounded-tl-[16px] rounded-tr-[16px] z-50 animate-slide-up overflow-hidden"
        style={{ bottom: 0, height: "min(580px, calc(100vh - 32px))" }}
      >
        {/* Drag handle */}
        <div className="shrink-0 flex flex-col items-center pt-[20px] pb-[16px]">
          <div className="bg-surface-fill h-[5px] rounded-full w-[44px]" />
        </div>

        {/* Tab bar */}
        <div className="shrink-0 flex items-center gap-[4px] px-[20px] pb-[16px]">
          {(["stock", "gallery"] as Tab[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className="flex-1 py-[8px] rounded-[999px] font-primary text-[13px] leading-[18px] font-medium transition-colors capitalize"
              style={{
                backgroundColor: tab === id ? "var(--color-text-primary)" : "var(--color-surface-secondary)",
                color: tab === id ? "var(--color-text-invert)" : "var(--color-text-primary)",
              }}
            >
              {id === "stock" ? "Stock" : "My photos"}
            </button>
          ))}
        </div>

        {/* Hidden multi-file input */}
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={handleGalleryFiles}
        />

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-[20px] pb-[32px] flex flex-col gap-[12px]">

          {/* ── Stock tab ─────────────────────────────────────────── */}
          {tab === "stock" && (
            <>
              {/* Search bar */}
              <div className="border border-card-token flex items-center pl-[12px] py-[6px] rounded-[8px] w-full">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search a vibe, place, mood..."
                  className="flex-1 min-w-0 bg-transparent border-none outline-none font-primary text-[14px] leading-[16px] text-primary-token placeholder:text-secondary-token"
                />
                <div className="flex items-center justify-center size-[36px] shrink-0">
                  {search ? (
                    <button type="button" onClick={() => handleSearchChange("")}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
              </div>

              <p className="font-primary text-[12px] leading-[16px] text-secondary-token uppercase tracking-wider">
                {search.trim() ? `Results for "${search.trim()}"` : "Dupephotos"}
              </p>

              {loading && (
                <div className="grid grid-cols-4 gap-[8px]">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-[10px] animate-pulse"
                      style={{ backgroundColor: "var(--color-surface-secondary)" }} />
                  ))}
                </div>
              )}

              {error && (
                <div className="rounded-[10px] px-[14px] py-[12px]"
                  style={{ backgroundColor: "var(--color-surface-secondary)" }}>
                  <p className="font-primary text-[13px] leading-[18px] text-secondary-token">
                    Could not load photos. Check your connection and try again.
                  </p>
                </div>
              )}

              {!loading && !error && (
                <div className="grid grid-cols-4 gap-[8px]">
                  {photos.slice(0, 20).map((photo) => (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => { onSelect(`${DUPE_CDN}/photos/${photo.img_id}`); onClose(); }}
                      className="aspect-square rounded-[10px] overflow-hidden bg-surface-secondary active:scale-95 transition-transform"
                    >
                      <img
                        src={`${DUPE_CDN}/photos/${photo.img_preview_id}`}
                        alt={photo.username}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── Gallery tab ───────────────────────────────────────── */}
          {tab === "gallery" && (

            /* Permission prompt */
            galleryState === "prompt" ? (
              <div className="flex flex-col items-center justify-center flex-1 gap-[24px] py-[32px]">
                <div
                  className="flex items-center justify-center w-[72px] h-[72px] rounded-[24px]"
                  style={{ backgroundColor: "var(--color-surface-secondary)" }}
                >
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <rect x="4" y="8" width="28" height="22" rx="3" stroke="var(--color-text-primary)" strokeWidth="2" />
                    <circle cx="18" cy="19" r="6" stroke="var(--color-text-primary)" strokeWidth="2" />
                    <circle cx="18" cy="19" r="2.5" fill="var(--color-text-primary)" />
                    <path d="M13 8L15 5H21L23 8" stroke="var(--color-text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <div className="flex flex-col items-center gap-[8px] text-center px-[16px]">
                  <p className="font-primary text-[18px] leading-[24px] font-medium text-primary-token">
                    Access your photos
                  </p>
                  <p className="font-primary text-[14px] leading-[20px] text-secondary-token">
                    Allow Node to show photos from your device so you can set one as the cover.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGalleryAccess}
                  className="flex items-center justify-center h-[45px] px-[32px] rounded-[999px] font-primary text-[16px] leading-[21px] font-medium"
                  style={{ backgroundColor: "var(--color-button-secondary)", color: "var(--color-text-invert)" }}
                >
                  Allow access
                </button>
              </div>

            ) : (
              /* Photo grid */
              <div className="flex flex-col gap-[12px]">
                <div className="flex items-center justify-between">
                  <p className="font-primary text-[12px] leading-[16px] text-secondary-token uppercase tracking-wider">
                    Your photos
                  </p>
                  <button
                    type="button"
                    onClick={handleGalleryAccess}
                    className="font-primary text-[13px] leading-[18px] text-secondary-token"
                  >
                    Add more
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-[8px]">
                  {galleryPhotos.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { onSelect(src); onClose(); }}
                      className="aspect-square rounded-[10px] overflow-hidden bg-surface-secondary active:scale-95 transition-transform"
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}
