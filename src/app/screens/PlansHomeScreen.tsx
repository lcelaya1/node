import { useNavigate } from "react-router";
import imgImage1 from "../../assets/d92dc11944c0835af8728de9c8586c5a5d0d5a38.png";

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
  title: string;
  location: string;
  description: string;
};

function TextBackgroundImageAndText({ title, location, description }: TextBackgroundImageAndTextProps) {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center justify-center leading-[0] not-italic relative rounded-[100px] shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0">
        <div className="flex flex-col font-['Milling_Trial:Triplex_1mm',sans-serif] justify-center relative shrink-0 text-[#fc312e] text-[14px] w-[207px]" style={{ fontFeatureSettings: "'ss16'" }}>
          <p className="leading-[normal]">{title}</p>
        </div>
        <div className="flex flex-col font-['Milling_Trial:Duplex_1mm',sans-serif] justify-center relative shrink-0 text-[#404040] text-[12px] w-[207px]" style={{ fontFeatureSettings: "'ss16'" }}>
          <p className="leading-[normal]">{location}</p>
        </div>
      </div>
      <div className="flex flex-col font-['Milling_Trial:Duplex_1mm',sans-serif] justify-center min-w-full relative shrink-0 text-[#bbb] text-[12px] w-[min-content]" style={{ fontFeatureSettings: "'ss16'" }}>
        <p className="leading-[normal]">{description}</p>
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

export default function PlansHomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#ebebeb] h-full overflow-y-auto" data-name="02 Auth / 01 Log in">
      <div className="px-[20px] pb-[8px] pt-[66px]">
        <p className="font-['Milling_Trial:Triplex_1mm',sans-serif] leading-[30px] not-italic text-[#071c07] text-[24px] w-full">Next Up</p>
        <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] leading-[normal] mt-[6px] not-italic text-[#071c07] text-[16px] w-full">Your Upcoming Plans</p>
      </div>

      <div className="flex flex-col gap-[24px] px-[20px] pb-[8px]">
      <div className="p-[24px] rounded-[32px]" 
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0px 1px 0px 0px rgba(255, 255, 255, 0.8) inset, 0px -1px 1px 0px rgba(0, 0, 0, 0.05) inset, 0px 8px 20px -4px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
      >
        <div className="flex flex-col gap-[4px]">
          <p className="font-['Milling_Trial:Triplex_1mm',sans-serif] text-[24px] leading-[normal] text-[#fc312e]">
            Caffe Break
          </p>
          <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[16px] leading-[normal] text-[#404040]">
            Nomad Coffee, El Born Barcelona
          </p>
          <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[16px] leading-[normal] text-[#bbb]">
            Description
          </p>
        </div>
        
        <div className="flex items-center gap-[8px] mt-[80px]">
          <div className="h-[32px] relative w-[73px]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 73 32">
              <g>
                <circle cx="16" cy="16" fill="#D9D9D9" r="15.5" stroke="#F7F7F7" strokeWidth="1" />
                <circle cx="36.5" cy="16" fill="#D9D9D9" r="15.5" stroke="#F7F7F7" strokeWidth="1" />
                <circle cx="57" cy="16" fill="#D9D9D9" r="15.5" stroke="#F7F7F7" strokeWidth="1" />
              </g>
            </svg>
          </div>
          <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[normal] text-[#b0b0b0]">
            3 People Going.
          </p>
        </div>
      </div>

      <div className="p-[24px] rounded-[32px]" 
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0px 1px 0px 0px rgba(255, 255, 255, 0.8) inset, 0px -1px 1px 0px rgba(0, 0, 0, 0.05) inset, 0px 8px 20px -4px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
      >
        <div className="flex flex-col gap-[4px]">
          <p className="font-['Milling_Trial:Triplex_1mm',sans-serif] text-[24px] leading-[normal] text-[#fc312e]">
            Caffe Break
          </p>
          <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[16px] leading-[normal] text-[#404040]">
            Nomad Coffee, El Born Barcelona
          </p>
          <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[16px] leading-[normal] text-[#bbb]">
            Description
          </p>
        </div>
        
        <div className="flex items-center gap-[8px] mt-[16px]">
          <div className="h-[32px] relative w-[73px]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 73 32">
              <g>
                <circle cx="16" cy="16" fill="#D9D9D9" r="15.5" stroke="#F7F7F7" strokeWidth="1" />
                <circle cx="36.5" cy="16" fill="#D9D9D9" r="15.5" stroke="#F7F7F7" strokeWidth="1" />
                <circle cx="57" cy="16" fill="#D9D9D9" r="15.5" stroke="#F7F7F7" strokeWidth="1" />
              </g>
            </svg>
          </div>
          <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[normal] text-[#b0b0b0]">
            3 People Going.
          </p>
        </div>
        
        <div className="mt-[16px] w-full h-[280px] rounded-[24px] overflow-hidden">
          <img alt="Coffee shop" className="w-full h-full object-cover" src={imgImage1} />
        </div>
      </div>
      </div>
    </div>
  );
}
