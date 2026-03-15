import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Plus } from "lucide-react";
import { DualActionButtons } from "../components/DualActionButtons";
import { loadSavedPlans, type SavedPlan } from "../lib/plans";

type PlanCardProps = {
  description: string;
  imageSrc?: string;
  isHighlighted?: boolean;
  location: string;
  onClick?: () => void;
  title: string;
};

function PlanCard({ description, imageSrc, isHighlighted = false, location, onClick, title }: PlanCardProps) {
  const cardHeight = imageSrc ? "min-h-[280px]" : "";

  return (
    <button
      className={`w-full rounded-[16px] px-[20px] py-[18px] text-left transition-shadow ${cardHeight}`}
      onClick={onClick}
      style={{
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.62) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.58)",
        boxShadow: isHighlighted
          ? "0 1px 0 rgba(255,255,255,0.82) inset, 0 -1px 1px rgba(0,0,0,0.04) inset, 0 16px 32px -8px rgba(0,0,0,0.14), 0 4px 12px rgba(255,255,255,0.76)"
          : "0 1px 0 rgba(255,255,255,0.82) inset, 0 -1px 1px rgba(0,0,0,0.04) inset, 0 8px 20px -4px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex min-h-full flex-col">
        <div className="w-full">
          <p
            className="overflow-hidden text-ellipsis whitespace-nowrap font-['Milling_Trial:Triplex_1mm',sans-serif] text-[18px] leading-[22px] text-[#fc312e]"
            style={{ fontFeatureSettings: "'ss16'" }}
          >
            {title}
          </p>
          <p
            className="mt-[4px] overflow-hidden text-ellipsis whitespace-nowrap font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[18px] text-[#404040]"
            style={{ fontFeatureSettings: "'ss16'" }}
          >
            {location}
          </p>
          <p
            className="mt-[2px] overflow-hidden font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[18px] text-[#bbbbbb]"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
            }}
          >
            {description}
          </p>
        </div>

        {imageSrc ? (
          <div className="mt-[14px] h-[180px] w-full overflow-hidden rounded-[16px]">
            <img alt={title} className="h-full w-full object-cover" src={imageSrc} />
          </div>
        ) : null}
      </div>
    </button>
  );
}

function formatPlanForCard(plan: SavedPlan) {
  return {
    description: plan.description || "Description",
    imageSrc: plan.picturePreview || undefined,
    location: plan.where || plan.when || "Add a location",
    title: plan.title || "Untitled Plan",
  };
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

  return (
    <div className="h-full overflow-y-auto bg-[#ededed]" data-name="02 Auth / 01 Log in">
      <div className="mx-auto flex min-h-full w-full max-w-[390px] flex-col">
        <div className="px-[16px] pt-[16px]">
          <h1 className="font-['Milling_Trial:Triplex_1mm',sans-serif] text-[24px] leading-[30px] text-[#071c07]">
            Next Up
          </h1>
          <p className="mt-[6px] font-['Milling_Trial:Duplex_1mm',sans-serif] text-[16px] leading-[20px] text-[#071c07]">
            Your Upcoming Plans
          </p>
        </div>

        {savedPlans.length ? (
          <div className="flex flex-col gap-[18px] px-[16px] pb-[120px] pt-[24px]">
            {savedPlans.map((plan) => {
              const card = formatPlanForCard(plan);

              return (
                <PlanCard
                  key={plan.id}
                  description={card.description}
                  imageSrc={card.imageSrc}
                  isHighlighted={plan.id === highlightedPlanId}
                  location={card.location}
                  onClick={() => navigate("/add-specs", { state: { planId: plan.id } })}
                  title={card.title}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-[70vh] flex-col items-center justify-center px-[25px] pb-[24px]">
            <div className="flex w-full max-w-[292px] flex-col items-center gap-[28px] text-center">
              <div className="flex flex-col items-center gap-[8px]">
                <p className="font-['Milling_Trial:Triplex_1mm',sans-serif] text-[24px] leading-[30px] text-[#071c07]">
                  No plans ahead!
                </p>
                <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[20px] text-[#9a9a9a]">
                  Let us handle it, we will match you with 3 plans that we know you will enjoy.
                </p>
              </div>

              <DualActionButtons
                primary={{ label: "Join Plan", onClick: () => navigate("/join-plan") }}
                secondary={{ label: "Create Plan", onClick: () => navigate("/add-specs") }}
              />
            </div>
          </div>
        )}
      </div>

      {savedPlans.length ? (
        <button
          className="fixed bottom-[28px] left-1/2 z-20 ml-[115px] flex h-[64px] w-[64px] items-center justify-center rounded-full text-white shadow-[0_10px_24px_rgba(255,59,48,0.36)]"
          onClick={() => navigate("/add-specs")}
          style={{
            background: "linear-gradient(180deg, rgba(255,72,62,1) 0%, rgba(255,48,43,1) 100%)",
          }}
          type="button"
        >
          <Plus size={28} strokeWidth={2.4} />
        </button>
      ) : null}
    </div>
  );
}
