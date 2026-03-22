import clsx from "clsx";

const punteroPath =
  "M22.5439 18.9805H1.5C0.671573 18.9805 0 18.3089 0 17.4805V1.50274C0 0.262595 1.41935 -0.441857 2.40706 0.308072L23.4509 16.2858C24.5954 17.1548 23.9809 18.9805 22.5439 18.9805Z";

type SpeechBubbleChipPunteroProps = {
  additionalClassNames?: string;
  fill?: string;
};

function SpeechBubbleChipPuntero({
  additionalClassNames = "",
  fill = "var(--color-surface-bg-secondary)",
}: SpeechBubbleChipPunteroProps) {
  return (
    <div className={clsx("h-[18.98px] w-[24.047px]", additionalClassNames)}>
      <svg
        className="absolute block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24.0468 18.9805"
      >
        <path d={punteroPath} fill={fill} id="Puntero" />
      </svg>
    </div>
  );
}

type BubbleChipProps = {
  className?: string;
  direction?: "Left" | "Right";
  children?: React.ReactNode;
  backgroundColor?: string;
  horizontalPaddingClassName?: string;
  multiline?: boolean;
  showPointer?: boolean;
  textClassName?: string;
  verticalPaddingClassName?: string;
};

export function BubbleChip({
  className,
  direction = "Right",
  children = "Button",
  backgroundColor = "var(--color-surface-bg-secondary)",
  horizontalPaddingClassName = "px-[20px]",
  multiline = false,
  showPointer = true,
  textClassName = "type-body-m text-primary-token",
  verticalPaddingClassName = "py-[8px]",
}: BubbleChipProps) {
  const isLeft = direction === "Left";
  const isRight = direction === "Right";
  const bubbleRadiusClassName = multiline
    ? showPointer
      ? isRight
        ? "rounded-tl-[8px] rounded-tr-[8px] rounded-bl-[8px] rounded-br-[12px]"
        : "rounded-tl-[8px] rounded-tr-[8px] rounded-bl-[12px] rounded-br-[8px]"
      : "rounded-[8px]"
    : "rounded-[64px]";
  const textWrapClassName = multiline ? "" : "whitespace-nowrap";

  return (
    <div className={className || "relative rounded-[999px] overflow-visible"}>
      <div className="flex flex-col items-center justify-center size-full overflow-visible">
        <div
          className={clsx(
            "content-stretch flex flex-col items-center justify-center relative",
            horizontalPaddingClassName,
            verticalPaddingClassName,
          )}
        >
          <div
            className={clsx("absolute inset-0", bubbleRadiusClassName)}
            style={{ backgroundColor }}
          />
          {isRight && (
            <>
              {showPointer ? (
                <SpeechBubbleChipPuntero
                  additionalClassNames={clsx(
                    "absolute bottom-0",
                    multiline ? "right-[-4.05px]" : "right-0",
                  )}
                  fill={backgroundColor}
                />
              ) : null}
              <div
                className={clsx(
                  "flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-center",
                  textWrapClassName,
                  textClassName,
                )}
              >
                <p className="leading-[21px]">{children}</p>
              </div>
            </>
          )}
          {isLeft && (
            <>
              {showPointer ? (
                <div className="absolute bottom-0 flex h-[18.98px] items-center justify-center left-[-0.05px] w-[24.047px]">
                  <div className="-scale-y-100 flex-none rotate-180">
                    <SpeechBubbleChipPuntero
                      additionalClassNames="relative"
                      fill={backgroundColor}
                    />
                  </div>
                </div>
              ) : null}
              <div
                className={clsx(
                  "flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-center",
                  textWrapClassName,
                  textClassName,
                )}
              >
                <p className="leading-[21px]">{children}</p>
              </div>
            </>
          )}
        </div>
      </div>
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
  return (
    <BubbleChip className={className} direction={direction}>
      {text}
    </BubbleChip>
  );
}
