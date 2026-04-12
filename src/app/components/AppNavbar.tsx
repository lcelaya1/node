import { useState } from "react";
import squarePenIcon from "../../assets/svg/Square Pen.svg";
import usersIcon from "../../assets/svg/Users.svg";
import { AppIcon } from "./AppIcon";
import { cn } from "./ui/utils";

type AppNavbarTab = "home" | "groups" | "diary" | "profile";

type AppNavbarProps = {
  activeTab?: AppNavbarTab;
  activeTone?: "brand" | "primary";
  className?: string;
  onCreatePlanClick?: () => void;
  onJoinPlanClick?: () => void;
  onTabClick?: (tab: AppNavbarTab) => void;
};

type NavItemProps = {
  active?: boolean;
  activeClassName?: string;
  disabled?: boolean;
  icon?: "Home" | "User" | "Comment" | "Camera";
  label: string;
  onClick?: () => void;
  textOnly?: boolean;
};

function NavItem({
  active = false,
  activeClassName = "text-brand-token icon-brand-token",
  disabled = false,
  icon,
  label,
  onClick,
  textOnly = false,
}: NavItemProps) {
  const colorClass = disabled ? "text-secondary-token" : active ? activeClassName : "text-primary-token";

  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      aria-disabled={disabled || undefined}
      aria-label={label}
      className={cn(
        "flex min-h-[44px] flex-1 basis-0 items-center justify-center transition-opacity",
        disabled ? "cursor-default" : "",
      )}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
    >
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-[4px]",
          disabled ? "opacity-70" : "",
          colorClass,
        )}
      >
        {textOnly ? null : <AppIcon className="shrink-0" name={icon!} size={24} />}
        <span className="type-body-xs whitespace-nowrap">{label}</span>
      </div>
    </button>
  );
}

export function AppNavbar({
  activeTab = "home",
  activeTone = "brand",
  className,
  onCreatePlanClick,
  onJoinPlanClick,
  onTabClick,
}: AppNavbarProps) {
  const activeClass = activeTone === "brand" ? "text-brand-token icon-brand-token" : "text-primary-token icon-primary-token";
  const [actionsOpen, setActionsOpen] = useState(false);

  const handleCreatePlan = () => {
    setActionsOpen(false);
    onCreatePlanClick?.();
  };

  const handleJoinPlan = () => {
    setActionsOpen(false);
    onJoinPlanClick?.();
  };

  return (
    <nav
      aria-label="Primary"
      className={cn("relative z-20 w-full", className)}
    >
      {actionsOpen ? (
        <>
          <button
            type="button"
            aria-label="Close actions"
            className="fixed inset-0 z-10"
            style={{ backgroundColor: "rgba(254, 254, 254, 0.6)" }}
            onClick={() => setActionsOpen(false)}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-full z-20 flex justify-center px-[20px] pb-[20px]">
            <div className="pointer-events-auto flex items-end gap-[32px]">
              <button
                type="button"
                onClick={handleCreatePlan}
                className="flex size-[104px] items-center justify-center"
              >
                <div className="flex size-[104px] flex-col items-center justify-center gap-[8px] rounded-full bg-button-primary text-invert-token">
                  <img alt="" aria-hidden="true" className="size-[24px] invert" src={squarePenIcon} />
                  <span className="type-body-xs text-invert-token">Create</span>
                </div>
              </button>

              <button
                type="button"
                onClick={handleJoinPlan}
                className="flex size-[104px] items-center justify-center"
              >
                <div className="flex size-[104px] flex-col items-center justify-center gap-[8px] rounded-full bg-button-primary text-invert-token">
                  <img alt="" aria-hidden="true" className="size-[24px] invert" src={usersIcon} />
                  <span className="type-body-xs text-invert-token">Join</span>
                </div>
              </button>
            </div>
          </div>
        </>
      ) : null}

      <div
        className="flex w-full items-center justify-center pb-[16px] pt-[12px]"
        style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom))" }}
      >
        <NavItem
          active={activeTab === "home"}
          activeClassName={activeClass}
          icon="Home"
          label="Home"
          onClick={() => onTabClick?.("home")}
        />

        <NavItem
          active={activeTab === "groups"}
          activeClassName={activeClass}
          icon="Comment"
          label="Circles"
          onClick={() => onTabClick?.("groups")}
        />

        <div className="flex flex-1 basis-0 items-center self-stretch">
          <div className="flex min-h-[44px] min-w-[44px] flex-1 items-center justify-center">
            <button
              type="button"
              aria-label={actionsOpen ? "Close actions" : "Open actions"}
              className={cn(
                "relative z-30 flex h-[44px] w-[44px] items-center justify-center rounded-[999px] text-invert-token transition-colors",
                "bg-button-secondary",
              )}
              onClick={() => setActionsOpen((open) => !open)}
            >
              <div
                className={cn(
                  "transition-transform duration-200 ease-out",
                  actionsOpen ? "rotate-45" : "rotate-0",
                )}
              >
                <AppIcon name="Add" size={24} />
              </div>
            </button>
          </div>
        </div>

        <NavItem
          active={activeTab === "diary"}
          activeClassName={activeClass}
          disabled
          icon="Camera"
          label="Diary"
          onClick={() => onTabClick?.("diary")}
        />

        <NavItem
          active={activeTab === "profile"}
          activeClassName={activeClass}
          icon="User"
          label="Profile"
          onClick={() => onTabClick?.("profile")}
        />
      </div>
    </nav>
  );
}

export type { AppNavbarProps, AppNavbarTab };
