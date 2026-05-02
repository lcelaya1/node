import { useState, useEffect, useRef } from "react";
import { CreateAccountBackButton } from "../components/CreateAccountBackButton";
import { supabase } from "../lib/supabase";
import {
  loadOnboardingPlans,
  ONBOARDING_PLAN_INTEREST_MAP,
  type CatalogPlan,
} from "../lib/planCatalog";
import svgPaths from "../../imports/Onboarding1-2/svg-5vdh4m8d9d";

type Props = {
  value?: string[];
  onChange?: (value: string[]) => void;
  onBack?: () => void;
  onContinue?: () => void;
};

function SmallCardInfo({ plan }: { plan: CatalogPlan }) {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[8px] items-start pb-[10.667px] pt-[14.667px] px-[14.667px] relative size-full">
        <div className="flex flex-col justify-center leading-[0] relative shrink-0 w-full">
          <p className="type-heading-m text-primary-token">{plan.title}</p>
        </div>
        <div className="content-stretch flex flex-col gap-[2.667px] items-start relative shrink-0 w-full">
          <div className="content-stretch flex gap-[2.667px] items-center relative shrink-0 w-full">
            <div className="relative shrink-0 size-[8px]">
              <div className="absolute inset-[22.92%_18.75%_18.75%_18.75%]">
                <div className="absolute inset-[-5%_-4.67%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.46667 5.13333">
                    <path d={svgPaths.p17e01700} stroke="var(--stroke-0, #09090B)" strokeWidth="0.466667" />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-[14.58%_35.42%_68.75%_35.42%]">
                <div className="absolute inset-[-17.5%_-10%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.8 1.8">
                    <path d={svgPaths.p33d4e2c0} stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeWidth="0.466667" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="type-body-xs text-primary-token">{plan.when || "—"}</p>
          </div>
          <div className="content-stretch flex gap-[2.667px] items-center relative shrink-0 w-full">
            <div className="relative shrink-0 size-[8px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
                <path d={svgPaths.p23c84500} fill="var(--fill-0, #09090B)" />
                <path d={svgPaths.p31873780} fill="var(--fill-0, #09090B)" />
              </svg>
            </div>
            <p className="type-body-xs text-primary-token">{plan.placeName || plan.location || "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LargeCardInfo({ plan, liked }: { plan: CatalogPlan; liked?: boolean }) {
  const iconColor = liked ? "#ffffff" : "#09090B";
  return (
    <div className={`relative shrink-0 w-full rounded-t-[20.535px] transition-colors duration-200 ${liked ? "bg-[#FC312E]" : "bg-transparent"}`}>
      <div className="content-stretch flex flex-col gap-[10.268px] items-start pb-[13.69px] pt-[18.824px] px-[18.824px] relative size-full">
        <div className="flex flex-col justify-center leading-[0] relative shrink-0 w-full">
          <p className={`type-heading-m transition-colors duration-200 ${liked ? "text-white" : "text-primary-token"}`}>{plan.title}</p>
        </div>
        <div className="content-stretch flex flex-col gap-[3.423px] items-start relative shrink-0 w-full">
          <div className="content-stretch flex gap-[3.423px] items-center relative shrink-0 w-full">
            <div className="relative shrink-0 size-[10.268px]">
              <div className="absolute inset-[22.92%_18.75%_18.75%_18.75%]">
                <div className="absolute inset-[-5%_-4.67%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.01614 6.58832">
                    <path d={svgPaths.p72b6980} stroke={iconColor} strokeWidth="0.598938" />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-[14.58%_35.42%_68.75%_35.42%]">
                <div className="absolute inset-[-17.5%_-10%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.59363 2.31019">
                    <path d={svgPaths.p3e899e0} stroke={iconColor} strokeLinecap="round" strokeWidth="0.598938" />
                  </svg>
                </div>
              </div>
            </div>
            <p className={`type-body-xs transition-colors duration-200 ${liked ? "text-white" : "text-primary-token"}`}>{plan.when || "—"}</p>
          </div>
          <div className="content-stretch flex gap-[3.423px] items-center relative shrink-0 w-full">
            <div className="relative shrink-0 size-[10.268px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.2675 10.2675">
                <path d={svgPaths.p2076cf00} fill={iconColor} />
                <path d={svgPaths.p3f172e00} fill={iconColor} />
              </svg>
            </div>
            <p className={`type-body-xs transition-colors duration-200 ${liked ? "text-white" : "text-primary-token"}`}>{plan.placeName || plan.location || "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

type CardPos = { left: number; top: number; w: number; h: number; opacity: number; radius: number; z: number };

const POS_FRONT:  CardPos = { left: 41,   top: 0,  w: 264.389, h: 403, opacity: 1,   radius: 20.535, z: 3 };
const POS_BACK_R: CardPos = { left: 140,  top: 39, w: 206,     h: 314, opacity: 0.2, radius: 16,     z: 2 };
const POS_BACK_L: CardPos = { left: 0,    top: 39, w: 206,     h: 314, opacity: 0.2, radius: 16,     z: 1 };
const POS_ENTER:  CardPos = { left: -220, top: 39, w: 206,     h: 314, opacity: 0,   radius: 16,     z: 0 };
const POS_EXIT:   CardPos = { left: -310, top: 0,  w: 264.389, h: 403, opacity: 0,   radius: 20.535, z: 0 };

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function lerpPos(from: CardPos, to: CardPos, t: number): CardPos {
  return {
    left:    lerp(from.left,    to.left,    t),
    top:     lerp(from.top,     to.top,     t),
    w:       lerp(from.w,       to.w,       t),
    h:       lerp(from.h,       to.h,       t),
    opacity: lerp(from.opacity, to.opacity, t),
    radius:  lerp(from.radius,  to.radius,  t),
    z: t >= 0.5 ? to.z : from.z,
  };
}

function HeartButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="absolute bottom-[12px] right-[12px] size-[36px] cursor-pointer disabled:pointer-events-none"
    >
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
        <rect fill="white" height="36" rx="18" width="36" />
        <path d={svgPaths.p19dd4d00} fill="#FC312E" />
      </svg>
    </button>
  );
}

export default function CreateProfileInterestsScreen({ onBack, onContinue }: Props) {
  const [plans, setPlans] = useState<CatalogPlan[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedInterests, setLikedInterests] = useState<string[]>([]);
  const [likedPlanIds, setLikedPlanIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [snapProgress, setSnapProgress] = useState<number | null>(null);
  const dragStartRef = useRef(0);

  useEffect(() => {
    loadOnboardingPlans()
      .then(setPlans)
      .finally(() => setIsLoading(false));
  }, []);

  const total = plans.length || 5;
  const i0 = currentIndex % total;
  const i1 = (currentIndex + 1) % total;
  const i2 = (currentIndex + 2) % total;
  const i3 = (currentIndex + 3) % total;

  const currentPlan = plans[i0];
  const alreadyLiked = currentPlan ? likedPlanIds.has(currentPlan.id) : false;

  // p: 0 = neutral, 1 = fully advanced to next card
  const p = snapProgress !== null ? snapProgress : Math.max(0, Math.min(1, -dragX / 150));
  const isAnimating = snapProgress !== null;

  const pos0 = lerpPos(POS_FRONT,  POS_EXIT,   p);
  const pos1 = lerpPos(POS_BACK_R, POS_FRONT,  p);
  const pos2 = lerpPos(POS_BACK_L, POS_BACK_R, p);
  const pos3 = lerpPos(POS_ENTER,  POS_BACK_L, p);

  const snapToNext = () => {
    setSnapProgress(1);
    setTimeout(() => {
      setSnapProgress(null);
      setDragX(0);
      setCurrentIndex((prev) => prev + 1);
    }, 350);
  };

  const advance = (liked: boolean) => {
    if (!currentPlan || isSaving || snapProgress !== null) return;
    if (liked && !alreadyLiked) {
      const planInterests = ONBOARDING_PLAN_INTEREST_MAP[currentPlan.id] ?? [];
      setLikedInterests((prev) => [...new Set([...prev, ...planInterests])]);
      setLikedPlanIds((prev) => new Set([...prev, currentPlan.id]));
    }
    snapToNext();
  };

  const onDragStart = (clientX: number) => {
    if (snapProgress !== null || isSaving) return;
    dragStartRef.current = clientX;
    setIsDragging(true);
  };

  const onDragMove = (clientX: number) => {
    if (!isDragging || snapProgress !== null) return;
    setDragX(Math.min(0, clientX - dragStartRef.current));
  };

  const onDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (-dragX > 80) {
      snapToNext();
    } else {
      setDragX(0);
    }
  };

  const handleDone = async () => {
    if (isSaving) return;
    setIsSaving(true);
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .upsert({ id: user.id, interests: likedInterests }, { onConflict: "id" });
      }
    }
    onContinue?.();
  };

  if (isLoading) {
    return <div className="flex size-full items-center justify-center bg-surface-primary" />;
  }

  return (
    <div className="flex size-full flex-col bg-surface-primary pb-[40px]">
      {/* Header */}
      <div className="flex flex-col gap-[20px] px-[24px] pt-[16px]">
        <CreateAccountBackButton onClick={onBack} />
        <div className="flex flex-col gap-[8px]">
          <p className="type-heading-l text-primary-token">Select your interests.</p>
          <p className="type-body-s text-secondary-token">
            Heart the plans that interest you the most — we'll use these to tailor your feed.
          </p>
        </div>
      </div>

      {/* Card stack */}
      <div
        className="flex flex-1 items-center justify-center select-none touch-none"
        onMouseDown={(e) => onDragStart(e.clientX)}
        onMouseMove={(e) => onDragMove(e.clientX)}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => { e.preventDefault(); onDragMove(e.touches[0].clientX); }}
        onTouchEnd={onDragEnd}
      >
        <div className="relative shrink-0 w-[346px] h-[403px]" style={{ cursor: isDragging ? "grabbing" : "grab" }}>

          {/* Card i3 — incoming from left */}
          {plans[i3] && (
            <div
              className="absolute flex flex-col bg-[#fefefe] drop-shadow-[0px_4px_2px_rgba(0,0,0,0.1)] overflow-hidden"
              style={{
                left: pos3.left, top: pos3.top, width: pos3.w, height: pos3.h,
                opacity: pos3.opacity, borderRadius: pos3.radius, zIndex: pos3.z,
                transition: !isDragging ? "all 0.35s ease" : "none",
              }}
            >
              <div className="flex-[1_0_0] relative w-full">
                {plans[i3].imageSrc && <img alt="" className="absolute size-full object-cover" src={plans[i3].imageSrc} />}
              </div>
            </div>
          )}

          {/* Card i2 — back-left */}
          {plans[i2] && (
            <div
              className="absolute flex flex-col bg-[#fefefe] drop-shadow-[0px_4px_2px_rgba(0,0,0,0.1)] overflow-hidden"
              style={{
                left: pos2.left, top: pos2.top, width: pos2.w, height: pos2.h,
                opacity: pos2.opacity, borderRadius: pos2.radius, zIndex: pos2.z,
                transition: !isDragging ? "all 0.35s ease" : "none",
              }}
            >
              <SmallCardInfo plan={plans[i2]} />
              <div className="flex-[1_0_0] relative w-full">
                {plans[i2].imageSrc && <img alt="" className="absolute size-full object-cover" src={plans[i2].imageSrc} />}
                <div className="absolute inset-0 bg-[rgba(0,0,0,0.2)]" />
              </div>
            </div>
          )}

          {/* Card i1 — back-right, approaches front */}
          {plans[i1] && (
            <div
              className="absolute flex flex-col bg-[#fefefe] drop-shadow-[0px_4px_2px_rgba(0,0,0,0.1)] overflow-hidden"
              style={{
                left: pos1.left, top: pos1.top, width: pos1.w, height: pos1.h,
                opacity: pos1.opacity, borderRadius: pos1.radius, zIndex: pos1.z,
                transition: !isDragging ? "all 0.35s ease" : "none",
              }}
            >
              <SmallCardInfo plan={plans[i1]} />
              <div className="flex-[1_0_0] relative w-full">
                {plans[i1].imageSrc && <img alt="" className="absolute size-full object-cover" src={plans[i1].imageSrc} />}
                <div className="absolute inset-0 bg-[rgba(0,0,0,0.2)]" />
              </div>
            </div>
          )}

          {/* Card i0 — current front */}
          {currentPlan && (
            <div
              className="absolute flex flex-col overflow-hidden drop-shadow-[0px_4px_6.1px_rgba(0,0,0,0.15)]"
              style={{
                left: pos0.left, top: pos0.top, width: pos0.w, height: pos0.h,
                opacity: pos0.opacity, borderRadius: pos0.radius, zIndex: pos0.z,
                backgroundColor: alreadyLiked ? "#FC312E" : "#fefefe",
                transition: !isDragging ? "all 0.35s ease, background-color 0.2s" : "background-color 0.2s",
              }}
            >
              <div aria-hidden="true" className="absolute border-[#e4e4e7] border-[0.856px] border-solid inset-0 pointer-events-none" style={{ borderRadius: pos0.radius }} />
              <LargeCardInfo plan={currentPlan} liked={alreadyLiked} />
              <div className="flex-[1_0_0] min-h-px relative w-full" style={{ borderRadius: pos0.radius }}>
                <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ borderRadius: pos0.radius }}>
                  {currentPlan.imageSrc && (
                    <img alt={currentPlan.title} className="absolute size-full object-cover" src={currentPlan.imageSrc} style={{ borderRadius: pos0.radius }} />
                  )}
                  <div className="absolute inset-0 bg-[rgba(0,0,0,0.2)]" style={{ borderRadius: pos0.radius }} />
                </div>
                <HeartButton onClick={() => advance(true)} disabled={isAnimating} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Counter + Skip + Done */}
      <div className="flex flex-col gap-[16px] px-[24px]">
        <div className="flex items-center justify-between">
          <p className="font-['ABC_Monument_Grotesk_Unlicensed_Trial:Regular',sans-serif] text-[14px] leading-[18px] text-[#09090b]">
            {i0 + 1}/{total}
          </p>
          <button
            type="button"
            disabled={isSaving}
            onClick={() => advance(false)}
            className="font-['ABC_Monument_Grotesk_Unlicensed_Trial:Regular',sans-serif] text-[14px] leading-[18px] text-[#71717a]"
          >
            Skip
          </button>
        </div>
        <button
          type="button"
          disabled={isSaving}
          onClick={handleDone}
          className="flex w-full items-center justify-center rounded-[999px] bg-button-primary px-[32px] py-[12px] type-label-m text-invert-token disabled:bg-surface-fill"
        >
          Done
        </button>
      </div>
    </div>
  );
}
