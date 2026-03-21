import { useEffect, useState } from "react";


type WhereModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (location: string) => void;
  initialValue?: string;
};

export function WhereModal({ isOpen, onClose, onSelect, initialValue = "" }: WhereModalProps) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset query when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery(initialValue);
      setSuggestions([]);
      setError("");
    }
  }, [isOpen, initialValue]);

  // Google Places autocomplete
  useEffect(() => {
    if (!isOpen) return;

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const trimmed = query.trim();

    if (!trimmed || trimmed.length < 3) {
      setSuggestions([]);
      setError("");
      setLoading(false);
      return;
    }

    if (!apiKey) {
      setSuggestions([]);
      setError("Add VITE_GOOGLE_MAPS_API_KEY to enable live search.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask": "suggestions.placePrediction.text.text",
          },
          body: JSON.stringify({
            input: trimmed,
            languageCode: "en",
            includedPrimaryTypes: ["establishment"],
          }),
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Location search failed");

        const data = (await response.json()) as {
          suggestions?: Array<{ placePrediction?: { text?: { text?: string } } }>;
        };

        const results =
          data.suggestions
            ?.map((item) => item.placePrediction?.text?.text?.trim() ?? "")
            .filter(Boolean) ?? [];

        setSuggestions(results);
        if (!results.length) setError("No locations found.");
      } catch (err) {
        if (controller.signal.aborted) return;
        setSuggestions([]);
        setError("Could not load locations right now.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [query, isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-[rgba(24,24,32,0.4)] z-40"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="fixed left-0 right-0 mx-auto max-w-[393px] bg-[#f3f3f3] flex flex-col pb-[32px] pt-[20px] px-[20px] rounded-tl-[16px] rounded-tr-[16px] z-50 animate-slide-up"
        style={{ bottom: 0, height: "min(640px, calc(100vh - 20px))" }}
      >

        {/* Header */}
        <div className="flex flex-col gap-[12px] items-start w-full shrink-0">
          <div className="flex flex-col gap-[16px] items-center w-full">
            {/* Handle */}
            <div className="bg-[#667085] h-[5px] rounded-full w-[44px]" />

            {/* Title row */}
            <div className="flex items-center justify-between w-full">
              <p className="font-['Milling_Trial:Triplex_1mm',sans-serif] text-[28px] leading-[36px] tracking-[-0.56px] text-[#09090b]">
                Where
              </p>

              {/* Confirm button */}
              <button
                type="button"
                onClick={onClose}
                className="bg-[#fc312e] flex items-center justify-center p-[10px] rounded-[999px] shrink-0"
                aria-label="Confirm"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 14.925L7.2 19.125L21.2 5.125"
                    stroke="#fefefe"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Search input */}
          <input
            type="text"
            placeholder="Search a bar, restaurant, venue..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[16px] leading-[21px] text-[#09090b] placeholder:text-[rgba(0,0,0,0.5)] bg-transparent border-none outline-none w-full"
          />
        </div>

        {/* Divider */}
        <div className="bg-[#e4e4e7] h-px w-full mt-[12px] shrink-0" />

        {/* Results */}
        <div className="flex-1 overflow-y-auto mt-[4px]">
          {loading && (
            <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[20px] text-[rgba(0,0,0,0.5)] py-[14px]">
              Searching...
            </p>
          )}

          {!loading && error && (
            <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[20px] text-[rgba(0,0,0,0.5)] py-[14px]">
              {error}
            </p>
          )}

          {!loading && !error && suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => { onSelect(suggestion); onClose(); }}
              className="border-b border-[#e4e4e7] py-[14px] text-left w-full font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[20px] text-[#09090b]"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
