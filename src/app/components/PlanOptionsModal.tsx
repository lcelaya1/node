import svgPaths from "../../imports/HomeFillState/svg-3x7mj8lo3k";

interface PlanOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlan: () => void;
  onJoinPlan: () => void;
}

const APP_NAVBAR_HEIGHT_PX = 72;

function Button({ onClick }: { onClick: () => void }) {
  return (
    <div className="bg-[#09090b] relative rounded-[999px] shrink-0 w-full cursor-pointer" data-name="Button" onClick={onClick}>
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[8px] items-center justify-center px-[32px] py-[12px] relative size-full">
          <div className="overflow-clip relative shrink-0 size-[20px]" data-name="Square Pen">
            <div className="absolute inset-[12.5%]" data-name="Vector">
              <div className="absolute inset-[-3.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                  <path d={svgPaths.p32ba13c0} id="Vector" stroke="var(--stroke-0, #FEFEFE)" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="absolute inset-[8.35%_8.35%_33.32%_33.32%]" data-name="Vector">
              <div className="absolute inset-[-4.29%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.6669 12.6669">
                  <path d={svgPaths.p2dde9d00} id="Vector" stroke="var(--stroke-0, #FEFEFE)" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex flex-col font-['ABC_Monument_Grotesk_Unlicensed_Trial:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#fefefe] text-[16px] text-center whitespace-nowrap">
            <p className="leading-[21px]">Create plan</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button1({ onClick }: { onClick: () => void }) {
  return (
    <div className="bg-[#09090b] relative rounded-[999px] shrink-0 w-full cursor-pointer" data-name="Button" onClick={onClick}>
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[8px] items-center justify-center px-[32px] py-[12px] relative size-full">
          <div className="overflow-clip relative shrink-0 size-[20px]" data-name="Users">
            <div className="absolute inset-[62.5%_33.33%_12.5%_8.33%]" data-name="Vector">
              <div className="absolute inset-[-10%_-4.29%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.6667 6">
                  <path d={svgPaths.p25dd6880} id="Vector" stroke="var(--stroke-0, #FEFEFE)" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="absolute inset-[13.03%_20.85%_54.7%_66.67%]" data-name="Vector">
              <div className="absolute inset-[-7.75%_-20.03%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.49695 7.45358">
                  <path d={svgPaths.p2c06fd00} id="Vector" stroke="var(--stroke-0, #FEFEFE)" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="absolute inset-[63.04%_8.33%_12.5%_79.17%]" data-name="Vector">
              <div className="absolute inset-[-10.22%_-20%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.50012 5.89179">
                  <path d={svgPaths.p2b9ce00} id="Vector" stroke="var(--stroke-0, #FEFEFE)" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="absolute inset-[12.5%_45.83%_54.17%_20.83%]" data-name="Vector">
              <div className="absolute inset-[-7.5%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.66667 7.66667">
                  <path d={svgPaths.p2ce3c900} id="Vector" stroke="var(--stroke-0, #FEFEFE)" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex flex-col font-['ABC_Monument_Grotesk_Unlicensed_Trial:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#fefefe] text-[16px] text-center whitespace-nowrap">
            <p className="leading-[21px]">Join Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Handler() {
  return <div className="-translate-x-1/2 absolute bg-[#969696] h-[3px] left-[calc(50%+0.5px)] rounded-[999px] top-[8px] w-[34px]" data-name="handler" />;
}

export default function PlanOptionsModal({ isOpen, onClose, onCreatePlan, onJoinPlan }: PlanOptionsModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-[#00000042] z-40" onClick={onClose} />
      <div
        className="fixed left-0 right-0 bg-[#fefefe] rounded-tl-[24px] rounded-tr-[24px] z-50 max-w-[393px] mx-auto"
        style={{ bottom: `calc(${APP_NAVBAR_HEIGHT_PX}px + env(safe-area-inset-bottom))` }}
        data-name="Bottom Sheet"
      >
        <div className="content-stretch flex flex-col gap-[14px] items-center justify-center overflow-clip px-[20px] py-[32px] relative rounded-[inherit] size-full">
          <Button onClick={onCreatePlan} />
          <Button1 onClick={onJoinPlan} />
          <Handler />
        </div>
        <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-tl-[24px] rounded-tr-[24px]" />
      </div>
    </>
  );
}
