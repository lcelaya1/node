import { useNavigate } from "react-router";
import { LiquidGlassButton } from "../components/LiquidGlassButton";

export default function NoPlansScreen() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#ededed] flex h-full flex-col items-center justify-between overflow-hidden px-[25px] pb-[8px]" data-name="02 Auth / 01 Log in">
      <div />
      <div className="flex flex-col items-center gap-[8px] not-italic text-center w-[292px]" data-name="Info Content">
        <p className="font-['Milling_Trial:Triplex_1mm',sans-serif] leading-[30px] relative shrink-0 text-[#071c07] text-[24px] w-full">No plans ahead!</p>
        <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] leading-[18px] relative shrink-0 text-[#9a9a9a] text-[12px] w-[286px]">Let us handle it, we will match you with 3 plans that we know you will enjoy.</p>
      </div>
      <div className="flex w-full gap-[8px] items-center">
        <LiquidGlassButton 
          variant="red" 
          onClick={() => navigate('/join-plan')}
          className="w-[164px]"
        >
          Join Plan
        </LiquidGlassButton>
        <LiquidGlassButton 
          variant="white" 
          onClick={() => navigate('/add-specs')}
          className="w-[172px]"
        >
          Create Plan
        </LiquidGlassButton>
      </div>
    </div>
  );
}
