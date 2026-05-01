import svgPaths from "./svg-5pe0o2btcd";
import imgRectangle3 from "./1d4a5be4f590ae051a9124059435bcabd1c35c9a.png";
import imgRectangle4 from "./0b42a44d32667949c6e908aa75414565293d1d9c.png";
import imgRectangle5 from "./013450d245e5fec3448a756985226df66b4c9636.png";
import imgRectangle6 from "./8a0e19358e2f5bd5028be349081fbeb730f40d74.png";
import imgRectangle7 from "./e5383d30c3fc2901cd6298c589af694ae7c9981f.png";

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

function Frame3() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center leading-[0] not-italic relative shrink-0 whitespace-nowrap">
      <div className="flex flex-col font-['ABC_Monument_Grotesk_Unlicensed_Trial:Regular',sans-serif] justify-center relative shrink-0 text-[#71717a] text-[12px]">
        <p className="leading-[16px]">Friday, March 20</p>
      </div>
      <div className="flex flex-col font-['ABC_Monument_Grotesk_Unlicensed_Trial:Medium',sans-serif] justify-center relative shrink-0 text-[#09090b] text-[32px]">
        <p className="leading-[36px]">Hello, Cristina!</p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[20px] top-[62px] w-[353px]">
      <Frame3 />
      <div className="relative rounded-[999px] shrink-0 size-[40px]">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[999px]">
          <img alt="" className="absolute max-w-none object-cover rounded-[999px] size-full" src={imgRectangle3} />
          <img alt="" className="absolute max-w-none object-cover rounded-[999px] size-full" src={imgRectangle4} />
        </div>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="h-[125.435px] relative shrink-0 w-[170.871px]">
      <div className="absolute h-[107.551px] left-0 rounded-[8px] top-[8.94px] w-[78.402px]">
        <div className="absolute inset-0 opacity-50 overflow-hidden pointer-events-none rounded-[8px]">
          <img alt="" className="absolute h-[104.3%] left-[0.02%] max-w-none top-[-4.34%] w-[105.93%]" src={imgRectangle5} />
        </div>
      </div>
      <div className="absolute h-[107.551px] left-[92.47px] rounded-[8px] top-[8.94px] w-[78.402px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover opacity-50 pointer-events-none rounded-[8px] size-full" src={imgRectangle6} />
      </div>
      <div className="absolute h-[125.435px] left-[39.72px] rounded-[8px] top-0 w-[91.439px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full" src={imgRectangle7} />
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-full">
      <Frame7 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-center w-full">
      <div className="flex flex-col font-['ABC_Monument_Grotesk_Unlicensed_Trial:Medium',sans-serif] justify-center relative shrink-0 text-[24px] w-[208px]">
        <p className="leading-[28px]">When if not today?</p>
      </div>
      <div className="flex flex-col font-['ABC_Monument_Grotesk_Unlicensed_Trial:Regular',sans-serif] justify-center relative shrink-0 text-[14px] w-[208px]">
        <p className="leading-[18px] mb-0">You have nothing planned yet.</p>
        <p className="leading-[18px]">{`It’s time to start a new experience. `}</p>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex flex-col gap-[24px] items-center left-0 px-[20px] top-[calc(50%+1.5px)] w-[393px]">
      <Frame4 />
      <Frame5 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center justify-center min-w-px relative">
      <div className="bg-[#fc312e] content-stretch flex items-center p-[10px] relative rounded-[999px] shrink-0" data-name="Icon Button">
        <div className="relative shrink-0 size-[24px]" data-name="Add">
          <div className="absolute bottom-1/4 left-1/2 right-1/2 top-1/4">
            <div className="absolute inset-[-4.17%_-0.5px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 13">
                <path d="M0.5 0.5V12.5" id="Vector 52" stroke="var(--stroke-0, #FEFEFE)" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-1/2 flex items-center justify-center left-1/4 right-1/4 top-1/2" style={{ containerType: "size" }}>
            <div className="flex-none h-[100cqw] rotate-90 w-[190644000cqh]">
              <div className="relative size-full">
                <div className="absolute inset-[-4.17%_-0.5px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 13">
                    <path d="M0.5 0.5V12.5" id="Vector 53" stroke="var(--stroke-0, #FEFEFE)" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomeEmptyState() {
  return (
    <div className="bg-[#fefefe] relative size-full" data-name="Home - Empty state">
      <Frame2 />
      <Frame6 />
      <div className="absolute bg-[#fefefe] bottom-0 content-stretch flex items-center justify-center left-0 pb-[24px] pt-[4px] right-0" data-name="Tab Bar">
        <div aria-hidden="true" className="absolute border-[#e4e4e7] border-solid border-t inset-0 pointer-events-none" />
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-center min-w-px py-[8px] relative" data-name="Tab">
          <div className="relative shrink-0 size-[24px]" data-name="Home">
            <div className="absolute inset-[16.67%_22.92%_18.75%_22.92%]">
              <div className="absolute inset-[-2.34%_-3.85%_-3.23%_-3.85%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.0006 16.3632">
                  <path d={svgPaths.pb6d90e0} id="Rectangle 1" stroke="var(--stroke-2, #09090B)" />
                </svg>
              </div>
            </div>
            <div className="absolute inset-[58.33%_39.58%_20.83%_39.58%]">
              <div className="absolute inset-[-10%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
                  <path d="M5.5 5.5V0.5H0.5V5.5" id="Vector 3" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
          <p className="font-['ABC_Monument_Grotesk_Unlicensed_Trial:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#09090b] text-[12px] whitespace-nowrap">Home</p>
        </div>
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-center min-w-px py-[8px] relative" data-name="Tab">
          <div className="relative shrink-0 size-[24px]" data-name="Comment">
            <div className="absolute flex inset-[12.5%_15.69%_14.72%_11.53%] items-center justify-center" style={{ containerType: "size" }}>
              <div className="-scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                <div className="relative size-full" data-name="Vector">
                  <div className="absolute inset-[-2.86%]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.4667 18.4667">
                      <path d={svgPaths.p34a93900} id="Vector" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="font-['ABC_Monument_Grotesk_Unlicensed_Trial:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#09090b] text-[12px] whitespace-nowrap">Circles</p>
        </div>
        <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
          <Frame1 />
        </div>
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-center min-w-px py-[8px] relative" data-name="Tab">
          <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Camera">
            <div className="absolute inset-[15.91%_8.33%]" data-name="Icon">
              <div className="absolute inset-[-3.06%_-2.5%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 17.3636">
                  <g id="Icon">
                    <path d={svgPaths.p28624200} stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" />
                    <path d={svgPaths.p4039cc0} stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <p className="font-['ABC_Monument_Grotesk_Unlicensed_Trial:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#09090b] text-[12px] whitespace-nowrap">Diary</p>
        </div>
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-center min-w-px py-[8px] relative" data-name="Tab">
          <div className="relative shrink-0 size-[24px]" data-name="User">
            <div className="absolute bottom-1/2 left-[33.33%] right-[33.33%] top-[16.67%]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
                <circle cx="4" cy="4" id="Ellipse 46" r="3.5" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" />
              </svg>
            </div>
            <div className="absolute inset-[56.25%_18.75%_18.75%_18.75%]">
              <div className="absolute inset-[-8.33%_-3.01%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9033 7">
                  <path d={svgPaths.p1cbd3f70} id="Rectangle 4160" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
          <p className="font-['ABC_Monument_Grotesk_Unlicensed_Trial:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#09090b] text-[12px] whitespace-nowrap">Profile</p>
        </div>
      </div>
    </div>
  );
}