import { useState, useEffect, useRef } from "react";
import { CreateAccountBackButton } from "../components/CreateAccountBackButton";
import {
  InterestStackPlanCard,
  INTEREST_STACK_CARD_H,
  INTEREST_STACK_CARD_W,
} from "../components/InterestStackPlanCard";
import { supabase } from "../lib/supabase";
import {
  type CatalogPlan,
  getFallbackOnboardingPlans,
  likedOnboardingPlanIdsFromInterests,
  loadOnboardingPlans,
  ONBOARDING_PLAN_INTEREST_MAP,
} from "../lib/planCatalog";

type Props = {
  value?: string[];
  onChange?: (value: string[]) => void;
  onBack?: () => void;
  onContinue?: () => void;
};

/** Stable fallback so `useEffect(..., [tags])` does not rerun every render when `value` is omitted */
const EMPTY_INTEREST_TAGS: readonly string[] = [];

const SCALE_BACK = 206 / INTEREST_STACK_CARD_W;

type StackFrame = { left: number; top: number; scale: number; opacity: number; z: number };

const POS_FRONT:  StackFrame = { left: 41,   top: 0,  scale: 1,         opacity: 1, z: 3 };
/** Card frame wrapper stays at opacity 1; card surface (incl. liked red) fades via `InterestStackPlanCard` `contentOpacity` */
const POS_BACK_R: StackFrame = { left: 140,  top: 39, scale: SCALE_BACK, opacity: 1, z: 2 };
const POS_BACK_L: StackFrame = { left: 0,    top: 39, scale: SCALE_BACK, opacity: 1, z: 1 };

const SIDE_CARD_CONTENT_OPACITY = 0.2;
const POS_ENTER:  StackFrame = { left: -220, top: 39, scale: SCALE_BACK, opacity: 0, z: 0 };
/** Fifth plan: fixed slot off-canvas (order in `plans[]` never permutes — only roles change). */
const POS_HIDDEN: StackFrame = { left: -420, top: 39, scale: SCALE_BACK, opacity: 0, z: -1 };

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function lerpFrame(from: StackFrame, to: StackFrame, t: number): StackFrame {
  return {
    left:    lerp(from.left,    to.left,    t),
    top:     lerp(from.top,     to.top,     t),
    scale:   lerp(from.scale,   to.scale,   t),
    opacity: lerp(from.opacity, to.opacity, t),
    z:       Math.round(lerp(from.z, to.z, t)),
  };
}

function stackedUnderPeekFrame(peekPose: StackFrame, p: number): StackFrame {
  return {
    left: peekPose.left,
    top: peekPose.top,
    scale: peekPose.scale,
    opacity: 1,
    z: Math.round(lerp(0, peekPose.z, p)),
  };
}

/** Left/right peeks ~20 % (opaque shell + dimmed content avoids “solid white slab” when opacity was 0). */
function peekInnerOpacity(
  idx: number,
  role: StackRole,
  gestureMode: "forward" | "backward",
  p: number,
  centerIndex: number,
  deckSize: number,
): number {
  const t = Math.max(0, Math.min(1, p));
  const ixLeft = mod(centerIndex - 1, deckSize);
  const ixRight = mod(centerIndex + 1, deckSize);
  const ixNextRightPeek = mod(centerIndex + 2, deckSize);
  const ixNextLeftPeek = mod(centerIndex - 2, deckSize);

  if (role === "front") {
    return lerp(1, SIDE_CARD_CONTENT_OPACITY, t);
  }

  const fadingLeft = gestureMode === "forward" && idx === ixLeft && role === "left";
  if (fadingLeft) return lerp(SIDE_CARD_CONTENT_OPACITY, 0, t);

  const fadingRight = gestureMode === "backward" && idx === ixRight && role === "right";
  if (fadingRight) return lerp(SIDE_CARD_CONTENT_OPACITY, 0, t);

  if (gestureMode === "forward" && role === "right") return lerp(SIDE_CARD_CONTENT_OPACITY, 1, t);
  if (gestureMode === "backward" && role === "left") return lerp(SIDE_CARD_CONTENT_OPACITY, 1, t);

  if (role === "left" || role === "right") return SIDE_CARD_CONTENT_OPACITY;

  /** Stacked successor for right peek: same faint read as peek (not invisible → white matte) */
  if (gestureMode === "forward" && idx === ixNextRightPeek && role === "hidden") {
    return SIDE_CARD_CONTENT_OPACITY;
  }

  /** Stacked successor for left peek (backward reveal) */
  if (
    gestureMode === "backward" &&
    idx === ixNextLeftPeek &&
    (role === "hidden" || role === "enter")
  ) {
    return SIDE_CARD_CONTENT_OPACITY;
  }

  return 1;
}

/** Peek card leaves in place — wrapper opacity irrelevant; fade is via `peekInnerOpacity` */
function fadeOutAtPeekFrame(peekPose: StackFrame, p: number): StackFrame {
  return {
    left: peekPose.left,
    top: peekPose.top,
    scale: peekPose.scale,
    opacity: 1,
    z: peekPose.z,
  };
}

/**
 * Left drag (+1 index): centre → left peek; old right → centre; left peek fades out in place;
 * the next **right** peek sits under the current right peek, then settles as top of that peek.
 */
function stackFramesForward(p: number) {
  return {
    pos0: lerpFrame(POS_FRONT,  POS_BACK_L, p),
    pos1: lerpFrame(POS_BACK_R, POS_FRONT, p),
    /** Unused — left/right cross-fade handled in frameForPlanAtIndex */
    pos2: lerpFrame(POS_BACK_L, POS_BACK_L, p),
    pos3: lerpFrame(POS_ENTER, POS_ENTER, p),
  };
}

/**
 * Right drag (−1 index): symmetric — centre → right peek; old left → centre; right peek fades out in place;
 * the next **left** peek sits **under** the current left peek, then settles as top of that peek.
 */
function stackFramesBackward(p: number) {
  return {
    pos0: lerpFrame(POS_FRONT,  POS_BACK_R, p),
    /** Unused — incoming left handled per index */
    pos1: lerpFrame(POS_BACK_R, POS_BACK_R, p),
    pos2: lerpFrame(POS_BACK_L, POS_FRONT, p),
    pos3: lerpFrame(POS_ENTER, POS_ENTER, p),
  };
}

function interestsForPlanIds(planIds: Iterable<string>): string[] {
  const merged = new Set<string>();
  for (const id of planIds) {
    for (const interest of ONBOARDING_PLAN_INTEREST_MAP[id] ?? []) {
      merged.add(interest);
    }
  }
  return [...merged];
}

function mod(i: number, n: number) {
  return ((i % n) + n) % n;
}

/** `currentIndex` is front; Done unlocks once every deck position has been centred at least once. */
function allPlansVisited(deckSize: number, visited: ReadonlySet<number>): boolean {
  if (deckSize <= 0) return false;
  for (let k = 0; k < deckSize; k++) {
    if (!visited.has(k)) return false;
  }
  return true;
}

type StackRole = "front" | "left" | "right" | "enter" | "hidden";

/** Which visual slot holds `plans[idx]` for this gesture state (carousel order preserved in array). */
function stackRoleForIndex(
  idx: number,
  ixFront: number,
  ixLeft: number,
  ixRight: number,
  ixEnter: number,
): StackRole {
  if (idx === ixFront) return "front";
  if (idx === ixLeft) return "left";
  if (idx === ixRight) return "right";
  if (idx === ixEnter) return "enter";
  return "hidden";
}

function frameForPlanAtIndex(
  idx: number,
  role: StackRole,
  p: number,
  gestureMode: "forward" | "backward",
  centerIndex: number,
  deckSize: number,
): StackFrame {
  const ixEnter = mod(centerIndex + 3, deckSize);
  const ixLeft = mod(centerIndex - 1, deckSize);
  const ixRight = mod(centerIndex + 1, deckSize);
  /** After +1 centre, next right peek (`currentIndex + 2`); that plan starts in the lone `hidden` role for a 5-slot ring */
  const ixNextRightPeek = mod(centerIndex + 2, deckSize);
  const ixNextLeftPeek = mod(centerIndex - 2, deckSize);

  if (gestureMode === "forward") {
    if (idx === ixLeft && role === "left") {
      return fadeOutAtPeekFrame(POS_BACK_L, p);
    }
    if (idx === ixNextRightPeek && role === "hidden") {
      return stackedUnderPeekFrame(POS_BACK_R, p);
    }
  } else {
    if (idx === ixRight && role === "right") {
      return fadeOutAtPeekFrame(POS_BACK_R, p);
    }
    /** Next left peek emerges from beneath the current left peek (hidden or enter lane) */
    if (idx === ixNextLeftPeek && (role === "hidden" || role === "enter")) {
      return stackedUnderPeekFrame(POS_BACK_L, p);
    }
  }

  if (role === "hidden") {
    return POS_HIDDEN;
  }

  const f = gestureMode === "forward" ? stackFramesForward(p) : stackFramesBackward(p);
  switch (role) {
    case "front":
      return f.pos0;
    case "right":
      return f.pos1;
    case "left":
      return f.pos2;
    case "enter":
      return f.pos3;
    default:
      return POS_HIDDEN;
  }
}

export default function CreateProfileInterestsScreen({
  onBack,
  onContinue,
  onChange,
  value,
}: Props) {
  const interestDraftTags = value ?? EMPTY_INTEREST_TAGS;
  const [plans, setPlans] = useState<CatalogPlan[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedPlanIds, setLikedPlanIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [catalogRetryNonce, setCatalogRetryNonce] = useState(0);
  const [visitedFrontIndices, setVisitedFrontIndices] = useState<Set<number>>(() => new Set());
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [snapProgress, setSnapProgress] = useState<number | null>(null);
  /** Active gesture archetype once committed to snap (`null` uses drag sign live) */
  const [snapMode, setSnapMode] = useState<"forward" | "backward" | null>(null);
  const dragStartRef = useRef(0);
  const dragXRef = useRef(0);
  /** Avoid stale `plans.length` inside snap timeouts */
  const plansLengthRef = useRef(0);
  plansLengthRef.current = plans.length;

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    loadOnboardingPlans()
      .then((list) => {
        if (cancelled) return;
        setPlans(list.length > 0 ? list : getFallbackOnboardingPlans());
      })
      .catch(() => {
        if (!cancelled) setPlans(getFallbackOnboardingPlans());
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [catalogRetryNonce]);

  useEffect(() => {
    setLikedPlanIds(likedOnboardingPlanIdsFromInterests(interestDraftTags));
  }, [interestDraftTags]);

  useEffect(() => {
    if (plans.length === 0) return;
    setCurrentIndex((prev) => mod(prev, plans.length));
  }, [plans.length]);

  /** New deck or catalog retry: only the current front counts until the user swipes again. */
  useEffect(() => {
    if (plans.length === 0) {
      setVisitedFrontIndices(new Set());
      return;
    }
    setVisitedFrontIndices(new Set([mod(currentIndex, plans.length)]));
  }, [plans.length, catalogRetryNonce]);

  /** Record each plan once it has been the centred card. */
  useEffect(() => {
    if (plans.length === 0) return;
    const front = mod(currentIndex, plans.length);
    setVisitedFrontIndices((prev) => {
      if (prev.has(front)) return prev;
      const next = new Set(prev);
      next.add(front);
      return next;
    });
  }, [currentIndex, plans.length]);

  const total = Math.max(plans.length, 1);

  /**
   * Carousel from fixed `plans` order [0 … n−1]: center = currentIndex, left = −1, right = +1 (mod n),
   * enter = incoming from +3, one index hidden — same five cards every time; only slot assignment changes.
   */
  const ixEnter = mod(currentIndex + 3, total);
  const ixLeft = mod(currentIndex - 1, total);
  const ixRight = mod(currentIndex + 1, total);
  const ixFront = mod(currentIndex, total);

  const currentPlan = plans[ixFront];

  const hasCompletedCarouselRound =
    plans.length > 0 && allPlansVisited(plans.length, visitedFrontIndices);

  const pRaw = snapProgress !== null ? snapProgress : Math.max(0, Math.min(1, Math.abs(dragX) / 150));
  const gestureMode: "forward" | "backward" =
    snapMode ?? (dragX > 0 ? "backward" : "forward");

  const isAnimating = snapProgress !== null;
  const layoutTransition = "left 0.35s ease, top 0.35s ease, transform 0.35s ease, opacity 0.35s ease";
  const cardPositionTransition = snapProgress !== null ? layoutTransition : "none";

  const stackCardStyle = (pos: StackFrame) =>
    ({
      left: pos.left,
      top: pos.top,
      width: INTEREST_STACK_CARD_W,
      height: INTEREST_STACK_CARD_H,
      opacity: pos.opacity,
      zIndex: pos.z,
      transform: `scale(${pos.scale})`,
      transformOrigin: "top left",
      transition: cardPositionTransition,
    }) as const;

  const commitSnapForward = () => {
    setSnapMode("forward");
    setSnapProgress(1);
    setTimeout(() => {
      setSnapProgress(null);
      setSnapMode(null);
      dragXRef.current = 0;
      setDragX(0);
      setCurrentIndex((prev) =>
        mod(prev + 1, Math.max(plansLengthRef.current, 1)),
      );
    }, 350);
  };

  const commitSnapBackward = () => {
    setSnapMode("backward");
    setSnapProgress(1);
    setTimeout(() => {
      setSnapProgress(null);
      setSnapMode(null);
      dragXRef.current = 0;
      setDragX(0);
      setCurrentIndex((prev) =>
        mod(prev - 1, Math.max(plansLengthRef.current, 1)),
      );
    }, 350);
  };

  const toggleLikeForCurrentPlan = () => {
    if (!currentPlan || isSaving || snapProgress !== null) return;
    setLikedPlanIds((prev) => {
      const next = new Set(prev);
      if (next.has(currentPlan.id)) {
        next.delete(currentPlan.id);
      } else {
        next.add(currentPlan.id);
      }
      const payload = interestsForPlanIds(next);
      queueMicrotask(() => onChange?.(payload));
      return next;
    });
  };

  const onDragStart = (clientX: number) => {
    if (snapProgress !== null || isSaving) return;
    dragStartRef.current = clientX;
    dragXRef.current = 0;
    setDragX(0);
    setIsDragging(true);
  };

  const onDragMove = (clientX: number) => {
    if (!isDragging || snapProgress !== null) return;
    const delta = clientX - dragStartRef.current;
    const clamped = Math.max(-280, Math.min(280, delta));
    dragXRef.current = clamped;
    setDragX(clamped);
  };

  const onDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const x = dragXRef.current;
    if (x > 80) {
      commitSnapBackward();
    } else if (x < -80) {
      commitSnapForward();
    } else {
      dragXRef.current = 0;
      setDragX(0);
    }
  };

  const handleDone = async () => {
    if (isSaving) return;
    const interestsPayload = interestsForPlanIds(likedPlanIds);
    onChange?.(interestsPayload);
    setIsSaving(true);
    try {
      if (supabase) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from("profiles")
            .upsert({ id: user.id, interests: interestsPayload }, { onConflict: "id" });
        }
      }
      onContinue?.();
    } finally {
      setIsSaving(false);
    }
  };

  const retryCatalog = () => setCatalogRetryNonce((n) => n + 1);

  if (isLoading) {
    return (
      <div className="flex size-full flex-col bg-surface-primary">
        <div className="px-[24px] pt-[16px]">
          <CreateAccountBackButton onClick={onBack} />
        </div>
        <div className="flex flex-1 items-center justify-center px-[24px]">
          <p className="type-body-s text-secondary-token">Loading plans…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex size-full flex-col bg-surface-primary pb-[40px]">
      <div className="flex flex-col gap-[20px] px-[24px] pt-[16px]">
        <CreateAccountBackButton onClick={onBack} />
        <div className="flex flex-col gap-[8px]">
          <p className="type-heading-l text-primary-token">Select your interests.</p>
          <p className="type-body-m text-secondary-token">
            Heart the plans that interest you the most, we&apos;ll use these to tailor your feed.
          </p>
        </div>
      </div>

      <div
        role="presentation"
        className="flex flex-1 items-center justify-center px-[24px] select-none touch-none"
        onMouseDown={(e) => plans.length > 0 && onDragStart(e.clientX)}
        onMouseMove={(e) => onDragMove(e.clientX)}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        onTouchStart={(e) => plans.length > 0 && onDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => {
          if (plans.length === 0) return;
          e.preventDefault();
          onDragMove(e.touches[0].clientX);
        }}
        onTouchEnd={onDragEnd}
      >
        {plans.length === 0 ? (
          <div className="flex max-w-[320px] flex-col items-center gap-[16px] text-center">
            <p className="type-body-s text-secondary-token">
              We couldn&apos;t load plans. Check your connection and try again.
            </p>
            <button
              type="button"
              onClick={retryCatalog}
              className="type-label-m rounded-[999px] bg-button-primary px-[24px] py-[10px] text-invert-token"
            >
              Retry
            </button>
          </div>
        ) : (
          <div
            aria-label={`Plan carousel, card ${currentIndex + 1} of ${plans.length}`}
            className="relative shrink-0 w-[346px] h-[403px]"
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
          >
            {/* key=plan.id: each deck position keeps the same card content while roles (front/left/right/enter/hidden) change */}
            {plans.map((plan, idx) => {
              const role = stackRoleForIndex(idx, ixFront, ixLeft, ixRight, ixEnter);
              const pos = frameForPlanAtIndex(idx, role, pRaw, gestureMode, currentIndex, total);
              const isFrontCard = role === "front";
              return (
                <div
                  key={plan.id}
                  aria-hidden={role === "hidden"}
                  className="absolute"
                  style={{
                    ...stackCardStyle(pos),
                    pointerEvents: role === "hidden" ? "none" : "auto",
                  }}
                >
                  <InterestStackPlanCard
                    plan={plan}
                    liked={likedPlanIds.has(plan.id)}
                    showHeart={isFrontCard}
                    onHeartClick={isFrontCard ? toggleLikeForCurrentPlan : undefined}
                    heartDisabled={isAnimating || isSaving}
                    contentOpacity={peekInnerOpacity(idx, role, gestureMode, pRaw, currentIndex, total)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-[20px] px-[24px] pt-0">
        <p
          aria-live="polite"
          className="text-center font-['ABC_Monument_Grotesk_Unlicensed_Trial:Regular',sans-serif] text-[14px] leading-[18px] text-[#09090b]"
        >
          {plans.length > 0 ? `${currentIndex + 1}/${plans.length}` : "—"}
        </p>
        <button
          type="button"
          disabled={isSaving || !hasCompletedCarouselRound || plans.length === 0}
          onClick={handleDone}
          className="flex w-full items-center justify-center rounded-[999px] bg-button-primary px-[32px] py-[12px] type-label-m text-invert-token disabled:bg-surface-fill disabled:opacity-40"
        >
          Done
        </button>
      </div>
    </div>
  );
}
