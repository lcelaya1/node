import svgPaths from "./svg-7gdm0lpzdd";
import imgMarket1 from "./market1.png";
import imgMarket2 from "./market2.png";
import imgMarket3 from "./market3.png";

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
    <div className="content-stretch flex flex-col gap-[12px] items-start not-italic relative shrink-0 w-[345px]" data-name="Info Content">
      <p className="type-heading-l relative shrink-0 text-primary-token w-full">Save and share your plans</p>
      <div className="flex flex-col justify-center leading-[0] relative shrink-0 w-full">
        <p className="type-body-m text-secondary-token">{`Every time you say 'yes' to a plan, it becomes part of your story. Keep a beautiful archive of your life offline.`}</p>
      </div>
    </div>
  );
}

function ContentSignUp1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[345px]" data-name="Content Sign Up">
      <InfoContent />
    </div>
  );
}

function ContentSignUp() {
  return (
    <div className="content-stretch flex flex-col items-start w-full" data-name="Content Sign Up">
      <ContentSignUp1 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="w-full min-w-0 overflow-hidden rounded-[16px] border border-card-token bg-surface-primary p-[16px]">
      <div className="flex flex-col gap-[20px]">
        <p className="type-heading-m text-primary-token">Street food at the market</p>
        <div className="-mr-[16px] flex h-[168px] min-w-0 w-auto items-start gap-[12px] overflow-x-auto overflow-y-hidden pb-[2px] pr-[16px]">
          <div className="h-[168px] w-[150px] shrink-0 overflow-hidden rounded-[16px] bg-surface-secondary">
            <img alt="" className="size-full object-cover" draggable={false} src={imgMarket1} />
          </div>
          <div className="h-[168px] w-[150px] shrink-0 overflow-hidden rounded-[16px] bg-surface-secondary">
            <img alt="" className="size-full object-cover" draggable={false} src={imgMarket2} />
          </div>
          <div className="h-[168px] w-[150px] shrink-0 overflow-hidden rounded-[16px] bg-surface-secondary">
            <img alt="" className="size-full object-cover" draggable={false} src={imgMarket3} />
          </div>
        </div>
        <div className="relative flex w-full max-w-[329px] shrink-0 flex-col items-start justify-center gap-[8px]">
          <div className="flex min-w-0 w-full shrink-0 flex-col justify-center text-primary-token">
            <p className="type-body-m line-clamp-2 break-words">It was a pleasure to know this part of Barcelona. I felt like a local for the first time</p>
          </div>
          <div className="flex shrink-0 flex-col justify-center text-secondary-token">
            <p className="type-body-s whitespace-nowrap">13 June 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Content() {
  return (
    <div className="flex flex-col flex-1 min-h-0 w-full" data-name="Content">
      <div className="flex flex-1 items-center justify-center min-h-0 px-[24px]">
        <Frame2 />
      </div>
      <div className="flex flex-col gap-[28px] px-[24px]">
        <ContentSignUp />
        <div className="bg-[#fc312e] content-stretch flex gap-[4px] h-[45px] items-center justify-center px-[32px] py-[12px] rounded-[999px]" data-name="Button">
          <div className="flex flex-col font-['ABC_Monument_Grotesk_Unlicensed_Trial:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#fefefe] text-[16px] text-center whitespace-nowrap">
            <p className="leading-[21px]">Start</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Onboarding() {
  return (
    <div className="bg-white flex flex-col pb-[32px] size-full" data-name="Onboarding 4">
      <Content />
    </div>
  );
}