import { useEffect, useState } from "react";
import { AppIcon } from "./AppIcon";
import PlanOptionsModal from "./PlanOptionsModal";
import {
  DAILY_PLAN_LIMIT_EVENT,
  getDailyPlanLimitState,
} from "../lib/dailyPlanLimit";
import { loadSavedPlans } from "../lib/plans";
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
  const [createDisabled, setCreateDisabled] = useState(false);
  const [joinDisabled, setJoinDisabled] = useState(false);

  useEffect(() => {
    let alive = true;

    const refresh = async () => {
      const plans = await loadSavedPlans();
      if (!alive) return;
      const today = new Date();
      const y = today.getFullYear();
      const m = today.getMonth();
      const d = today.getDate();
      const createdFromPlans = plans.some((p) => {
        if (p.source !== "created") return false;
        const dt = new Date(p.createdAt);
        return dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === d;
      });
      const joinedFromPlans = plans.some((p) => {
        if (p.source !== "joined") return false;
        const dt = new Date(p.createdAt);
        return dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === d;
      });
      const marks = getDailyPlanLimitState();
      setCreateDisabled(createdFromPlans || marks.created);
      setJoinDisabled(joinedFromPlans || marks.joined);
    };

    void refresh();
    window.addEventListener(DAILY_PLAN_LIMIT_EVENT, refresh);
    window.addEventListener("focus", refresh);
    return () => {
      alive = false;
      window.removeEventListener(DAILY_PLAN_LIMIT_EVENT, refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const handleCreatePlan = () => {
    if (createDisabled) return;
    setActionsOpen(false);
    onCreatePlanClick?.();
  };

  const handleJoinPlan = () => {
    if (joinDisabled) return;
    setActionsOpen(false);
    onJoinPlanClick?.();
  };

  return (
    <nav
      aria-label="Primary"
      className={cn("relative z-20 w-full", className)}
    >
      <PlanOptionsModal
        createDisabled={createDisabled}
        isOpen={actionsOpen}
        joinDisabled={joinDisabled}
        onClose={() => setActionsOpen(false)}
        onCreatePlan={handleCreatePlan}
        onJoinPlan={handleJoinPlan}
      />

      <div
        className="relative z-50 bg-surface-primary flex w-full items-center justify-center pb-[16px] pt-[12px]"
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
