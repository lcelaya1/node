import { cn } from "./ui/utils";
import type { CatalogPlan } from "../lib/planCatalog";
import svgPaths from "../../imports/Onboarding1-2/svg-5vdh4m8d9d";

/** Path geometry from `assets/svg/Heart.svg` — fills switch with liked state */
const HEART_ICON_PATH =
  "M19 14C20.49 12.54 22 10.79 22 8.5C22 7.04131 21.4205 5.64236 20.3891 4.61091C19.3576 3.57946 17.9587 3 16.5 3C14.74 3 13.5 3.5 12 5C10.5 3.5 9.26 3 7.5 3C6.04131 3 4.64236 3.57946 3.61091 4.61091C2.57946 5.64236 2 7.04131 2 8.5C2 10.8 3.5 12.55 5 14L12 21L19 14Z";

/** Matches onboarding 1 front card footprint in the stack. */
export const INTEREST_STACK_CARD_W = 264;
export const INTEREST_STACK_CARD_H = 403;

export const INTEREST_STACK_CARD_RADIUS = 20;

type InterestStackPlanCardProps = {
  plan: CatalogPlan;
  liked?: boolean;
  showHeart?: boolean;
  onHeartClick?: () => void;
  heartDisabled?: boolean;
  className?: string;
  /**
   * How much of the peek card stays visible (~0.2 sides, 1 centre). Implemented as an opaque veil
   * (`bg-surface-primary` opacity `1 − this`) above fully opaque paints — avoids real translucency
   * stacking flashes against siblings.
   */
  contentOpacity?: number;
};

/** Toggles: idle = red heart / white circle; liked = white heart / red circle (`Heart.svg` shape). */
function HeartButton({
  liked,
  onClick,
  disabled,
}: {
  liked?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      data-name="mdi:heart"
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onClick={onClick}
      disabled={disabled}
      className="absolute bottom-[12px] right-[12px] z-[30] size-[36px] cursor-pointer disabled:pointer-events-none"
    >
      <svg className="pointer-events-none absolute inset-0 size-full" fill="none" viewBox="0 0 36 36">
        <g id="mdi:heart">
          <rect
            height="36"
            rx="18"
            width="36"
            className={cn("transition-colors duration-200 ease-out", liked ? "fill-[#FC312E]" : "fill-white")}
          />
          <g transform="translate(6 6)">
            <path
              d={HEART_ICON_PATH}
              className={cn("transition-colors duration-200 ease-out", liked ? "fill-white" : "fill-[#FC312E]")}
            />
          </g>
        </g>
      </svg>
    </button>
  );
}

/** Calendar icon — same structure as onboarding 1 (Date2). */
function OnboardingCalendarIcon({ className }: { className?: string }) {
  return (
    <div className={cn("relative shrink-0 size-[10.268px]", className)}>
      <div className="absolute inset-[22.92%_18.75%_18.75%_18.75%]">
        <div className="absolute inset-[-5%_-4.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.01614 6.58832">
            <path d={svgPaths.p72b6980} stroke="currentColor" strokeWidth="0.598938" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[14.58%_35.42%_68.75%_35.42%]">
        <div className="absolute inset-[-17.5%_-10%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.59363 2.31019">
            <path d={svgPaths.p3e899e0} stroke="currentColor" strokeLinecap="round" strokeWidth="0.598938" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/** Location pin — same as onboarding 1 (EpLocation2). */
function OnboardingLocationIcon({ className }: { className?: string }) {
  return (
    <div className={cn("relative shrink-0 size-[10.268px]", className)}>
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.2675 10.2675">
        <path d={svgPaths.p2076cf00} fill="currentColor" />
        <path d={svgPaths.p3f172e00} fill="currentColor" />
      </svg>
    </div>
  );
}

/**
 * Plan card aligned with onboarding 1 (“It’s all here for you”) front plan card —
 * typography, iconography, spacing, shadow, and corner treatment stay fixed; only stack motion changes.
 */
export function InterestStackPlanCard({
  plan,
  liked = false,
  showHeart = false,
  onHeartClick,
  heartDisabled,
  className,
  contentOpacity = 1,
}: InterestStackPlanCardProps) {
  const R = INTEREST_STACK_CARD_RADIUS;
  const metaColor = liked ? "text-white" : "text-primary-token";
  const peekVisible = Math.max(0, Math.min(1, contentOpacity));
  const veilOpacity = Math.max(0, Math.min(1, 1 - peekVisible));

  return (
    <div
      className={cn(
        "relative flex size-full min-h-0 flex-col overflow-hidden",
        "drop-shadow-[0px_4px_6.1px_rgba(0,0,0,0.15)]",
        className,
      )}
      style={{ borderRadius: R }}
    >
      <div
        className={cn(
          "relative z-[1] flex min-h-0 flex-1 w-full flex-col overflow-hidden",
          liked ? "bg-[#FC312E]" : "bg-[#fefefe]",
        )}
        style={{ borderRadius: R }}
      >
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 border-[#e4e4e7] border-[0.856px] border-solid",
            liked && "opacity-0",
          )}
          style={{ borderRadius: R }}
        />

        {/* Header — matches Frame3 (Picnic…) padding & gaps from onboarding 1, with larger outer radius */}
        <div
          className={cn(
            "relative shrink-0 w-full",
            "px-[18.824px] pt-[18.824px] pb-[13.69px]",
            liked ? "bg-transparent" : "bg-[#fefefe]",
          )}
          style={{ borderRadius: `${R}px ${R}px 0 0` }}
        >
          <div className="flex flex-col gap-[10.268px]">
            <p
              className={cn(
                "type-heading-m transition-colors duration-200 break-words",
                liked ? "text-white" : "text-primary-token",
              )}
            >
              {plan.title}
            </p>

          </div>
        </div>

        {/* Image block: full 20px radius — clip via overflow */}
        <div
          className={cn(
            "relative flex min-h-0 flex-1 w-full overflow-hidden",
            liked ? "bg-[#FC312E]" : "bg-[#f4f4f5]",
          )}
          style={{ borderRadius: R }}
        >
          {plan.imageSrc && (
            <img alt="" className="absolute inset-0 size-full object-cover" src={plan.imageSrc} />
          )}
          <div className="pointer-events-none absolute inset-0 bg-[rgba(0,0,0,0.2)]" />
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[20] bg-surface-primary"
        style={{ opacity: veilOpacity, borderRadius: R }}
      />

      {showHeart && <HeartButton liked={liked} onClick={onHeartClick} disabled={heartDisabled} />}
    </div>
  );
}
