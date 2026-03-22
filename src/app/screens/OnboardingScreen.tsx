import logoNode from "../../assets/svg/Logo Node.svg";

type OnboardingScreenProps = {
  onNext?: () => void;
};

type InfoBlockProps = {
  title: string;
  children: React.ReactNode;
};

function InfoBlock({ title, children }: InfoBlockProps) {
  return (
    <div className="flex w-full flex-col gap-[8px]">
      <p className="type-heading-m text-primary-token">{title}</p>
      <p className="type-body-s text-secondary-token">{children}</p>
    </div>
  );
}

export default function OnboardingScreen({ onNext }: OnboardingScreenProps) {
  return (
    <div className="flex size-full flex-col gap-[80px] bg-surface-primary pb-[32px]">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-between px-[24px] pt-[60px]">
        <div className="flex w-full flex-col gap-[40px]">
          <div className="flex w-[345px] flex-col gap-[8px]">
            <div className="flex items-start gap-[8px]">
              <p className="type-heading-2xl text-primary-token">{`Welcome to `}</p>
              <img alt="Node" className="h-[33.12px] w-[92px]" src={logoNode} />
            </div>
            <p className="type-body-m text-secondary-token">A few things before you dive in.</p>
          </div>

          <div className="flex w-full flex-col gap-[24px]">
            <InfoBlock title="It’s all here for you.">
              Answer a few questions and Node builds your perfect plan. Every suggestion is made for you, not anyone else.
            </InfoBlock>
            <InfoBlock title="Find your people">
              Meet people who match your vibe and energy. No random connections, just people who are up for the same things as you.
            </InfoBlock>
            <InfoBlock title="Curate plans">
              Every plan is filtered to your mood, budget and distance. The more you use it, the better it knows you.
            </InfoBlock>
            <InfoBlock title="Save and share your experiences.">
              Every time you say &quot;yes&quot; to a plan, it becomes part of your story. Keep a beautiful archive of your life offline.
            </InfoBlock>
          </div>
        </div>

        <button
          type="button"
          onClick={onNext}
          className="flex w-full items-center justify-center rounded-[999px] bg-button-primary px-[32px] py-[12px]"
        >
          <span className="type-body-m text-invert-token">Next</span>
        </button>
      </div>
    </div>
  );
}
