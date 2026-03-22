import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { IconButton } from "../components/IconButton";
import { AppIcon } from "../components/AppIcon";
import { loadDemoUsers, type DemoUser } from "../lib/demoUsers";
import { savePlan, toSavedPlan } from "../lib/plans";
import type { JoinFilterState } from "../lib/planCatalog";

type InfoPlanState = {
  plan?: {
    budget?: string;
    creator?: DemoUser | null;
    description?: string;
    id: number | string;
    location?: string;
    placeName?: string;
    startTime?: string;
    title: string;
    when?: string;
    whenDate?: string;
    where?: string;
    date?: string;
  };
  filters?: JoinFilterState;
  imageSrc?: string;
  participants?: DemoUser[];
  selectedIndex?: number;
};

const FALLBACK_IMAGE = "https://www.figma.com/api/mcp/asset/cfc93208-7871-4ba9-b2ac-70ad12a5380f";

export default function InfoPlanScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as InfoPlanState | null) ?? null;
  const [fallbackCreator, setFallbackCreator] = useState<DemoUser | null>(null);

  const plan = state?.plan ?? {
    id: 1,
    title: "Title of the plan will be displayed like this",
    date: "May 12 · 6pm",
    location: "Here will be the location (1.2km)",
  };

  const planDate = (plan.date ?? plan.when ?? "May 12 · 6pm").replace("·", "-");
  const planLocation = plan.location ?? plan.where ?? "Here will be the location (1.2km)";

  const imageSrc = state?.imageSrc ?? FALLBACK_IMAGE;
  const mapQuery = encodeURIComponent(planLocation);
  const creator = plan.creator ?? fallbackCreator;

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (plan.creator) return;
      const users = await loadDemoUsers();
      if (!active) return;
      setFallbackCreator(users[0] ?? null);
    };

    void run();

    return () => {
      active = false;
    };
  }, [plan.creator]);

  const handleJoinPlan = async () => {
    const savedPlan = toSavedPlan(
      {
        budget: plan.budget,
        creator: plan.creator ?? null,
        description: plan.description,
        id: plan.id,
        participants: state?.participants ?? [],
        title: plan.title,
        when: plan.when,
        whenDate: plan.whenDate,
        whenTime: plan.startTime,
        where: plan.where,
      },
      imageSrc,
    );

    await savePlan(savedPlan);

    navigate("/", {
      state: { planId: savedPlan.id, selectedIndex: state?.selectedIndex ?? 0 },
    });
  };

  return (
    <div className="relative size-full overflow-y-auto bg-surface-primary">
      <div className="relative h-[380px] overflow-hidden rounded-bl-[16px] rounded-br-[16px]">
        <img alt={plan.title} className="absolute inset-0 size-full object-cover" src={imageSrc} />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, color-mix(in srgb, var(--primitive-neutral-black) 50%, transparent) 18.37%, transparent 39.173%)",
          }}
        />

        <div className="absolute left-[20px] right-[20px] top-[32px] flex items-start justify-between">
          <IconButton
            aria-label="Back"
            hierarchy="Primary Light"
            icon="Left"
            onClick={() =>
              navigate("/choose-plan", {
                state: { filters: state?.filters, selectedIndex: state?.selectedIndex ?? 0 },
              })
            }
            size="Mid"
          />
        </div>

        <div className="absolute bottom-[16px] left-[20px] right-[20px]">
          <p className="type-heading-xl text-invert-token">{plan.title}</p>
        </div>
      </div>

      <div
        className="flex flex-col items-start gap-[24px] px-[20px]"
        style={{ paddingTop: "32px", paddingBottom: "100px" }}
      >
        <div className="flex w-full flex-col items-start gap-[8px]">
          <p className="type-body-m-medium text-primary-token">What?</p>
          <p className="type-body-m text-primary-token">
            {plan.description ?? "This plan looks like a strong match for what you selected."}
          </p>
          <div className="flex items-center gap-[12px]">
            <div className="flex items-center gap-[4px] text-primary-token">
              <AppIcon name="Calendar" size={16} />
              <span className="type-body-s">{planDate}</span>
            </div>
            <div className="h-[10px] w-px rounded-full bg-surface-secondary" />
            <div className="flex items-center">
              <p className="type-body-s text-primary-token">
                {"Budget  "}
                <span className="text-[12px] leading-[16px] text-primary-token">
                  {plan.budget ?? "€"}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-[196px] flex-col items-start gap-[8px]">
          <p className="type-body-m-medium text-primary-token">Who?</p>
          <div className="flex w-full items-center gap-[8px]">
            {creator?.avatarUrl ? (
              <img
                alt={creator.name}
                className="size-[44px] rounded-full object-cover"
                src={creator.avatarUrl}
              />
            ) : (
              <div className="size-[44px] rounded-full bg-surface-secondary" />
            )}
            <div className="flex w-[144px] flex-col items-start">
              <p className="type-body-s text-primary-token">
                {creator ? `${creator.name} created the node` : "Plan creator"}
              </p>
              <button
                className="border-b border-[var(--color-text-secondary)] type-body-s text-secondary-token"
                type="button"
              >
                View profile
              </button>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-[8px]">
          <p className="type-body-m-medium text-primary-token">Where?</p>
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
            <span className="type-body-s">{planLocation}</span>
          </div>
          <div className="h-[185px] w-full overflow-hidden rounded-[16px] border border-card-token bg-surface-secondary">
            <iframe
              title={`Map for ${planLocation}`}
              src={`https://www.google.com/maps?q=${mapQuery}&z=14&output=embed`}
              className="h-full w-full border-0 pointer-events-none"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      <div
        className="fixed bottom-0 left-1/2 z-10 w-full max-w-[393px] -translate-x-1/2 bg-surface-primary px-[20px] pt-[12px] pb-[32px]"
        style={{ paddingBottom: "calc(32px + env(safe-area-inset-bottom))" }}
      >
        <button
          type="button"
          onClick={() => void handleJoinPlan()}
          className="flex h-[45px] w-full items-center justify-center rounded-[999px]"
          style={{ background: "linear-gradient(180deg, var(--color-button-secondary) 0%, var(--color-button-secondary) 100%)" }}
        >
          <span className="type-body-m text-invert-token">Join Plan</span>
        </button>
      </div>
    </div>
  );
}
