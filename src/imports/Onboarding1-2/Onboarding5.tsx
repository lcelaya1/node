import svgPaths from "./svg-5vdh4m8d9d";
import imgRectangle1 from "./d71adbbd75a6058eb54bbe101e0aa79bcdcdb1ac.png";
import imgRectangle2 from "./b8f37e23b800ebfea321ded39d699db9bb424ab8.png";
import imgRectangle3 from "./658312597027029fbdfa0cb56d27fd3a6b129582.png";
import { CreateAccountBackButton } from "../../app/components/CreateAccountBackButton";

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

function CardDate({ date }: { date: string }) {
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
      <div className="flex flex-[1_0_0] flex-col font-['ABC_Monument_Grotesk_Unlicensed_Trial:Regular',sans-serif] justify-center leading-[0] min-w-px not-italic relative text-[#09090b] text-[9.33px]">
        <p className="leading-[12px]">{date}</p>
      </div>
    </div>
  );
}

function CardLocation({ location }: { location: string }) {
  return (
    <div className="content-stretch flex gap-[2.667px] items-center relative shrink-0 w-full" data-name="location">
      <div className="relative shrink-0 size-[8px]" data-name="ep:location">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <g id="ep:location">
            <path d={svgPaths.p23c84500} fill="var(--fill-0, #09090B)" id="Vector" />
            <path d={svgPaths.p31873780} fill="var(--fill-0, #09090B)" id="Vector_2" />
          </g>
        </svg>
      </div>
      <div className="flex flex-[1_0_0] flex-col font-['ABC_Monument_Grotesk_Unlicensed_Trial:Regular',sans-serif] justify-center leading-[0] min-w-px not-italic relative text-[#09090b] text-[9.33px]">
        <p className="leading-[12px]">{location}</p>
      </div>
    </div>
  );
}

function SmallCardContent({ title, date, location }: { title: string; date: string; location: string }) {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[8px] items-start pb-[10.667px] pt-[14.667px] px-[14.667px] relative size-full">
        <div className="flex flex-col font-['ABC_Monument_Grotesk_Unlicensed_Trial:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[13.33px] w-full">
          <p className="leading-[16px]">{title}</p>
        </div>
        <div className="content-stretch flex flex-col gap-[2.667px] items-start relative shrink-0 w-full">
          <CardDate date={date} />
          <CardLocation location={location} />
        </div>
      </div>
    </div>
  );
}

function LargeCardDate({ date }: { date: string }) {
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
      <div className="flex flex-[1_0_0] flex-col font-['ABC_Monument_Grotesk_Unlicensed_Trial:Regular',sans-serif] justify-center leading-[0] min-w-px not-italic relative text-[#09090b] text-[11.98px]">
        <p className="leading-[15.401px]">{date}</p>
      </div>
    </div>
  );
}

function LargeCardLocation({ location }: { location: string }) {
  return (
    <div className="content-stretch flex gap-[3.423px] items-center relative shrink-0 w-full" data-name="location">
      <div className="relative shrink-0 size-[10.268px]" data-name="ep:location">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.2675 10.2675">
          <g id="ep:location">
            <path d={svgPaths.p2076cf00} fill="var(--fill-0, #09090B)" id="Vector" />
            <path d={svgPaths.p3f172e00} fill="var(--fill-0, #09090B)" id="Vector_2" />
          </g>
        </svg>
      </div>
      <div className="flex flex-[1_0_0] flex-col font-['ABC_Monument_Grotesk_Unlicensed_Trial:Regular',sans-serif] justify-center leading-[0] min-w-px not-italic relative text-[#09090b] text-[11.98px]">
        <p className="leading-[15.401px]">{location}</p>
      </div>
    </div>
  );
}

function LargeCardContent({ title, date, location }: { title: string; date: string; location: string }) {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[10.268px] items-start pb-[13.69px] pt-[18.824px] px-[18.824px] relative size-full">
        <div className="flex flex-col font-['ABC_Monument_Grotesk_Unlicensed_Trial:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[17.11px] w-full">
          <p className="leading-[20.535px]">{title}</p>
        </div>
        <div className="content-stretch flex flex-col gap-[3.423px] items-start relative shrink-0 w-full">
          <LargeCardDate date={date} />
          <LargeCardLocation location={location} />
        </div>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[23px] top-[238px]">
      <div className="absolute bg-[#fefefe] content-stretch drop-shadow-[0px_4px_2px_rgba(0,0,0,0.1)] flex flex-col h-[314px] items-start justify-end left-[23px] opacity-20 rounded-[16px] top-[277px] w-[206px]" data-name="Plan Card">
        <div aria-hidden="true" className="absolute border-[#e4e4e7] border-[0.667px] border-solid inset-0 pointer-events-none rounded-[16px]" />
        <SmallCardContent title="Title of the plan will be displayed like this" date="May 12 - 6pm" location="Location (1.2km)" />
        <div className="flex-[1_0_0] min-h-px relative rounded-[16px] w-full">
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[16px]">
            <img alt="" className="absolute max-w-none object-cover rounded-[16px] size-full" src={imgRectangle1} />
            <div className="absolute bg-[rgba(0,0,0,0.2)] inset-0 rounded-[16px]" />
          </div>
        </div>
      </div>
      <div className="absolute bg-[#fefefe] content-stretch drop-shadow-[0px_4px_2px_rgba(0,0,0,0.1)] flex flex-col h-[314px] items-start justify-end left-[calc(25%+64.75px)] opacity-20 rounded-[16px] top-[277px] w-[206px]" data-name="Plan Card">
        <div aria-hidden="true" className="absolute border-[#e4e4e7] border-[0.667px] border-solid inset-0 pointer-events-none rounded-[16px]" />
        <SmallCardContent title="Title of the plan will be displayed like this" date="May 12 - 6pm" location="Location (1.2km)" />
        <div className="flex-[1_0_0] min-h-px relative rounded-[16px] w-full">
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[16px]">
            <img alt="" className="absolute max-w-none object-cover rounded-[16px] size-full" src={imgRectangle2} />
            <div className="absolute bg-[rgba(0,0,0,0.2)] inset-0 rounded-[16px]" />
          </div>
        </div>
      </div>
      <div className="absolute bg-[#fefefe] content-stretch drop-shadow-[0px_4px_6.1px_rgba(0,0,0,0.15)] flex flex-col h-[403px] items-start justify-end left-[64px] rounded-[20.535px] top-[238px] w-[264.389px]" data-name="Plan Card">
        <div aria-hidden="true" className="absolute border-[#e4e4e7] border-[0.856px] border-solid inset-0 pointer-events-none rounded-[20.535px]" />
        <LargeCardContent title="Picnic y Cartas en la Playa" date="May 12 - 6pm" location="Playa Almadrava" />
        <div className="flex-[1_0_0] min-h-px relative rounded-[20.535px] w-full">
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[20.535px]">
            <img alt="" className="absolute max-w-none object-cover rounded-[20.535px] size-full" src={imgRectangle3} />
            <div className="absolute bg-[rgba(0,0,0,0.2)] inset-0 rounded-[20.535px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentSignUp() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[24px] top-[113px] w-[345px]" data-name="Content Sign Up">
      <div className="content-stretch flex flex-col gap-[8px] items-start not-italic relative shrink-0 w-[345px]" data-name="Info Content">
        <p className="font-['ABC_Monument_Grotesk_Unlicensed_Trial:Medium',sans-serif] leading-[24px] relative shrink-0 text-[20px] text-black w-full">Select your interests.</p>
        <div className="flex flex-col font-['ABC_Monument_Grotesk_Unlicensed_Trial:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#71717a] text-[14px] w-full">
          <p className="leading-[18px]">Swipe and select the plans that interest you the most, based on these we can approach you with unique and tailored plans for your liking.</p>
        </div>
      </div>
    </div>
  );
}

function MdiHeart({ onClick }: { onClick?: () => void }) {
  return (
    <div className="absolute left-[calc(50%+77.5px)] size-[36px] top-[587px] cursor-pointer" data-name="mdi:heart" onClick={onClick}>
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
        <g id="mdi:heart">
          <rect fill="var(--fill-0, white)" height="36" rx="18" width="36" />
          <path d={svgPaths.p19dd4d00} fill="var(--fill-0, #FC312E)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

type Props = {
  onContinue?: () => void;
  onBack?: () => void;
};

export default function Onboarding5({ onContinue, onBack }: Props) {
  return (
    <div className="bg-white relative size-full" data-name="Onboarding 5">
      <div className="absolute content-stretch flex gap-[154px] items-center justify-center left-0 pb-[19px] pt-[21px] px-[24px] top-0 w-[393px]" data-name="Status Bar">
        <Time />
        <Levels />
      </div>
      <div className="absolute left-0 top-[62px] w-full px-[24px]">
        <CreateAccountBackButton onClick={onBack} />
      </div>
      <Group />
      <ContentSignUp />
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['ABC_Monument_Grotesk_Unlicensed_Trial:Regular',sans-serif] justify-center leading-[0] left-[195.5px] not-italic text-[#09090b] text-[14px] text-center top-[704px] w-[345px]">
        <p className="leading-[18px]">1/5</p>
      </div>
      <MdiHeart onClick={onContinue} />
    </div>
  );
}
