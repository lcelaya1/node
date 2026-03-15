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
        background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(245,245,245,0.8) 100%)",
        border: "1px solid rgba(255,255,255,0.92)",
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.96) inset, 0 -10px 24px rgba(225,225,225,0.22) inset, 0 0 24px rgba(255,255,255,0.98), 0 10px 24px rgba(215,215,215,0.18)",
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
