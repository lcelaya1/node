export default function Frame() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative size-full">
      <div className="content-stretch flex gap-[4px] items-center justify-center px-[20px] py-[6px] relative rounded-[1000px] shrink-0 w-[164px]" data-name="Button - Liquid Glass - Text">
        <div className="absolute inset-[-26px] opacity-67" data-name="Blur">
          <div className="absolute bg-white inset-[-50px]" data-name="Mask">
            <div className="absolute bg-black inset-[76px] rounded-[1000px]" data-name="Shape" />
          </div>
          <div className="absolute backdrop-blur-[20px] bg-[rgba(0,0,0,0.04)] blur-[10px] inset-[28px_26px_24px_26px] mix-blend-hard-light rounded-[1000px]" data-name="Blur" />
        </div>
        <div className="absolute inset-0 rounded-[1000px] shadow-[0px_0px_2px_0px_rgba(0,0,0,0.1),0px_1px_8px_0px_rgba(0,0,0,0.12)]" data-name="Tint">
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[1000px]">
            <div className="absolute bg-[rgba(255,255,255,0.5)] inset-0 rounded-[1000px]" />
            <div className="absolute bg-white inset-0 mix-blend-saturation rounded-[1000px]" />
            <div className="absolute bg-[#999] inset-0 mix-blend-overlay rounded-[1000px]" />
            <div className="absolute bg-[#fc312e] inset-0 rounded-[1000px]" />
          </div>
        </div>
        <div className="absolute bg-[rgba(0,0,0,0)] inset-0 rounded-[296px]" data-name="Glass Effect" />
        <div className="content-stretch flex h-[36px] items-center justify-center relative rounded-[100px] shrink-0" data-name="Text">
          <div className="flex flex-col font-primary justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
            <p className="leading-[normal]">Join Plan</p>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[4px] items-center justify-center px-[20px] py-[6px] relative rounded-[1000px] shrink-0 w-[172px]" data-name="Button - Liquid Glass - Text">
        <div className="absolute inset-[-26px] opacity-67" data-name="Blur">
          <div className="absolute bg-white inset-[-50px]" data-name="Mask">
            <div className="absolute bg-black inset-[76px] rounded-[1000px]" data-name="Shape" />
          </div>
          <div className="absolute backdrop-blur-[20px] bg-[rgba(0,0,0,0.04)] blur-[10px] inset-[28px_26px_24px_26px] mix-blend-hard-light rounded-[1000px]" data-name="Blur" />
        </div>
        <div className="absolute inset-0 rounded-[296px]" data-name="Fill">
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[296px]">
            <div className="absolute bg-[#333] inset-0 mix-blend-color-dodge rounded-[296px]" />
            <div className="absolute inset-0 rounded-[296px]" style={{ backgroundImage: "linear-gradient(90deg, rgb(247, 247, 247) 0%, rgb(247, 247, 247) 100%), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.5) 100%)" }} />
          </div>
        </div>
        <div className="absolute bg-[rgba(0,0,0,0)] inset-0 rounded-[296px]" data-name="Glass Effect" />
        <div className="h-[36px] relative rounded-[100px] shrink-0" data-name="Text">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex h-full items-center justify-center relative">
              <div className="flex flex-col font-primary justify-center leading-[0] not-italic relative shrink-0 text-[#404040] text-[14px] text-center whitespace-nowrap" style={{ fontFeatureSettings: "'ss16'" }}>
                <p className="leading-[normal]">Create Plan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
