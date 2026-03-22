import { AppIcon } from "./AppIcon";
import { cn } from "./ui/utils";

type PlanCardProps = {
  className?: string;
  date?: string;
  imageSrc?: string;
  location?: string;
  onClick?: () => void;
  onJoin?: () => void;
  showButton?: boolean;
  title?: string;
};

export function PlanCard({
  className,
  date = "May 12 · 6pm",
  imageSrc,
  location = "Location (1.2km)",
  onClick,
  onJoin,
  showButton = false,
  title = "Title of the plan will be displayed like this",
}: PlanCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-[471px] w-[309px] flex-col overflow-hidden rounded-[24px] border border-card-token bg-surface-primary",
        onClick ? "cursor-pointer" : "",
        className,
      )}
      onClick={onClick}
      onKeyDown={(event) => {
        if (!onClick) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex flex-col gap-[12px] px-[24px] pb-[20px] pt-[24px]">
        <p className="type-heading-m text-primary-token">{title}</p>

        <div className="flex flex-col gap-[4px]">
          <div className="flex items-center gap-[4px] text-primary-token">
            <AppIcon className="shrink-0" name="Calendar" size={12} />
            <span className="type-body-s">{date}</span>
          </div>

          <div className="flex items-center gap-[4px] text-primary-token">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="shrink-0"
              aria-hidden="true"
            >
              <path
                d="M6 10.5C7.8 8.7 9.5 7.15 9.5 5C9.5 3.07 7.93 1.5 6 1.5C4.07 1.5 2.5 3.07 2.5 5C2.5 7.15 4.2 8.7 6 10.5Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="6" cy="5" r="1.25" stroke="currentColor" />
            </svg>
            <span className="type-body-s">{location}</span>
          </div>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden rounded-tl-[24px] rounded-tr-[24px]">
        {imageSrc ? (
          <img alt={title} className="h-full w-full object-cover" src={imageSrc} />
        ) : (
          <div className="h-full w-full bg-surface-secondary" />
        )}
      </div>

      {showButton ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onJoin?.();
          }}
          className="absolute bottom-[-1px] right-[-1px] flex w-[220px] items-center justify-center rounded-[999px] px-[32px] py-[12px]"
          style={{ background: "linear-gradient(180deg, var(--color-button-secondary) 0%, var(--color-button-secondary) 100%)" }}
        >
          <span className="type-body-m text-invert-token whitespace-nowrap">Join Plan</span>
        </button>
      ) : null}
    </div>
  );
}

export type { PlanCardProps };
