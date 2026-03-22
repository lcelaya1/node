type InterestTileProps = {
  imageSrc: string;
  label: string;
  className?: string;
};

export function InterestTile({ imageSrc, label, className = "" }: InterestTileProps) {
  return (
    <div
      className={`relative flex h-[120px] flex-col items-end justify-end overflow-hidden rounded-[16px] ${className}`}
      style={{
        backgroundImage: `url("${imageSrc}")`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div
        className="absolute inset-0 rounded-[16px]"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      />
      <div className="relative flex h-[26px] min-w-[87px] items-center justify-center rounded-[999px] bg-surface-secondary px-[16px]">
        <span className="type-body-s-bold whitespace-nowrap text-primary-token">{label}</span>
      </div>
    </div>
  );
}

export type { InterestTileProps };
