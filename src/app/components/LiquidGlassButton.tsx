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
          ? "var(--color-glass-surface-muted)"
          : isRed
          ? "linear-gradient(180deg, var(--color-button-secondary) 0%, var(--color-button-secondary) 100%)"
          : "var(--color-glass-surface-soft)",
        boxShadow: isInactive
          ? "0 1px 0 var(--color-white-70) inset, 0 -8px 18px var(--color-neutral-120-12) inset, 0 8px 18px var(--color-black-08)"
          : isRed
          ? "0 1px 0 var(--color-white-70) inset, 0 -8px 18px var(--color-brand-18) inset, 0 8px 24px var(--color-brand-24), 0 2px 8px var(--color-black-12)"
          : "0 1px 0 var(--color-white-95) inset, 0 -10px 18px var(--color-neutral-229-55) inset, 0 8px 24px var(--color-black-08), 0 1px 3px var(--color-black-04)",
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[1px] rounded-[999px]"
        style={{
          background: isInactive
            ? "var(--color-glass-highlight-muted)"
            : isRed
            ? "var(--color-glass-highlight-red)"
            : "var(--color-glass-highlight-white)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[8%] right-[8%] top-[6%] h-[54%] rounded-[999px] blur-[10px]"
        style={{
          background: isInactive
            ? "var(--color-glass-radial-muted)"
            : isRed
            ? "var(--color-glass-radial-red)"
            : "var(--color-glass-radial-white)",
        }}
      />
      {isRed && !isInactive && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[14%] top-[34%] h-[32%] rounded-[999px] blur-[14px]"
          style={{
            background: "var(--color-glow-brand)",
          }}
        />
      )}
      {!isRed && !isInactive && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[0] rounded-[999px]"
          style={{
            border: "1px solid var(--color-white-70)",
          }}
        />
      )}
      <span 
        className={`relative z-10 font-primary text-[15px] leading-[20px] ${isRed || isInactive ? 'text-invert-token' : 'text-primary-token'}`}
        style={variant === 'white' ? { fontFeatureSettings: "'ss16'" } : undefined}
      >
        {children}
      </span>
    </button>
  );
}
