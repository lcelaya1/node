import svgPaths from "./svg-5vdh4m8d9d";
import imgRectangle1 from "./d71adbbd75a6058eb54bbe101e0aa79bcdcdb1ac.png";
import imgRectangle2 from "./b8f37e23b800ebfea321ded39d699db9bb424ab8.png";
import imgRectangle3 from "./658312597027029fbdfa0cb56d27fd3a6b129582.png";

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

function Date() {
  return (
    <div className="content-stretch flex gap-[2.667px] items-center relative shrink-0 w-full" data-name="date">
      <div className="relative shrink-0 size-[8px]" data-name="Calendar">
        <div className="absolute inset-[22.92%_18.75%_18.75%_18.75%]">
          <div className="absolute inset-[-5%_-4.67%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.46667 5.13333">
              <path d={svgPaths.p17e01700} id="Rectangle 25" stroke="var(--stroke-0, #09090B)" strokeWidth="0.466667" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-[14.58%_35.42%_68.75%_35.42%]" data-name="Vector">
          <div className="absolute inset-[-17.5%_-10%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.8 1.8">
              <path d={svgPaths.p33d4e2c0} id="Vector" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeWidth="0.466667" />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex flex-[1_0_0] flex-col justify-center leading-[0] min-w-px relative">
        <p className="type-body-xs text-primary-token">Apr 20 - 11am</p>
      </div>
    </div>
  );
}

function EpLocation() {
  return (
    <div className="relative shrink-0 size-[8px]" data-name="ep:location">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
        <g id="ep:location">
          <path d={svgPaths.p23c84500} fill="var(--fill-0, #09090B)" id="Vector" />
          <path d={svgPaths.p31873780} fill="var(--fill-0, #09090B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Location() {
  return (
    <div className="content-stretch flex gap-[2.667px] items-center relative shrink-0 w-full" data-name="location">
      <EpLocation />
      <div className="flex flex-[1_0_0] flex-col justify-center leading-[0] min-w-px relative">
        <p className="type-body-xs text-primary-token">Montserrat (3.4km)</p>
      </div>
    </div>
  );
}

function Info() {
  return (
    <div className="content-stretch flex flex-col gap-[2.667px] items-start relative shrink-0 w-full" data-name="info">
      <Date />
      <Location />
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[8px] items-start pb-[10.667px] pt-[14.667px] px-[14.667px] relative size-full">
        <div className="flex flex-col justify-center leading-[0] relative shrink-0 w-full">
          <p className="type-heading-m text-primary-token">Book Finding in Madrid</p>
        </div>
        <Info />
      </div>
    </div>
  );
}

function Date1() {
  return (
    <div className="content-stretch flex gap-[2.667px] items-center relative shrink-0 w-full" data-name="date">
      <div className="relative shrink-0 size-[8px]" data-name="Calendar">
        <div className="absolute inset-[22.92%_18.75%_18.75%_18.75%]">
          <div className="absolute inset-[-5%_-4.67%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.46667 5.13333">
              <path d={svgPaths.p17e01700} id="Rectangle 25" stroke="var(--stroke-0, #09090B)" strokeWidth="0.466667" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-[14.58%_35.42%_68.75%_35.42%]" data-name="Vector">
          <div className="absolute inset-[-17.5%_-10%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.8 1.8">
              <path d={svgPaths.p33d4e2c0} id="Vector" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeWidth="0.466667" />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex flex-[1_0_0] flex-col justify-center leading-[0] min-w-px relative">
        <p className="type-body-xs text-primary-token">May 18 - 5pm</p>
      </div>
    </div>
  );
}

function EpLocation1() {
  return (
    <div className="relative shrink-0 size-[8px]" data-name="ep:location">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
        <g id="ep:location">
          <path d={svgPaths.p23c84500} fill="var(--fill-0, #09090B)" id="Vector" />
          <path d={svgPaths.p31873780} fill="var(--fill-0, #09090B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Location1() {
  return (
    <div className="content-stretch flex gap-[2.667px] items-center relative shrink-0 w-full" data-name="location">
      <EpLocation1 />
      <div className="flex flex-[1_0_0] flex-col justify-center leading-[0] min-w-px relative">
        <p className="type-body-xs text-primary-token">Madrid Center (1.1km)</p>
      </div>
    </div>
  );
}

function Info1() {
  return (
    <div className="content-stretch flex flex-col gap-[2.667px] items-start relative shrink-0 w-full" data-name="info">
      <Date1 />
      <Location1 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[8px] items-start pb-[10.667px] pt-[14.667px] px-[14.667px] relative size-full">
        <div className="flex flex-col justify-center leading-[0] relative shrink-0 w-full">
          <p className="type-heading-m text-primary-token">Going to a Montserrat viewpoint</p>
        </div>
        <Info1 />
      </div>
    </div>
  );
}

function Date2() {
  return (
    <div className="content-stretch flex gap-[3.423px] items-center relative shrink-0 w-full" data-name="date">
      <div className="relative shrink-0 size-[10.268px]" data-name="Calendar">
        <div className="absolute inset-[22.92%_18.75%_18.75%_18.75%]">
          <div className="absolute inset-[-5%_-4.67%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.01614 6.58832">
              <path d={svgPaths.p72b6980} id="Rectangle 25" stroke="var(--stroke-0, #09090B)" strokeWidth="0.598938" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-[14.58%_35.42%_68.75%_35.42%]" data-name="Vector">
          <div className="absolute inset-[-17.5%_-10%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.59363 2.31019">
              <path d={svgPaths.p3e899e0} id="Vector" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeWidth="0.598938" />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex flex-[1_0_0] flex-col justify-center leading-[0] min-w-px relative">
        <p className="type-body-xs text-primary-token">May 12 - 6pm</p>
      </div>
    </div>
  );
}

function EpLocation2() {
  return (
    <div className="relative shrink-0 size-[10.268px]" data-name="ep:location">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.2675 10.2675">
        <g id="ep:location">
          <path d={svgPaths.p2076cf00} fill="var(--fill-0, #09090B)" id="Vector" />
          <path d={svgPaths.p3f172e00} fill="var(--fill-0, #09090B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Location2() {
  return (
    <div className="content-stretch flex gap-[3.423px] items-center relative shrink-0 w-full" data-name="location">
      <EpLocation2 />
      <div className="flex flex-[1_0_0] flex-col justify-center leading-[0] min-w-px relative">
        <p className="type-body-xs text-primary-token">Playa Almadrava</p>
      </div>
    </div>
  );
}

function Info2() {
  return (
    <div className="content-stretch flex flex-col gap-[3.423px] items-start relative shrink-0 w-full" data-name="info">
      <Date2 />
      <Location2 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[10.268px] items-start pb-[13.69px] pt-[18.824px] px-[18.824px] relative size-full">
        <div className="flex flex-col justify-center leading-[0] relative shrink-0 w-full">
          <p className="type-heading-m text-primary-token">Picnic and cards on the beach</p>
        </div>
        <Info2 />
      </div>
    </div>
  );
}

function InfoContent() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start not-italic relative shrink-0 w-[345px]" data-name="Info Content">
      <p className="type-heading-l relative shrink-0 text-primary-token w-full">It’s all here for you.</p>
      <div className="flex flex-col justify-center leading-[0] relative shrink-0 w-full">
        <p className="type-body-m text-secondary-token">Answer a few questions and Node builds your perfect plan. Every plan is made for you, not anyone else and is filtered to your mood, budget and distance.</p>
      </div>
    </div>
  );
}

function ContentSignUp() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Content Sign Up">
      <InfoContent />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col items-start w-full">
      <ContentSignUp />
    </div>
  );
}

function Content() {
  return (
    <div className="flex flex-col flex-1 min-h-0 w-full" data-name="Content">
      <div className="flex flex-1 items-center justify-center min-h-0">
        <div className="relative shrink-0 w-[346px] h-[403px]">
          <div className="absolute bg-[#fefefe] content-stretch drop-shadow-[0px_4px_2px_rgba(0,0,0,0.1)] flex flex-col h-[314px] items-start justify-end left-0 opacity-20 rounded-[16px] top-[39px] w-[206px]" data-name="Plan Card">
            <div aria-hidden="true" className="absolute border-[#e4e4e7] border-[0.667px] border-solid inset-0 pointer-events-none rounded-[16px]" />
            <Frame1 />
            <div className="flex-[1_0_0] min-h-px relative rounded-[16px] w-full">
              <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[16px]">
                <img alt="" className="absolute max-w-none object-cover rounded-[16px] size-full" src={imgRectangle1} />
                <div className="absolute bg-[rgba(0,0,0,0.2)] inset-0 rounded-[16px]" />
              </div>
            </div>
          </div>
          <div className="absolute bg-[#fefefe] content-stretch drop-shadow-[0px_4px_2px_rgba(0,0,0,0.1)] flex flex-col h-[314px] items-start justify-end left-[140px] opacity-20 rounded-[16px] top-[39px] w-[206px]" data-name="Plan Card">
            <div aria-hidden="true" className="absolute border-[#e4e4e7] border-[0.667px] border-solid inset-0 pointer-events-none rounded-[16px]" />
            <Frame2 />
            <div className="flex-[1_0_0] min-h-px relative rounded-[16px] w-full">
              <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[16px]">
                <img alt="" className="absolute max-w-none object-cover rounded-[16px] size-full" src={imgRectangle2} />
                <div className="absolute bg-[rgba(0,0,0,0.2)] inset-0 rounded-[16px]" />
              </div>
            </div>
          </div>
          <div className="absolute bg-[#fefefe] content-stretch drop-shadow-[0px_4px_6.1px_rgba(0,0,0,0.15)] flex flex-col h-[403px] items-start justify-end left-[41px] rounded-[20px] top-0 w-[264.389px]" data-name="Plan Card">
            <div aria-hidden="true" className="absolute border-[#e4e4e7] border-[0.856px] border-solid inset-0 pointer-events-none rounded-[20px]" />
            <Frame3 />
            <div className="flex-[1_0_0] min-h-px relative w-full overflow-hidden" style={{ borderRadius: 20 }}>
              <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
                <img alt="" className="absolute max-w-none object-cover size-full" src={imgRectangle3} />
                <div className="absolute inset-0 bg-[rgba(0,0,0,0.2)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-[28px] px-[24px]">
        <Frame4 />
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
    <div className="bg-white flex flex-col pb-[32px] size-full" data-name="Onboarding 1">
      <Content />
    </div>
  );
}