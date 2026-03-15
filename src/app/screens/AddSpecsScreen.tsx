import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { InputModal } from "../components/InputModal";
import { LiquidGlassButton } from "../components/LiquidGlassButton";

type SpecKey = "title" | "description" | "location";

const specOrder: Array<{
  key: SpecKey;
  label: string;
  shortLabel: string;
}> = [
  { key: "title", label: "Title", shortLabel: "Title" },
  { key: "description", label: "Description", shortLabel: "Description" },
  { key: "location", label: "Location", shortLabel: "Location" },
];

const circleLayout = {
  left: {
    size: 112,
    x: -104,
    y: 18,
    opacity: 0.96,
    zIndex: 1,
  },
  center: {
    size: 152,
    x: 0,
    y: 0,
    opacity: 1,
    zIndex: 3,
  },
  right: {
    size: 120,
    x: 104,
    y: 16,
    opacity: 0.96,
    zIndex: 1,
  },
} as const;

function getSlot(index: number, activeIndex: number) {
  const offset = (index - activeIndex + specOrder.length) % specOrder.length;
  if (offset === 0) return "center";
  if (offset === 1) return "right";
  return "left";
}

function getNextIndex(currentIndex: number) {
  return (currentIndex + 1) % specOrder.length;
}

function getPreviousIndex(currentIndex: number) {
  return (currentIndex - 1 + specOrder.length) % specOrder.length;
}

export default function AddSpecsScreen() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<SpecKey>("description");
  const [planData, setPlanData] = useState({
    title: "",
    description: "",
    location: "",
  });
  const dragStartX = useRef<number | null>(null);
  const dragDeltaX = useRef(0);

  useEffect(() => {
    if (modalOpen) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => getNextIndex(current));
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, [modalOpen]);

  const handleSpecClick = (index: number) => {
    if (index === activeIndex) {
      setModalType(specOrder[index].key);
      setModalOpen(true);
      return;
    }

    setActiveIndex(index);
  };

  const handleSave = (value: string) => {
    setPlanData((prev) => ({
      ...prev,
      [modalType]: value,
    }));

    setActiveIndex((current) => getNextIndex(current));
  };

  const handleSwipeStart = (clientX: number) => {
    dragStartX.current = clientX;
    dragDeltaX.current = 0;
  };

  const handleSwipeMove = (clientX: number) => {
    if (dragStartX.current === null) return;
    dragDeltaX.current = clientX - dragStartX.current;
  };

  const handleSwipeEnd = () => {
    if (dragStartX.current === null) return;

    const threshold = 36;
    if (dragDeltaX.current <= -threshold) {
      setActiveIndex((current) => getNextIndex(current));
    } else if (dragDeltaX.current >= threshold) {
      setActiveIndex((current) => getPreviousIndex(current));
    }

    dragStartX.current = null;
    dragDeltaX.current = 0;
  };

  return (
    <div className="bg-[#ededed] flex h-full flex-col justify-between overflow-hidden px-[25px]" data-name="Add your Specs">
      <div className="pt-[48px]">
        <div className="mx-auto text-center w-[290px]">
        <h1 className="font-['Milling_Trial:Triplex_1mm',sans-serif] leading-[30px] text-[#071c07] text-[24px]">
          Add your Specs
        </h1>
        <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] leading-[20px] mt-[8px] text-[#9b9b9b] text-[14px]">
          Choose what others will see about your plan.
          <br />
          The more you add, the more persuasive.
        </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div
        className="relative h-[210px] overflow-visible touch-pan-y w-full"
        onPointerDown={(event) => handleSwipeStart(event.clientX)}
        onPointerMove={(event) => handleSwipeMove(event.clientX)}
        onPointerUp={handleSwipeEnd}
        onPointerCancel={handleSwipeEnd}
        onPointerLeave={handleSwipeEnd}
      >
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[48px] -translate-x-1/2 h-[160px] w-[330px] rounded-full blur-[38px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.42) 52%, rgba(255,255,255,0) 78%)",
          }}
        />

        {specOrder.map((spec, index) => {
          const slot = getSlot(index, activeIndex);
          const layout = circleLayout[slot];
          const isActive = index === activeIndex;
          const value = planData[spec.key];

          return (
            <button
              key={spec.key}
              type="button"
              onClick={() => handleSpecClick(index)}
              className="absolute left-1/2 top-0 flex items-center justify-center rounded-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                width: layout.size,
                height: layout.size,
                transform: `translateX(calc(-50% + ${layout.x}px)) translateY(${layout.y}px)`,
                opacity: layout.opacity,
                zIndex: layout.zIndex,
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(250,250,250,0.72) 100%)",
                border: "1px solid rgba(255,255,255,0.82)",
                boxShadow: isActive
                  ? "0 1px 0 rgba(255,255,255,0.92) inset, 0 -8px 22px rgba(225,225,225,0.32) inset, 0 18px 40px rgba(207, 207, 207, 0.3)"
                  : "0 1px 0 rgba(255,255,255,0.88) inset, 0 -8px 18px rgba(228,228,228,0.22) inset, 0 14px 36px rgba(210, 210, 210, 0.26)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
              }}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-[1px] rounded-full"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.24) 40%, rgba(255,255,255,0.08) 100%)",
                }}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-[12%] right-[12%] top-[10%] h-[36%] rounded-full blur-[14px]"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0) 72%)",
                }}
              />
              <span
                className="relative z-10 max-w-[72%] overflow-hidden text-ellipsis whitespace-nowrap font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] text-black"
                style={{
                  fontSize: isActive ? "15px" : "14px",
                  lineHeight: "20px",
                }}
              >
                {value || spec.shortLabel}
              </span>
            </button>
          );
        })}
        </div>

      <div className="mt-[18px] flex items-center gap-[5px]">
        {specOrder.map((spec, index) => (
          <button
            key={spec.key}
            type="button"
            aria-label={`Go to ${spec.label}`}
            onClick={() => setActiveIndex(index)}
            className="rounded-full transition-all duration-300"
            style={{
              width: index === activeIndex ? 6 : 5,
              height: index === activeIndex ? 6 : 5,
              background: index === activeIndex ? "#121212" : "#b8b8b8",
            }}
          />
        ))}
      </div>
      </div>

      <div className="pb-[8px]">
        <LiquidGlassButton
          variant="red"
          onClick={() => navigate("/plans-home")}
          className="w-full"
        >
          Save Plan
        </LiquidGlassButton>
      </div>

      <InputModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
        step={activeIndex}
        onSave={handleSave}
      />
    </div>
  );
}
