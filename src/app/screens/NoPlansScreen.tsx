import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { DualActionButtons } from "../components/DualActionButtons";
import { loadSavedPlans } from "../lib/plans";

export default function NoPlansScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedPlans = loadSavedPlans();
    if (savedPlans.length) {
      navigate("/plans-home", {
        replace: true,
        state: location.state,
      });
    }
  }, [location.state, navigate]);

  return (
    <div className="bg-[#ededed] flex h-full flex-col items-center overflow-hidden px-[25px] pb-[8px]" data-name="02 Auth / 01 Log in">
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-[28px] not-italic text-center w-full">
          <div className="flex flex-col items-center gap-[8px] w-[292px]" data-name="Info Content">
            <p className="font-['Milling_Trial:Triplex_1mm',sans-serif] leading-[30px] relative shrink-0 text-[#071c07] text-[24px] w-full">No plans ahead!</p>
            <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] leading-[20px] relative shrink-0 text-[#9a9a9a] text-[14px] w-[286px]">Let us handle it, we will match you with 3 plans that we know you will enjoy.</p>
          </div>

          <DualActionButtons
            primary={{ label: "Join Plan", onClick: () => navigate("/join-plan") }}
            secondary={{ label: "Create Plan", onClick: () => navigate("/add-specs") }}
          />
        </div>
      </div>
    </div>
  );
}
