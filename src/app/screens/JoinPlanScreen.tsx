import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { LiquidGlassButton } from "../components/LiquidGlassButton";

export default function JoinPlanScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#ededed] px-[25px] pb-[32px]">
      <button
        className="mt-[20px] flex items-center gap-2 text-[#071c07]"
        onClick={() => navigate("/home")}
        type="button"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="flex flex-1 items-center justify-center">
        <div className="flex w-full max-w-[292px] flex-col items-center gap-[28px] text-center">
          <div className="flex flex-col items-center gap-[8px]">
            <h1 className="font-['Milling_Trial:Triplex_1mm',sans-serif] text-[24px] leading-[30px] text-[#071c07]">
              Coming soon
            </h1>
            <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[20px] text-[#9a9a9a]">
              Join Plan is not ready yet, but it will be here soon.
            </p>
          </div>

          <LiquidGlassButton className="w-full" onClick={() => navigate("/home")} variant="white">
            Back Home
          </LiquidGlassButton>
        </div>
      </div>
    </div>
  );
}
