import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { AppNavbar } from "../components/AppNavbar";
import { HomeHeader } from "../components/HomeHeader";
import { loadSavedPlans, type SavedPlan } from "../lib/plans";
import NoPlansScreen from "./NoPlansScreen";

const fallbackPlanImage = "https://www.figma.com/api/mcp/asset/f09dd6ab-6d26-46fd-85b8-0715408f10cb";

function formatPlanMeta(plan: SavedPlan) {
  if (plan.when) return plan.when.replace("·", ",");
  return "Today, 18:00h";
}

type NotificationProps = {
  count?: number;
};

function Notification({ count = 3 }: NotificationProps) {
  return (
    <div className="flex size-[24px] items-center justify-center rounded-full bg-button-secondary">
      <span className="type-body-s text-invert-token">{count}</span>
    </div>
  );
}

type HomePlanCardProps = {
  highlighted?: boolean;
  isCreatedByUser?: boolean;
  onClick?: () => void;
  title: string;
  subtitle: string;
  imageSrc?: string;
};

function HomePlanCard({
  highlighted = false,
  isCreatedByUser = false,
  onClick,
  title,
  subtitle,
  imageSrc,
}: HomePlanCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex w-full flex-col items-start rounded-[8px] border border-card-token bg-surface-primary text-left"
    >
      {isCreatedByUser ? (
        <div className="pointer-events-none absolute left-0 top-0 z-[1] h-[92px] w-[92px] overflow-hidden rounded-tl-[8px]">
          <div
            className="absolute left-[-33px] top-[18px] w-[128px] -rotate-45 py-[6px] text-center"
            style={{ backgroundColor: "var(--color-surface-bg-secondary)" }}
          >
            <span className="type-body-s text-primary-token">You</span>
          </div>
        </div>
      ) : null}

      <div className="h-[163px] w-full overflow-hidden rounded-t-[8px]">
        <img
          alt={title}
          className="size-full object-cover"
          src={imageSrc || fallbackPlanImage}
        />
      </div>

      <div className="w-full p-[12px]">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-[2px]">
          <p className="type-body-m-medium w-full text-primary-token">
            {title}
          </p>
          <p className="type-body-xs w-full text-secondary-token">{subtitle}</p>
        </div>
      </div>

      <div className="pointer-events-none absolute right-[-6px] top-[-8px] flex flex-col items-end justify-center">
        <Notification />
      </div>
    </button>
  );
}

export default function PlansHomeScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      const plans = await loadSavedPlans();
      if (!isMounted) return;
      setSavedPlans(plans);
    };

    void run();

    return () => {
      isMounted = false;
    };
  }, []);

  const highlightedPlanId = (location.state as { planId?: string } | null)?.planId;

  if (savedPlans.length === 0) {
    return <NoPlansScreen />;
  }

  const upcomingPlans = savedPlans.filter((plan) => !plan.completedAt);

  if (upcomingPlans.length === 0) {
    return <NoPlansScreen />;
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-surface-primary">
      <div
        className="flex flex-1 flex-col gap-[24px] overflow-y-auto px-[20px]"
        style={{ paddingBottom: "calc(108px + env(safe-area-inset-bottom))" }}
      >
        <HomeHeader title="Hello, Cristina!" topPaddingClassName="pt-[32px]" />

        <div className="flex flex-col items-start gap-[8px]">
          <h2 className="type-body-m-medium text-primary-token">Upcoming Plans</h2>

          {upcomingPlans.slice(0, 3).map((plan, index) => (
            <HomePlanCard
              key={plan.id}
              highlighted={plan.id === highlightedPlanId || (!highlightedPlanId && index === 0)}
              imageSrc={plan.picturePreview || fallbackPlanImage}
              isCreatedByUser={plan.source === "created"}
              onClick={() =>
                navigate("/chat", {
                  state: {
                    imageSrc: plan.picturePreview || fallbackPlanImage,
                    plan,
                    selectedIndex: index,
                  },
                })
              }
              subtitle={formatPlanMeta(plan)}
              title={plan.title || "Title of the plan will be displayed like this"}
            />
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-card-token bg-surface-primary">
        <AppNavbar
          activeTab="home"
          activeTone="brand"
          onCreatePlanClick={() => navigate("/add-specs")}
          onJoinPlanClick={() => navigate("/join-plan")}
          onTabClick={(tab) => {
            if (tab === "home") navigate("/");
            if (tab === "groups") navigate("/groups");
            if (tab === "diary") navigate("/diary");
            if (tab === "profile") navigate("/profile");
          }}
        />
      </div>
    </div>
  );
}
