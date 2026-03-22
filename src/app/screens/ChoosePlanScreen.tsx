import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { PlanCard } from "../components/PlanCard";

const imgPlanCover = "https://www.figma.com/api/mcp/asset/cfc93208-7871-4ba9-b2ac-70ad12a5380f";

// ── Mock data ─────────────────────────────────────────────────────────────────
const PLANS = [
  { id: 1, title: "Title of the plan will be displayed like this", date: "May 12 · 6pm", location: "Location (1.2km)" },
  { id: 2, title: "Title of the plan will be displayed like this", date: "May 13 · 8pm", location: "Location (2.0km)" },
  { id: 3, title: "Title of the plan will be displayed like this", date: "May 14 · 7pm", location: "Location (1.8km)" },
];

// ── Main screen ───────────────────────────────────────────────────────────────
export default function ChoosePlanScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialIndex =
    typeof (location.state as { selectedIndex?: number } | null)?.selectedIndex === "number"
      ? (location.state as { selectedIndex?: number }).selectedIndex ?? 0
      : 0;
  const [current, setCurrent] = useState(initialIndex);
  const [dragOffset, setDragOffset] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(393);
  const [isDragging, setIsDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragStartXRef = useRef<number | null>(null);
  const total = PLANS.length;
  const CARD_WIDTH = 309;
  const CARD_GAP = 20;
  const SWIPE_THRESHOLD = 60;
  const CARD_SPAN = CARD_WIDTH + CARD_GAP;

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
    setIsDragging(true);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (dragStartXRef.current === null) return;

    const nextOffset = event.touches[0].clientX - dragStartXRef.current;
    const atStart = current === 0 && nextOffset > 0;
    const atEnd = current === total - 1 && nextOffset < 0;

    setDragOffset((atStart || atEnd) ? nextOffset * 0.35 : nextOffset);
  };

  const handleTouchEnd = () => {
    if (dragOffset <= -SWIPE_THRESHOLD) {
      setCurrent((prev) => clampIndex(prev + 1));
    } else if (dragOffset >= SWIPE_THRESHOLD) {
      setCurrent((prev) => clampIndex(prev - 1));
    }

    dragStartXRef.current = null;
    setDragOffset(0);
    setIsDragging(false);
  };

  const baseOffset = (viewportWidth - CARD_WIDTH) / 2;
  const trackTranslateX = baseOffset - current * CARD_SPAN + dragOffset;
  const fractionalIndex = current - dragOffset / CARD_SPAN;

  const getCardTransform = (index: number) => {
    const distance = index - fractionalIndex;
    const clampedDistance = Math.max(-1, Math.min(1, distance));
    const rotation = clampedDistance * 2;
    const verticalOffset = Math.min(Math.abs(distance), 1) * 10;

    return `translateY(${verticalOffset}px) rotate(${rotation}deg)`;
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
        className="absolute left-0 right-0 top-[168px] h-[481px] overflow-visible touch-pan-y"
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
          {PLANS.map((item, index) => (
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
              <PlanCard
                title={item.title}
                date={item.date}
                location={item.location}
                imageSrc={imgPlanCover}
                onClick={() =>
                  navigate("/info-plan", {
                    state: { plan: item, imageSrc: imgPlanCover, selectedIndex: index },
                  })
                }
                showButton={index === current}
                onJoin={() => navigate("/")}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Match info */}
      <div
        className="absolute flex flex-col gap-[4px] items-center text-center w-[222px]"
        style={{ left: "calc(50% + 0.5px)", bottom: 32, transform: "translateX(-50%)" }}
      >
        <p className="font-primary text-[16px] leading-[21px] font-medium text-primary-token w-full text-center">
          96% match
        </p>
        <p className="font-primary text-[14px] leading-[18px] text-primary-token w-full text-center">
          We picked this for you based on{" "}
          <em>some reasons that will appear here.</em>
        </p>
      </div>

    </div>
  );
}
