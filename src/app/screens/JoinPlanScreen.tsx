import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { LiquidGlassButton } from "../components/LiquidGlassButton";

export default function JoinPlanScreen() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#ededed] h-full overflow-hidden px-[25px]">
      {/* Back Button */}
      <button
        onClick={() => navigate('/home')}
        className="mt-[20px] flex items-center gap-2 text-[#071c07]"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Content */}
      <div className="flex flex-col gap-6 pb-[8px] pt-[28px]">
        <div className="flex flex-col gap-2">
          <h1 className="font-['Milling_Trial:Triplex_1mm',sans-serif] text-[28px] leading-[34px] text-[#071c07]">
            Join a Plan
          </h1>
          <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[20px] text-[#848884]">
            We'll match you with 3 curated plans based on your preferences.
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-8">
          {[1, 2, 3].map((plan) => (
            <div
              key={plan}
              className="bg-white rounded-[20px] p-5 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.08)]"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-['Milling_Trial:Triplex_1mm',sans-serif] text-[18px] leading-[24px] text-[#071c07]">
                      Weekend Adventure {plan}
                    </h3>
                    <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[12px] leading-[16px] text-[#848884] mt-1">
                      Saturday, March {15 + plan}, 2026
                    </p>
                  </div>
                  <div className="bg-[#fc312e] rounded-full px-3 py-1">
                    <span className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[11px] text-white">
                      {plan + 2} spots left
                    </span>
                  </div>
                </div>
                <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[13px] leading-[18px] text-[#404040]">
                  A curated experience crafted just for you. Join others for an unforgettable time.
                </p>
                <LiquidGlassButton 
                  variant="red" 
                  onClick={() => navigate('/home')}
                  className="w-full mt-2"
                >
                  Join This Plan
                </LiquidGlassButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
