import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { AppNavbar } from "../components/AppNavbar";
import { HomeHeader } from "../components/HomeHeader";
import { loadSavedPlans, type SavedPlan } from "../lib/plans";

const fallbackPlanImage = "https://www.figma.com/api/mcp/asset/f09dd6ab-6d26-46fd-85b8-0715408f10cb";
const examplePlanImage = "https://www.figma.com/api/mcp/asset/f09dd6ab-6d26-46fd-85b8-0715408f10cb";

const EXAMPLE_PLAN: SavedPlan = {
  createdAt: "2026-03-22T18:00:00.000Z",
  description: "Sunset drinks, good music, and an easy plan to end the week well.",
  id: "example-home-plan",
  picturePreview: examplePlanImage,
  title: "Rooftop drinks in Madrid",
  when: "Today, 18:00h",
  whenDate: "2026-03-22",
  whenTime: "18:00",
  where: "Azotea del Círculo, Madrid",
};

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
  onClick?: () => void;
  onViewChat?: () => void;
  title: string;
  subtitle: string;
  imageSrc?: string;
};

function HomePlanCard({
  highlighted = false,
  onClick,
  onViewChat,
  title,
  subtitle,
  imageSrc,
}: HomePlanCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex w-full flex-col items-start overflow-hidden rounded-[8px] border border-card-token bg-surface-primary text-left"
    >
      <div className="h-[163px] w-full overflow-hidden rounded-[8px]">
        <img
          alt={title}
          className="size-full object-cover"
          src={imageSrc || fallbackPlanImage}
        />
      </div>

      <div className="flex w-full items-center gap-[8px] p-[12px]">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-[2px]">
          <p className="type-body-m-medium w-full text-primary-token">
            {title}
          </p>
          <p className="type-body-xs w-full text-secondary-token">{subtitle}</p>
        </div>

        <div className="flex h-[40px] flex-col items-center justify-between">
          <span className="type-body-xs overflow-hidden text-[10px] leading-[16px] text-brand-token">
            now
          </span>
          <Notification />
        </div>
      </div>

      {highlighted ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onViewChat?.();
          }}
          className="absolute left-[244px] top-[12px] flex w-[94px] items-center justify-center rounded-[999px] bg-button-secondary p-[8px]"
        >
          <span className="type-body-xs text-invert-token">View Chat</span>
        </button>
      ) : null}
    </button>
  );
}

export default function PlansHomeScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);

  useEffect(() => {
    let isMounted = true;

    loadSavedPlans().then((plans) => {
      if (!isMounted) return;
      setSavedPlans(plans);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const highlightedPlanId = (location.state as { planId?: string } | null)?.planId;
  const displayPlans = savedPlans.length ? savedPlans : [EXAMPLE_PLAN];

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-surface-primary">
      <div
        className="flex flex-1 flex-col gap-[24px] overflow-y-auto px-[20px]"
        style={{ paddingBottom: "calc(108px + env(safe-area-inset-bottom))" }}
      >
        <HomeHeader title="Hello, Cristina!" topPaddingClassName="pt-[32px]" />

        <div className="flex flex-col items-start gap-[8px]">
          <h2 className="type-body-m-medium text-primary-token">Upcoming Plans</h2>

          {displayPlans.slice(0, 3).map((plan, index) => (
            <HomePlanCard
              key={plan.id}
              highlighted={plan.id === highlightedPlanId || (!highlightedPlanId && index === 0)}
              imageSrc={plan.picturePreview || fallbackPlanImage}
              onClick={() =>
                navigate("/chat-info", {
                  state: {
                    imageSrc: plan.picturePreview || fallbackPlanImage,
                    plan,
                    selectedIndex: index,
                  },
                })
              }
              onViewChat={() =>
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

      <div className="absolute inset-x-0 bottom-0 border-t border-card-token bg-surface-primary">
        <AppNavbar
          activeTab="home"
          activeTone="brand"
          onCreatePlanClick={() => navigate("/add-specs")}
          onJoinPlanClick={() => navigate("/join-plan")}
          onTabClick={(tab) => {
            if (tab === "home") navigate("/");
            if (tab === "groups") navigate("/join-plan");
            if (tab === "profile") navigate("/profile");
          }}
        />
      </div>
    </div>
  );
}
