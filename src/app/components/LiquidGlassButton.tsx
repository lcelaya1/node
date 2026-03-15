interface LiquidGlassButtonProps {
  variant?: 'red' | 'white';
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
}

export function LiquidGlassButton({ 
  variant = 'red', 
  children, 
  onClick, 
  type = 'button',
  className = '',
  disabled = false,
}: LiquidGlassButtonProps) {
  const isRed = variant === 'red';
  const isInactive = disabled;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`group relative flex h-[48px] items-center justify-center overflow-hidden rounded-[999px] transition-all duration-200 ${isInactive ? 'cursor-not-allowed opacity-55' : 'cursor-pointer active:scale-[0.985]'} ${className}`}
      style={{
        background: isInactive
          ? "linear-gradient(180deg, rgba(206,206,206,1) 0%, rgba(176,176,176,1) 100%)"
          : isRed
          ? "linear-gradient(180deg, #ff4b49 0%, #ff3733 100%)"
          : "linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(247, 247, 247, 0.82) 100%)",
        boxShadow: isInactive
          ? "0 1px 0 rgba(255,255,255,0.7) inset, 0 -8px 18px rgba(120,120,120,0.12) inset, 0 8px 18px rgba(0,0,0,0.08)"
          : isRed
          ? "0 1px 0 rgba(255,255,255,0.7) inset, 0 -8px 18px rgba(217, 20, 17, 0.18) inset, 0 8px 24px rgba(255, 68, 64, 0.24), 0 2px 8px rgba(0, 0, 0, 0.12)"
          : "0 1px 0 rgba(255,255,255,0.95) inset, 0 -10px 18px rgba(229, 229, 229, 0.55) inset, 0 8px 24px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)",
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[1px] rounded-[999px]"
        style={{
          background: isInactive
            ? "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 34%, rgba(255,255,255,0) 60%)"
            : isRed
            ? "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 34%, rgba(255,255,255,0) 60%)"
            : "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.28) 44%, rgba(255,255,255,0.1) 100%)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[8%] right-[8%] top-[6%] h-[54%] rounded-[999px] blur-[10px]"
        style={{
          background: isInactive
            ? "radial-gradient(ellipse at center, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 72%)"
            : isRed
            ? "radial-gradient(ellipse at center, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 72%)"
            : "radial-gradient(ellipse at center, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 74%)",
        }}
      />
      {isRed && !isInactive && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[14%] top-[34%] h-[32%] rounded-[999px] blur-[14px]"
          style={{
            background: "radial-gradient(ellipse at center, rgba(255, 48, 44, 0.92) 0%, rgba(255, 48, 44, 0.18) 58%, rgba(255, 48, 44, 0) 100%)",
          }}
        />
      )}
      {!isRed && !isInactive && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[0] rounded-[999px]"
          style={{
            border: "1px solid rgba(255,255,255,0.7)",
          }}
        />
      )}
      <span 
        className={`relative z-10 font-['Milling_Trial:Duplex_1mm',sans-serif] text-[15px] leading-[20px] ${isRed || isInactive ? 'text-white' : 'text-[#3f3f3f]'}`}
        style={variant === 'white' ? { fontFeatureSettings: "'ss16'" } : undefined}
      >
        {children}
      </span>
    </button>
  );
}
