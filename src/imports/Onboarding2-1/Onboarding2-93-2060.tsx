import svgPaths from "./svg-mb5692whd8";
import imgEllipse1 from "./7c742bfddce0d7b9c1204119ae8489dd7f25df5b.png";
import imgEllipse2 from "./99e6435e432711281f3c3bc63f6d0022fc22f96e.png";
import imgEllipse3 from "./c63f4248600727afdd94b313af2742a04ac02c2b.png";
import imgEllipse7 from "./54e026e93049710e09a10da3508605b9a49cb8c3.png";
import imgEllipse4 from "./03b894c85d83e18c3e69a7263549140fd8afc1b0.png";
import imgEllipse5 from "./bfa5339e66196e1879065ec7c5f4a36e76c2c900.png";

function Time() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-[22px] items-center justify-center min-w-px pt-[1.5px] relative" data-name="Time">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] relative shrink-0 text-[17px] text-black text-center whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        9:41
      </p>
    </div>
  );
}

function Frame() {
  return (
    <div className="h-[13px] relative shrink-0 w-[27.328px]" data-name="Frame">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.328 13">
        <g id="Frame">
          <rect height="12" id="Border" opacity="0.35" rx="3.8" stroke="var(--stroke-0, black)" width="24" x="0.5" y="0.5" />
          <path d={svgPaths.p7a14d80} fill="var(--fill-0, black)" id="Cap" opacity="0.4" />
          <rect fill="var(--fill-0, black)" height="9" id="Capacity" rx="2.5" width="21" x="2" y="2" />
        </g>
      </svg>
    </div>
  );
}

function Levels() {
  return (
    <div className="flex-[1_0_0] h-[22px] min-w-px relative" data-name="Levels">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[7px] items-center justify-center pr-px pt-px relative size-full">
          <div className="h-[12.226px] relative shrink-0 w-[19.2px]" data-name="Cellular Connection">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 12.2264">
              <path clipRule="evenodd" d={svgPaths.p1e09e400} fill="var(--fill-0, black)" fillRule="evenodd" id="Cellular Connection" />
            </svg>
          </div>
          <div className="h-[12.328px] relative shrink-0 w-[17.142px]" data-name="Wifi">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.1417 12.3283">
              <path clipRule="evenodd" d={svgPaths.p18b35300} fill="var(--fill-0, black)" fillRule="evenodd" id="Wifi" />
            </svg>
          </div>
          <Frame />
        </div>
      </div>
    </div>
  );
}

function InfoContent() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start not-italic relative shrink-0 w-[345px]" data-name="Info Content">
      <p className="font-['ABC_Monument_Grotesk_Unlicensed_Trial:Medium',sans-serif] leading-[24px] relative shrink-0 text-[20px] text-black w-full">Find your people</p>
      <div className="flex flex-col font-['ABC_Monument_Grotesk_Unlicensed_Trial:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#71717a] text-[14px] w-full">
        <p className="leading-[18px]">Meet people who match your vibe and energy. No random connections, just people who are up for the same things as you.</p>
      </div>
    </div>
  );
}

function ContentSignUp() {
  return (
    <div className="content-stretch flex flex-col items-start w-full" data-name="Content Sign Up">
      <InfoContent />
    </div>
  );
}

function Group() {
  return (
    <div className="relative shrink-0 w-[268px] h-[252px]">
      <div className="absolute left-[65px] size-[97px] top-[92px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="97" src={imgEllipse1} width="97" />
      </div>
      <div className="absolute left-[51px] size-[88px] top-0">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="88" src={imgEllipse2} width="88" />
      </div>
      <div className="absolute left-[148px] size-[94px] top-[31px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="94" src={imgEllipse3} width="94" />
      </div>
      <div className="absolute left-[162px] size-[106px] top-[130px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="106" src={imgEllipse7} width="106" />
      </div>
      <div className="absolute left-[56px] size-[55px] top-[197px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="55" src={imgEllipse4} width="55" />
      </div>
      <div className="absolute left-0 size-[65px] top-[76px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="65" src={imgEllipse5} width="65" />
      </div>
    </div>
  );
}

function Content() {
  return (
    <div className="flex flex-col flex-1 min-h-0 w-full" data-name="Content">
      <div className="flex flex-1 items-center justify-center min-h-0">
        <Group />
      </div>
      <div className="flex flex-col gap-[24px] px-[24px]">
        <ContentSignUp />
        <div className="bg-[#09090b] content-stretch flex gap-[4px] h-[45px] items-center justify-center px-[32px] py-[12px] rounded-[999px]" data-name="Button">
          <div className="flex flex-col font-['ABC_Monument_Grotesk_Unlicensed_Trial:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#fefefe] text-[16px] text-center whitespace-nowrap">
            <p className="leading-[21px]">Continue</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Onboarding() {
  return (
    <div className="bg-white flex flex-col pb-[32px] size-full" data-name="Onboarding 2">
      <Content />
    </div>
  );
}