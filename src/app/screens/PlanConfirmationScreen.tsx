import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import type { DemoUser } from "../lib/demoUsers";
import { deletePlan } from "../lib/plans";

type PlanConfirmationState = {
  plan?: {
    id?: string | number;
    title?: string;
  };
  participants?: DemoUser[];
};

function InfoContent({ planName }: { planName: string }) {
  return (
    <div className="flex w-full shrink-0 flex-col items-start gap-[8px]">
      <p className="font-primary text-[24px] leading-[28px] text-primary-token w-full">
        {`How was your time at ${planName}?`}
      </p>
      <p className="type-body-s text-secondary-token w-full">
        Share your experience to help us improve your future matches.
      </p>
    </div>
  );
}

export default function PlanConfirmationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as PlanConfirmationState | null) ?? null;
  const [isDeleting, setIsDeleting] = useState(false);
  const planId = state?.plan?.id;
  const planName = state?.plan?.title?.trim() || "your plan";

  const handlePositiveFeedback = () =>
    navigate("/plan-rating", {
      state: state ?? {
        plan: {
          id: planId,
          title: planName,
        },
      },
    });
  const handleCouldntMakeIt = async () => {
    if (isDeleting) return;

    setIsDeleting(true);

    try {
      if (planId !== undefined && planId !== null) {
        await deletePlan(String(planId));
      }
      navigate("/", { replace: true });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex size-full items-center justify-center bg-surface-primary px-[20px]">
      <div className="flex w-full max-w-[353px] flex-col items-start gap-[32px]">
        <InfoContent planName={planName} />

        <div className="flex w-full flex-col items-start gap-[12px]">
          <button
            type="button"
            onClick={handlePositiveFeedback}
            className="flex h-[45px] w-full items-center justify-center rounded-[999px] bg-button-primary"
          >
            <span className="type-body-m text-invert-token">It was great!</span>
          </button>

          <button
            type="button"
            onClick={handleCouldntMakeIt}
            className="flex h-[45px] w-full items-center justify-center rounded-[999px] border border-selected-token bg-surface-primary"
          >
            <span className="type-body-m text-primary-token">
              {isDeleting ? "Removing..." : `I couldn't make it`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
