import { useCallback, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { FlowScreenHeader } from "../components/FlowScreenHeader";

const ratingLabels = ["Terrible", "Not great", "It was okay", "Pretty good", "Amazing!"];
const ratingEmojis = ["🥱", "😐", "🙂", "😁", "😍"];

// Arc slot positions (x offset from center, y from top, size in px, opacity)
// Derived from the fixed arc design so each slot looks natural on the circle
const arcSlots: Record<number, { x: number; top: number; size: number; opacity: number }> = {
  [-2]: { x: -175, top: 113, size: 50, opacity: 0.4 },
  [-1]: { x: -110.5, top: 51, size: 64, opacity: 0.4 },
  [0]:  { x: 0,      top: 8,  size: 100, opacity: 1   },
  [1]:  { x: 110.5,  top: 51, size: 64, opacity: 0.4 },
  [2]:  { x: 175,    top: 113, size: 50, opacity: 0.4 },
};


function InfoContent() {
  return (
    <div className="flex w-full flex-col items-start gap-[8px]">
      <p className="w-full font-primary text-[24px] leading-[28px] text-primary-token">
        Did we nail it?
      </p>
      <p className="w-full type-body-s text-secondary-token">
        Tell us if this plan matched your vibe so we can keep finding the perfect spots for you.
      </p>
    </div>
  );
}

export default function PlanRatingScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [rating, setRating] = useState(2);

  const goToPlanReviews = useCallback((includeRating: boolean) => {
    navigate("/plan-reviews", {
      state: {
        ...(location.state as Record<string, unknown> | null),
        ...(includeRating
          ? {
              overallLabel: ratingLabels[rating],
              overallRating: rating,
            }
          : {
              overallLabel: undefined,
              overallRating: undefined,
            }),
      },
    });
  }, [location.state, navigate, rating]);

  const progressWidth = useMemo(() => `${(rating / 4) * 100}%`, [rating]);

  // Two-phase animation: snap wrapping emoji to bottom, then let it rise to its slot
  const prevRatingRef = useRef(rating);
  const [snapState, setSnapState] = useState<{ index: number; x: number } | null>(null);

  const updateRating = useCallback((newRating: number) => {
    const prev = prevRatingRef.current;
    if (newRating === prev) return;
    const delta = newRating - prev;

    if (Math.abs(delta) === 1) {
      // Find the one emoji that will "wrap" around the circle
      const wrappingIdx = delta === 1
        ? (prev + 3) % 5   // was at relPos=-2, will land at relPos=+2 → comes from bottom-right
        : (prev + 2) % 5;  // was at relPos=+2, will land at relPos=-2 → comes from bottom-left
      const bottomX = delta === 1 ? 175 : -175;

      // Phase 1: instantly teleport wrapping emoji below the visible container
      setSnapState({ index: wrappingIdx, x: bottomX });

      // Phase 2: one frame later, update rating + clear snap so emoji transitions up from bottom
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          prevRatingRef.current = newRating;
          setRating(newRating);
          setSnapState(null);
        });
      });
    } else {
      prevRatingRef.current = newRating;
      setRating(newRating);
    }
  }, []);

  return (
    <div className="flex size-full flex-col gap-[36px] bg-surface-primary px-[20px] pb-[16px] pt-[32px]">
      <FlowScreenHeader
        onBack={() => navigate(-1)}
        onSkip={() => goToPlanReviews(false)}
      />

      <div className="flex min-h-0 flex-1 items-start justify-center">
        <div className="flex w-full flex-col items-center">
          <InfoContent />

          {/* Emoji arc — rotates so selected emoji is always at center */}
          <div className="relative mt-[48px] w-full" style={{ height: "163px" }}>
            {ratingEmojis.map((emoji, index) => {
              const mod5 = ((index - rating) % 5 + 5) % 5;
              const relPos = mod5 > 2 ? mod5 - 5 : mod5;
              const isSnapping = snapState?.index === index;

              // During snap phase: place emoji off-screen below (no transition)
              const slot = isSnapping
                ? { x: snapState.x, top: 280, size: 50, opacity: 0 }
                : arcSlots[relPos];

              return (
                <div
                  key={emoji}
                  className="absolute cursor-pointer"
                  style={{
                    left: "50%",
                    top: 0,
                    width: `${slot.size}px`,
                    height: `${slot.size}px`,
                    opacity: slot.opacity,
                    transform: `translateX(calc(-50% + ${slot.x}px)) translateY(${slot.top}px)`,
                    transition: isSnapping ? "none" : "all 300ms ease-out",
                  }}
                  onClick={() => updateRating(index)}
                >
                  <span
                    className="flex size-full items-center justify-center leading-none"
                    style={{ fontSize: `${slot.size}px` }}
                  >
                    {emoji}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="-mt-[40px] flex w-full flex-col items-center gap-[24px]">
            <div className="rounded-[999px] border border-card-token px-[16px] py-[8px]">
              <p className="text-[12px] leading-[16px] text-primary-token">{ratingLabels[rating]}</p>
            </div>

            <div className="relative w-full pt-[12px]">
              <div className="h-[10px] w-full rounded-[999px] bg-surface-secondary" />
              <div
                className="absolute left-0 top-[12px] h-[10px] rounded-[999px] bg-button-secondary transition-all duration-300"
                style={{ width: progressWidth }}
              />
              <div
                className="absolute top-0 size-[34px] -translate-x-1/2 rounded-full border border-card-token bg-surface-primary shadow-sm transition-all duration-300"
                style={{ left: `calc(${progressWidth} + ${17 - (rating / 4) * 34}px)` }}
              />
              <input
                type="range"
                min={0}
                max={4}
                step={1}
                value={rating}
                onChange={(event) => updateRating(Number(event.target.value))}
                className="absolute inset-x-0 top-0 z-10 h-[44px] w-full cursor-pointer opacity-0"
                aria-label="Rate the plan"
                style={{ touchAction: "pan-x" }}
              />
            </div>
          </div>

        </div>
      </div>

      <button
        type="button"
        onClick={() => goToPlanReviews(true)}
        className="flex h-[45px] w-full items-center justify-center rounded-[999px] bg-button-primary"
      >
        <span className="type-body-m text-invert-token">Continue</span>
      </button>
    </div>
  );
}
