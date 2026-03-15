import svgPaths from "./svg-cc1p0e8n12";
import imgImage1 from "../assets/d92dc11944c0835af8728de9c8586c5a5d0d5a38.png";
type MembersBackgroundImageAndTextProps = {
  text: string;
};

function MembersBackgroundImageAndText({ text }: MembersBackgroundImageAndTextProps) {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative">
      <div className="h-[24px] relative shrink-0 w-[54.75px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 54.75 24">
          <g id="Frame 2">
            <circle cx="12" cy="12" fill="var(--fill-0, #D9D9D9)" id="Ellipse 1" r="11.6406" stroke="var(--stroke-0, #F7F7F7)" strokeWidth="0.71875" />
            <circle cx="27.375" cy="12" fill="var(--fill-0, #D9D9D9)" id="Ellipse 2" r="11.6406" stroke="var(--stroke-0, #F7F7F7)" strokeWidth="0.71875" />
            <circle cx="42.75" cy="12" fill="var(--fill-0, #D9D9D9)" id="Ellipse 3" r="11.6406" stroke="var(--stroke-0, #F7F7F7)" strokeWidth="0.71875" />
          </g>
        </svg>
      </div>
      <div className="flex flex-col font-['Milling_Trial:Duplex_1mm',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#b0b0b0] text-[10px] whitespace-nowrap">
        <p className="leading-[20px]">{text}</p>
      </div>
    </div>
  );
}
type TextBackgroundImageAndTextProps = {
  text: string;
};

function TextBackgroundImageAndText({ text }: TextBackgroundImageAndTextProps) {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center justify-center leading-[0] not-italic relative rounded-[100px] shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0">
        <div className="flex flex-col font-['Milling_Trial:Triplex_1mm',sans-serif] justify-center relative shrink-0 text-[#fc312e] text-[14px] w-[207px]" style={{ fontFeatureSettings: "'ss16'" }}>
          <p className="leading-[normal]">{`Caffe Break `}</p>
        </div>
        <div className="flex flex-col font-['Milling_Trial:Duplex_1mm',sans-serif] justify-center relative shrink-0 text-[#404040] text-[12px] w-[207px]" style={{ fontFeatureSettings: "'ss16'" }}>
          <p className="leading-[normal]">{"Nomad Coffee, El Born Barcelona"}</p>
        </div>
      </div>
      <div className="flex flex-col font-['Milling_Trial:Duplex_1mm',sans-serif] justify-center min-w-full relative shrink-0 text-[#bbb] text-[12px] w-[min-content]" style={{ fontFeatureSettings: "'ss16'" }}>
        <p className="leading-[normal]">{text}</p>
      </div>
    </div>
  );
}

function FillBackgroundImage() {
  return (
    <div className="absolute inset-0 rounded-[296px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[296px]">
        <div className="absolute bg-[#333] inset-0 mix-blend-color-dodge rounded-[296px]" />
        <div className="absolute inset-0 rounded-[296px]" style={{ backgroundImage: "linear-gradient(90deg, rgb(247, 247, 247) 0%, rgb(247, 247, 247) 100%), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.5) 100%)" }} />
      </div>
    </div>
  );
}

export default function Component02Auth01LogIn() {
  return (
    <div className="bg-[#ebebeb] relative size-full" data-name="02 Auth / 01 Log in">
      <div className="absolute left-0 right-0 top-0" data-name="Status Bar">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex gap-[154px] items-center justify-center pb-[19px] pt-[21px] px-[24px] relative w-full">
            <div className="content-stretch flex flex-[1_0_0] h-[22px] items-center justify-center min-h-px min-w-px pt-[1.5px] relative" data-name="Time">
              <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] relative shrink-0 text-[17px] text-black text-center whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                9:41
              </p>
            </div>
            <div className="flex-[1_0_0] h-[22px] min-h-px min-w-px relative" data-name="Levels">
              <div className="flex flex-row items-center justify-center size-full">
                <div className="content-stretch flex gap-[7px] items-center justify-center pr-px pt-px relative size-full">
                  <div className="h-[12.226px] relative shrink-0 w-[19.2px]" data-name="Cellular Connection">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 12.2264">
                      <path clipRule="evenodd" d={svgPaths.p1e09e400} fill="var(--fill-0, black)" fillRule="evenodd" id="Cellular Connection" />
                    </svg>
                  </div>
                  <div className="h-[12.328px] relative shrink-0 w-[17.142px]" data-name="Wifi">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.1417 12.3283">
                      <path clipRule="evenodd" d={svgPaths.p18b35300} fill="var(--fill-0, black)" fillRule="evenodd" id="Wifi" />
                    </svg>
                  </div>
                  <div className="h-[13px] relative shrink-0 w-[27.328px]" data-name="Frame">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.328 13">
                      <g id="Frame">
                        <rect height="12" id="Border" opacity="0.35" rx="3.8" stroke="var(--stroke-0, black)" width="24" x="0.5" y="0.5" />
                        <path d={svgPaths.p7a14d80} fill="var(--fill-0, black)" id="Cap" opacity="0.4" />
                        <rect fill="var(--fill-0, black)" height="9" id="Capacity" rx="2.5" width="21" x="2" y="2" />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="absolute font-['Milling_Trial:Triplex_1mm',sans-serif] leading-[30px] left-[24px] not-italic text-[#071c07] text-[24px] top-[82px] w-[345px]">Next Up</p>
      <p className="absolute font-['Milling_Trial:Duplex_1mm',sans-serif] leading-[normal] left-[24px] not-italic text-[#071c07] text-[16px] top-[118px] w-[345px]">Your Upcoming Plans</p>
      <div className="absolute content-stretch flex gap-[4px] h-[231px] items-start left-[20px] p-[24px] rounded-[1000px] top-[151px] w-[255px]" data-name="Button - Liquid Glass - Text">
        <div className="absolute inset-[-26px] opacity-67" data-name="Blur">
          <div className="absolute bg-white inset-[-50px]" data-name="Mask">
            <div className="absolute bg-black inset-[76px] rounded-[1000px]" data-name="Shape" />
          </div>
          <div className="absolute backdrop-blur-[20px] bg-[rgba(0,0,0,0.04)] blur-[10px] inset-[28px_26px_24px_26px] mix-blend-hard-light rounded-[1000px]" data-name="Blur" />
        </div>
        <FillBackgroundImage />
        <div className="absolute bg-[rgba(0,0,0,0)] inset-0 rounded-[32px]" data-name="Glass Effect" />
        <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start justify-between min-h-px min-w-px relative" data-name="Content">
          <TextBackgroundImageAndText text="Description" />
          <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Info">
            <MembersBackgroundImageAndText text="3 People Going." />
          </div>
        </div>
      </div>
      <div className="absolute content-stretch flex flex-col gap-[8px] h-[278px] items-start left-[24px] p-[24px] rounded-[1000px] top-[402px] w-[255px]" data-name="Button - Liquid Glass - Text">
        <div className="absolute inset-[-26px] opacity-67" data-name="Blur">
          <div className="absolute bg-white inset-[-50px]" data-name="Mask">
            <div className="absolute bg-black inset-[76px] rounded-[1000px]" data-name="Shape" />
          </div>
          <div className="absolute backdrop-blur-[20px] bg-[rgba(0,0,0,0.04)] blur-[10px] inset-[28px_26px_24px_26px] mix-blend-hard-light rounded-[1000px]" data-name="Blur" />
        </div>
        <FillBackgroundImage />
        <div className="absolute bg-[rgba(0,0,0,0)] inset-0 rounded-[32px]" data-name="Glass Effect" />
        <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px relative w-full" data-name="Content">
          <TextBackgroundImageAndText text="Description" />
          <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Info">
            <MembersBackgroundImageAndText text="3 People Going." />
          </div>
        </div>
        <div className="h-[137px] relative rounded-[30px] shrink-0 w-[210px]" data-name="image 1">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[30px] size-full" src={imgImage1} />
        </div>
      </div>
    </div>
  );
}
