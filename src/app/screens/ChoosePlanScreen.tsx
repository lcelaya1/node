import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { PlanCard } from "../components/PlanCard";
import { savePlan, toSavedPlan } from "../lib/plans";
import {
  loadMatchedCatalogPlans,
  type CatalogPlan,
  type JoinFilterState,
} from "../lib/planCatalog";
import {
  getChatParticipants,
  getPlanCreatorForIndex,
  loadDemoUsers,
  type DemoUser,
} from "../lib/demoUsers";

type ChoosePlanLocationState = {
  filters?: JoinFilterState;
  selectedIndex?: number;
};

// ── Main screen ───────────────────────────────────────────────────────────────
export default function ChoosePlanScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as ChoosePlanLocationState | null) ?? null;
  const initialIndex =
    typeof state?.selectedIndex === "number"
      ? state.selectedIndex ?? 0
      : 0;
  const filters = state?.filters;
  const [current, setCurrent] = useState(initialIndex);
  const [dragOffset, setDragOffset] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(393);
  const [isDragging, setIsDragging] = useState(false);
  const [plans, setPlans] = useState<CatalogPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [demoUsers, setDemoUsers] = useState<DemoUser[]>([]);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragStartXRef = useRef<number | null>(null);
  const dragPointerIdRef = useRef<number | null>(null);
  const dragMovedRef = useRef(false);
  const suppressClickRef = useRef(false);
  const total = plans.length;
  const CARD_WIDTH = 309;
  const CARD_GAP = 20;
  const SWIPE_THRESHOLD = 60;
  const CARD_SPAN = CARD_WIDTH + CARD_GAP;

  useEffect(() => {
    let active = true;

    const run = async () => {
      const users = await loadDemoUsers();
      if (!active) return;
      setDemoUsers(users);
    };

    void run();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (!filters) {
        setPlans([]);
        setErrorMessage("Start from the join filters first so we can match plans for you.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const nextPlans = await loadMatchedCatalogPlans(filters);
        if (!active) return;

        setPlans(nextPlans);
        setCurrent((prev) => Math.max(0, Math.min(nextPlans.length - 1, prev)));
      } catch (error) {
        if (!active) return;

        setPlans([]);
        setErrorMessage(
          error instanceof Error ? error.message : "We couldn't load plans right now.",
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, [filters]);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;

    const updateWidth = () => setViewportWidth(node.clientWidth || 393);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const clampIndex = (value: number) => Math.max(0, Math.min(total - 1, value));

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    dragStartXRef.current = event.touches[0]?.clientX ?? null;
    dragMovedRef.current = false;
    setIsDragging(true);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (dragStartXRef.current === null) return;

    const nextOffset = event.touches[0].clientX - dragStartXRef.current;
    if (Math.abs(nextOffset) > 6) {
      dragMovedRef.current = true;
    }
    const atStart = current === 0 && nextOffset > 0;
    const atEnd = current === total - 1 && nextOffset < 0;

    setDragOffset((atStart || atEnd) ? nextOffset * 0.35 : nextOffset);
  };

  const finalizeDrag = () => {
    if (dragOffset <= -SWIPE_THRESHOLD) {
      setCurrent((prev) => clampIndex(prev + 1));
    } else if (dragOffset >= SWIPE_THRESHOLD) {
      setCurrent((prev) => clampIndex(prev - 1));
    }

    suppressClickRef.current = dragMovedRef.current;
    dragStartXRef.current = null;
    dragPointerIdRef.current = null;
    dragMovedRef.current = false;
    setDragOffset(0);
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    finalizeDrag();
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;

    dragPointerIdRef.current = event.pointerId;
    dragStartXRef.current = event.clientX;
    dragMovedRef.current = false;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    if (dragPointerIdRef.current !== event.pointerId || dragStartXRef.current === null) return;

    const nextOffset = event.clientX - dragStartXRef.current;
    if (Math.abs(nextOffset) > 6) {
      dragMovedRef.current = true;
    }

    const atStart = current === 0 && nextOffset > 0;
    const atEnd = current === total - 1 && nextOffset < 0;

    setDragOffset((atStart || atEnd) ? nextOffset * 0.35 : nextOffset);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    if (dragPointerIdRef.current !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    finalizeDrag();
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    if (dragPointerIdRef.current !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    finalizeDrag();
  };

  const baseOffset = (viewportWidth - CARD_WIDTH) / 2;
  const trackTranslateX = baseOffset - current * CARD_SPAN + dragOffset;
  const fractionalIndex = current - dragOffset / CARD_SPAN;
  const currentPlan = plans[current];
  const matchLabel = useMemo(() => {
    if (!currentPlan?.matchScore) return "Matched for your filters";

    const normalizedScore = Math.max(55, Math.min(99, 65 + currentPlan.matchScore * 8));
    return `${normalizedScore}% match`;
  }, [currentPlan?.matchScore]);

  const getCardTransform = (index: number) => {
    const distance = index - fractionalIndex;
    const clampedDistance = Math.max(-1, Math.min(1, distance));
    const rotation = clampedDistance * 2;
    const verticalOffset = Math.min(Math.abs(distance), 1) * 10;

    return `translateY(${verticalOffset}px) rotate(${rotation}deg)`;
  };

  const handleJoinPlan = async (plan: CatalogPlan, index: number) => {
    const creator = getPlanCreatorForIndex(demoUsers, index);
    const participants = getChatParticipants(demoUsers, creator);
    const savedPlan = toSavedPlan(
      {
        budget: plan.budget,
        creator,
        id: plan.id,
        description: plan.description,
        participants,
        title: plan.title,
        when: plan.when,
        whenDate: plan.eventDate,
        whenTime: plan.startTime,
        where: plan.location,
      },
      plan.imageSrc,
    );

    await savePlan(savedPlan);

    navigate("/", {
      state: { planId: savedPlan.id, selectedIndex: index },
    });
  };

  return (
    <div className="bg-surface-primary relative size-full overflow-hidden">

      {/* Header */}
      <div className="absolute flex items-center justify-between left-0 right-0 px-[20px] top-[32px] whitespace-nowrap">
        <p className="font-primary text-[20px] leading-[24px] font-medium text-primary-token">
          Choose a plan
        </p>
        <p className="font-primary text-[12px] leading-[16px] text-primary-token">
          {current + 1} of {total}
        </p>
      </div>

      <div
        ref={viewportRef}
        className={`absolute left-0 right-0 top-[80px] h-[481px] overflow-visible touch-pan-y ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        onPointerCancel={handlePointerCancel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
      >
        <div
          className="flex items-start"
          style={{
            gap: `${CARD_GAP}px`,
            transform: `translateX(${trackTranslateX}px)`,
            transition: isDragging ? "none" : "transform 240ms cubic-bezier(0.22, 1, 0.36, 1)",
            width: `${total * CARD_WIDTH + (total - 1) * CARD_GAP}px`,
          }}
        >
          {plans.map((item, index) => (
            <div
              key={item.id}
              className="shrink-0"
              style={{
                transform: getCardTransform(index),
                transformOrigin: "center bottom",
                transition: isDragging ? "none" : "transform 240ms cubic-bezier(0.22, 1, 0.36, 1)",
                zIndex: total - Math.min(total - 1, Math.round(Math.abs(index - fractionalIndex))),
              }}
            >
              {(() => {
                const creator = getPlanCreatorForIndex(demoUsers, index);
                const participants = getChatParticipants(demoUsers, creator);

                return (
              <PlanCard
                title={item.title}
                date={item.when}
                location={item.location}
                imageSrc={item.imageSrc}
                onClick={() => {
                  if (suppressClickRef.current) {
                    suppressClickRef.current = false;
                    return;
                  }

                  navigate("/info-plan", {
                    state: {
                      plan: {
                        ...item,
                        creator,
                      },
                      imageSrc: item.imageSrc,
                      participants,
                      selectedIndex: index,
                      filters,
                    },
                  });
                }}
                showButton={index === current}
                onJoin={() => void handleJoinPlan(item, index)}
              />
                );
              })()}
            </div>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="absolute inset-x-[20px] top-[220px] rounded-[24px] border border-card-token bg-surface-primary px-[24px] py-[32px] text-center">
          <p className="type-heading-m text-primary-token">Finding the best plans for you...</p>
        </div>
      ) : null}

      {!isLoading && plans.length === 0 ? (
        <div className="absolute inset-x-[20px] top-[220px] rounded-[24px] border border-card-token bg-surface-primary px-[24px] py-[32px] text-center">
          <p className="type-heading-m text-primary-token">No plans found</p>
          <p className="mt-[8px] type-body-s text-secondary-token">
            {errorMessage || "Try changing the filters and search again."}
          </p>
          <button
            type="button"
            onClick={() => navigate("/join-plan")}
            className="mt-[20px] inline-flex h-[40px] items-center justify-center rounded-[999px] border border-card-token px-[20px]"
          >
            <span className="type-body-s text-primary-token">Go back to filters</span>
          </button>
        </div>
      ) : null}

      {/* Match info */}
      {!isLoading && plans.length > 0 ? (
        <div
          className="absolute flex flex-col gap-[4px] items-center text-center w-[222px]"
          style={{ left: "calc(50% + 0.5px)", bottom: 32, transform: "translateX(-50%)" }}
        >
          <p className="font-primary text-[16px] leading-[21px] font-medium text-primary-token w-full text-center">
            {matchLabel}
          </p>
          <p className="font-primary text-[14px] leading-[18px] text-primary-token w-full text-center">
            Based on your vibe, budget, distance, and timing filters.
          </p>
        </div>
      ) : null}

    </div>
  );
}
