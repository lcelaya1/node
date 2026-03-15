interface LiquidGlassButtonProps {
  variant?: 'red' | 'white';
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export function LiquidGlassButton({ 
  variant = 'red', 
  children, 
  onClick, 
  type = 'button',
  className = ''
}: LiquidGlassButtonProps) {
  const isRed = variant === 'red';

  return (
    <button
      type={type}
      onClick={onClick}
      className={`group relative flex h-[48px] items-center justify-center overflow-hidden rounded-[999px] cursor-pointer transition-all duration-200 active:scale-[0.985] ${className}`}
      style={{
        background: isRed
          ? "linear-gradient(180deg, #ff4b49 0%, #ff3733 100%)"
          : "linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(247, 247, 247, 0.82) 100%)",
        boxShadow: isRed
          ? "0 1px 0 rgba(255,255,255,0.7) inset, 0 -8px 18px rgba(217, 20, 17, 0.18) inset, 0 8px 24px rgba(255, 68, 64, 0.24), 0 2px 8px rgba(0, 0, 0, 0.12)"
          : "0 1px 0 rgba(255,255,255,0.95) inset, 0 -10px 18px rgba(229, 229, 229, 0.55) inset, 0 8px 24px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)",
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[1px] rounded-[999px]"
        style={{
          background: isRed
            ? "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 34%, rgba(255,255,255,0) 60%)"
            : "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.28) 44%, rgba(255,255,255,0.1) 100%)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[8%] right-[8%] top-[6%] h-[54%] rounded-[999px] blur-[10px]"
        style={{
          background: isRed
            ? "radial-gradient(ellipse at center, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 72%)"
            : "radial-gradient(ellipse at center, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 74%)",
        }}
      />
      {isRed && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[14%] top-[34%] h-[32%] rounded-[999px] blur-[14px]"
          style={{
            background: "radial-gradient(ellipse at center, rgba(255, 48, 44, 0.92) 0%, rgba(255, 48, 44, 0.18) 58%, rgba(255, 48, 44, 0) 100%)",
          }}
        />
      )}
      {!isRed && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[0] rounded-[999px]"
          style={{
            border: "1px solid rgba(255,255,255,0.7)",
          }}
        />
      )}
      <span 
        className={`relative z-10 font-['Milling_Trial:Duplex_1mm',sans-serif] text-[15px] leading-[20px] ${isRed ? 'text-white' : 'text-[#3f3f3f]'}`}
        style={variant === 'white' ? { fontFeatureSettings: "'ss16'" } : undefined}
      >
        {children}
      </span>
    </button>
  );
}
