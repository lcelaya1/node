import { useState, useEffect, useRef } from "react";
import { CreateAccountBackButton } from "../components/CreateAccountBackButton";
import { InterestStackPlanCard } from "../components/InterestStackPlanCard";
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

const EMPTY_INTEREST_TAGS: readonly string[] = [];
const SWIPE_THRESHOLD = 80;
const FLY_DISTANCE = 500;
const MAX_PLANS = 5;
/** Pixels each successive back card shifts down from the one in front of it */
const STACK_OFFSET_Y = 8;
/** Scale reduction per step back in the stack */
const STACK_SCALE_STEP = 0.04;

function interestsForPlanIds(planIds: Iterable<string>): string[] {
  const merged = new Set<string>();
  for (const id of planIds) {
    for (const interest of ONBOARDING_PLAN_INTEREST_MAP[id] ?? []) {
      merged.add(interest);
    }
  }
  return [...merged];
}

export default function CreateProfileInterestsScreen({
  onBack,
  onContinue,
  onChange,
  value,
}: Props) {
  const interestDraftTags = value ?? EMPTY_INTEREST_TAGS; // used only for initial liked state
const [plans, setPlans] = useState<CatalogPlan[]>([]);
  const [swipeCount, setSwipeCount] = useState(0);
  const [likedPlanIds, setLikedPlanIds] = useState<Set<string>>(
    () => new Set(likedOnboardingPlanIdsFromInterests(interestDraftTags)),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [catalogRetryNonce, setCatalogRetryNonce] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [flyDirection, setFlyDirection] = useState<"left" | "right" | null>(null);
  const [justSwiped, setJustSwiped] = useState(false);
  const dragStartRef = useRef(0);
  const dragXRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    loadOnboardingPlans()
      .then((list) => {
        if (cancelled) return;
        const src = list.length > 0 ? list : getFallbackOnboardingPlans();
        setPlans(src.slice(0, MAX_PLANS));
      })
      .catch(() => {
        if (!cancelled) setPlans(getFallbackOnboardingPlans().slice(0, MAX_PLANS));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, [catalogRetryNonce]);

  useEffect(() => {
    setSwipeCount(0);
    setLikedPlanIds(likedOnboardingPlanIdsFromInterests(interestDraftTags));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalogRetryNonce]);

const isAnimating = flyDirection !== null;
  const hasCompletedAllCards = plans.length > 0 && swipeCount >= plans.length;
  const currentPlan = plans[swipeCount] ?? null;

  const likeFront = () => {
    if (!currentPlan || isSaving || isAnimating) return;
    setLikedPlanIds((prev) => {
      const next = new Set(prev);
      next.add(currentPlan.id);
      const payload = interestsForPlanIds(next);
      queueMicrotask(() => onChange?.(payload));
      return next;
    });
  };

  const flyOff = (direction: "left" | "right") => {
    if (isAnimating || isSaving || !currentPlan) return;
    setFlyDirection(direction);
    setTimeout(() => {
      setFlyDirection(null);
      setJustSwiped(true);
      setSwipeCount((c) => c + 1);
      dragXRef.current = 0;
      setDragX(0);
      requestAnimationFrame(() => requestAnimationFrame(() => setJustSwiped(false)));
    }, 300);
  };

  const swipeRight = () => { likeFront(); flyOff("right"); };
  const swipeLeft = () => { flyOff("left"); };

  const onDragStart = (clientX: number) => {
    if (isAnimating || isSaving || !currentPlan) return;
    dragStartRef.current = clientX;
    dragXRef.current = 0;
    setDragX(0);
    setIsDragging(true);
  };

  const onDragMove = (clientX: number) => {
    if (!isDragging || isAnimating) return;
    const delta = clientX - dragStartRef.current;
    dragXRef.current = Math.max(-300, Math.min(300, delta));
    setDragX(dragXRef.current);
  };

  const onDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const x = dragXRef.current;
    if (x > SWIPE_THRESHOLD) swipeRight();
    else if (x < -SWIPE_THRESHOLD) swipeLeft();
    else { dragXRef.current = 0; setDragX(0); }
  };

  const handleDone = async () => {
    if (isSaving) return;
    const interestsPayload = interestsForPlanIds(likedPlanIds);
    onChange?.(interestsPayload);
    setIsSaving(true);
    try {
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
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

  useEffect(() => {
    if (hasCompletedAllCards && !isSaving) {
      void handleDone();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCompletedAllCards]);

  const retryCatalog = () => {
    setSwipeCount(0);
    setCatalogRetryNonce((n) => n + 1);
  };

  const liveX = isAnimating
    ? flyDirection === "right" ? FLY_DISTANCE : -FLY_DISTANCE
    : dragX;
  const rotation = liveX * 0.08;
  const likeOpacity = Math.max(0, Math.min(1, liveX / 80));
  const nopeOpacity = Math.max(0, Math.min(1, -liveX / 80));

  /** Cards behind the front, from back-most to front-most (drawn back-first so front is on top) */
  const stackBehind = plans.slice(swipeCount + 1).reverse();
  /** Total extra height the stack adds at the bottom */
  const stackExtraH = stackBehind.length * STACK_OFFSET_Y;
  const CARD_H = 403;

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
    <div className="flex size-full flex-col bg-surface-primary pb-[32px]">
      <div className="flex flex-col gap-[20px] px-[24px] pt-[16px]">
        <CreateAccountBackButton onClick={onBack} />
        <div className="flex flex-col gap-[8px]">
          <p className="type-heading-xl text-primary-token">Select your interests</p>
          <p className="type-body-s text-secondary-token">
            Swipe right on plans that interest you, we&apos;ll use these to tailor your feed.
          </p>
        </div>
      </div>

      <div
        role="presentation"
        className="flex flex-1 min-h-0 flex-col items-center justify-center px-[24px] py-[16px] select-none touch-none overflow-hidden"
        onMouseDown={(e) => onDragStart(e.clientX)}
        onMouseMove={(e) => onDragMove(e.clientX)}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => { e.preventDefault(); onDragMove(e.touches[0].clientX); }}
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
          <div className="relative mx-auto w-[280px] flex-1 min-h-0" style={{ maxHeight: CARD_H + stackExtraH }}>
            {/* Stack of cards behind the front — rendered back-to-front */}
            {stackBehind.map((plan, revIdx) => {
              const depthFromFront = stackBehind.length - revIdx;
              const offsetY = depthFromFront * STACK_OFFSET_Y;
              const scale = 1 - depthFromFront * STACK_SCALE_STEP;
              return (
                <div
                  key={plan.id}
                  className="absolute inset-x-0 bottom-0"
                  style={{
                    top: offsetY,
                    transform: `scale(${scale})`,
                    transformOrigin: "top center",
                    zIndex: revIdx,
                  }}
                >
                  <InterestStackPlanCard
                    plan={plan}
                    liked={false}
                    showHeart={false}
                  />
                </div>
              );
            })}

            {/* Front card — draggable */}
            {currentPlan && (
              <div
                className="absolute inset-0"
                style={{
                  zIndex: stackBehind.length,
                  transform: `translateX(${liveX}px) rotate(${rotation}deg)`,
                  transformOrigin: "bottom center",
                  transition: isAnimating
                    ? "transform 0.3s ease"
                    : isDragging || justSwiped
                    ? "none"
                    : "transform 0.25s ease",
                  cursor: isDragging ? "grabbing" : "grab",
                }}
              >
<InterestStackPlanCard
                  plan={currentPlan}
                  liked={false}
                  showHeart={false}
                  heartDisabled={isAnimating || isSaving}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-[20px] px-[24px] pt-0">
        {plans.length > 0 && (
          <div className="flex items-center justify-center gap-[40px]">
            <button
              type="button"
              disabled={isAnimating || isSaving || !currentPlan}
              onClick={swipeLeft}
              className="flex h-[56px] w-[56px] items-center justify-center rounded-full border-[2px] border-card-token bg-surface-primary shadow-sm disabled:opacity-40"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18" stroke="#fc312e" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M6 6L18 18" stroke="#fc312e" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>

            <button
              type="button"
              disabled={isAnimating || isSaving || !currentPlan}
              onClick={swipeRight}
              className="flex h-[56px] w-[56px] items-center justify-center rounded-full border-[2px] border-card-token bg-surface-primary shadow-sm disabled:opacity-40"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M19 14C20.49 12.54 22 10.79 22 8.5C22 7.04 21.42 5.64 20.39 4.61C19.36 3.58 17.96 3 16.5 3C14.74 3 13.5 3.5 12 5C10.5 3.5 9.26 3 7.5 3C6.04 3 4.64 3.58 3.61 4.61C2.58 5.64 2 7.04 2 8.5C2 10.8 3.5 12.55 5 14L12 21L19 14Z"
                  fill="#fc312e"
                />
              </svg>
            </button>
          </div>
        )}

        <p aria-live="polite" className="text-center type-body-s text-secondary-token">
          {plans.length > 0
            ? `${Math.min(swipeCount + 1, plans.length)} / ${plans.length}`
            : "—"}
        </p>
      </div>
    </div>
  );
}
