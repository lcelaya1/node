const avatarImage = "https://www.figma.com/api/mcp/asset/920565ce-048b-463b-b67c-d2fb3054dbdb";

function getTodayLabel() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

type HomeHeaderProps = {
  title?: string;
  topPaddingClassName?: string;
};

export function HomeHeader({
  title = "Hello, Cristina!",
  topPaddingClassName = "pt-[32px]",
}: HomeHeaderProps) {
  const todayLabel = getTodayLabel();

  return (
    <div className={`flex items-start justify-between ${topPaddingClassName}`}>
      <div className="flex flex-col items-start gap-[4px]">
        <p className="type-body-xs text-secondary-token">{todayLabel}</p>
        <h1 className="type-heading-2xl text-primary-token">{title}</h1>
      </div>

      <div className="size-[40px] overflow-hidden rounded-full bg-surface-secondary">
        <img alt="Cristina" className="size-full object-cover" src={avatarImage} />
      </div>
    </div>
  );
}
