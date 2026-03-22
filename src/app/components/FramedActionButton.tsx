import { LiquidGlassButton } from "./LiquidGlassButton";

type FramedActionButtonProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "red" | "white";
};

export function FramedActionButton({
  children,
  className = "",
  onClick,
  type = "button",
  variant = "red",
}: FramedActionButtonProps) {
  return (
    <div
      className={`rounded-[30px] p-[8px] ${className}`}
      style={{
        background: "var(--color-glass-surface-soft)",
        border: "1px solid var(--color-white-92)",
        boxShadow:
          "0 1px 0 var(--color-white-96) inset, 0 -10px 24px var(--color-neutral-225-22) inset, 0 0 24px var(--color-white-98), 0 10px 24px var(--color-neutral-215-18)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}
    >
      <LiquidGlassButton className="h-[54px] w-full text-[16px]" onClick={onClick} type={type} variant={variant}>
        {children}
      </LiquidGlassButton>
    </div>
  );
}
