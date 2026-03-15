import { LiquidGlassButton } from "./LiquidGlassButton";

type ActionConfig = {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

type DualActionButtonsProps = {
  primary: ActionConfig;
  secondary: ActionConfig;
  className?: string;
  primaryWidthClassName?: string;
  primaryPosition?: "left" | "right";
  secondaryWidthClassName?: string;
};

export function DualActionButtons({
  primary,
  secondary,
  className = "",
  primaryWidthClassName = "w-[164px]",
  primaryPosition = "left",
  secondaryWidthClassName = "w-[172px]",
}: DualActionButtonsProps) {
  const primaryButton = (
    <LiquidGlassButton
      className={primaryWidthClassName}
      onClick={primary.onClick}
      type={primary.type ?? "button"}
      variant="red"
    >
      {primary.label}
    </LiquidGlassButton>
  );

  const secondaryButton = (
    <LiquidGlassButton
      className={secondaryWidthClassName}
      onClick={secondary.onClick}
      type={secondary.type ?? "button"}
      variant="white"
    >
      {secondary.label}
    </LiquidGlassButton>
  );

  return (
    <div className={`flex w-full items-center gap-[8px] ${className}`}>
      {primaryPosition === "left" ? primaryButton : secondaryButton}
      {primaryPosition === "left" ? secondaryButton : primaryButton}
    </div>
  );
}
