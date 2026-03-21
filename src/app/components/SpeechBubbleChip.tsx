import clsx from "clsx";

const punteroPath =
  "M22.5439 18.9805H1.5C0.671573 18.9805 0 18.3089 0 17.4805V1.50274C0 0.262595 1.41935 -0.441857 2.40706 0.308072L23.4509 16.2858C24.5954 17.1548 23.9809 18.9805 22.5439 18.9805Z";

type SpeechBubbleChipPunteroProps = {
  additionalClassNames?: string;
};

function SpeechBubbleChipPuntero({ additionalClassNames = "" }: SpeechBubbleChipPunteroProps) {
  return (
    <div className={clsx("h-[18.98px] w-[24.047px]", additionalClassNames)}>
      <svg
        className="absolute block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24.0468 18.9805"
      >
        <path d={punteroPath} fill="var(--fill-0, #E4E4E7)" id="Puntero" />
      </svg>
    </div>
  );
}

type SpeechBubbleChipProps = {
  className?: string;
  direction?: "Left" | "Right";
  text?: string;
};

export function SpeechBubbleChip({
  className,
  direction = "Right",
  text = "Button",
}: SpeechBubbleChipProps) {
  const isLeft = direction === "Left";
  const isRight = direction === "Right";

  return (
    <div className={className || "relative rounded-[999px] overflow-visible"}>
      <div className="flex flex-col items-center justify-center size-full overflow-visible">
        <div className="content-stretch flex flex-col items-center justify-center px-[20px] py-[8px] relative">
          <div className="absolute bg-[#e4e4e7] inset-0 rounded-[64px]" />
          {isRight && (
            <>
              <SpeechBubbleChipPuntero additionalClassNames="absolute bottom-0 right-0" />
              <div className="flex flex-col font-['Milling_Trial:Duplex_1mm',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[16px] text-center whitespace-nowrap">
                <p className="leading-[21px]">{text}</p>
              </div>
            </>
          )}
          {isLeft && (
            <>
              <div className="absolute bottom-0 flex h-[18.98px] items-center justify-center left-[-0.05px] w-[24.047px]">
                <div className="-scale-y-100 flex-none rotate-180">
                  <SpeechBubbleChipPuntero additionalClassNames="relative" />
                </div>
              </div>
              <div className="flex flex-col font-['Milling_Trial:Duplex_1mm',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[16px] text-center whitespace-nowrap">
                <p className="leading-[21px]">{text}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
