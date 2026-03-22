import stackImageLeft from "../../assets/Rectangle 7.png";
import stackImageCenter from "../../assets/Rectangle 8.png";
import stackImageRight from "../../assets/Rectangle 9.png";
import { useNavigate } from "react-router";
import { AppNavbar } from "../components/AppNavbar";
import { HomeHeader } from "../components/HomeHeader";

type StackCardProps = {
  className?: string;
  rotation: string;
  style?: React.CSSProperties;
};

function StackCard({ className = "", rotation, style }: StackCardProps) {
  return (
    <div
      className={`absolute h-[186px] w-[138px] overflow-hidden rounded-[8px] border border-card-token bg-surface-primary ${className}`}
      style={{ transform: rotation, ...style }}
    >
      <img
        alt=""
        className="size-full object-cover"
        decoding="async"
        fetchPriority="high"
        loading="eager"
        src={
          className.includes("center-card")
            ? stackImageCenter
            : className.includes("right-card")
              ? stackImageRight
              : stackImageLeft
        }
      />
    </div>
  );
}

export default function NoPlansScreen() {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-surface-primary">
      <div
        className="flex flex-1 flex-col gap-[52px] overflow-y-auto px-[20px]"
        style={{ paddingBottom: "calc(108px + env(safe-area-inset-bottom))" }}
      >
        <HomeHeader title="Hello, Cristina!" topPaddingClassName="pt-[32px]" />

        <div className="flex flex-col items-center gap-[32px]">
          <div className="relative h-[258px] w-[330px]">
            <StackCard className="left-card" rotation="rotate(-5.92deg)" style={{ left: "52px", top: "10px" }} />
            <StackCard className="right-card" rotation="rotate(4.74deg)" style={{ left: "148px", top: "0px" }} />
            <StackCard className="center-card" rotation="rotate(-1.13deg)" style={{ left: "118px", top: "60px" }} />
          </div>

          <div className="flex flex-col items-center gap-[20px] text-center">
            <div className="flex w-full flex-col items-center gap-[8px]">
              <h2 className="type-heading-l text-primary-token w-[208px]">When if not today?</h2>
              <p className="type-body-s text-primary-token w-[208px]">
                You have nothing planned yet.
                <br />
                It&apos;s time to start a new experience.
              </p>
            </div>

            <div className="flex w-[288px] items-start gap-[12px]">
              <button
                type="button"
                onClick={() => navigate("/join-plan")}
                className="flex h-[45px] min-w-0 flex-1 items-center justify-center rounded-[999px] px-[32px]"
                style={{ background: "linear-gradient(180deg, var(--color-button-secondary) 0%, var(--color-button-secondary) 100%)" }}
              >
                <span className="type-body-m text-invert-token whitespace-nowrap">Join Plan</span>
              </button>

              <button
                type="button"
                onClick={() => navigate("/add-specs")}
                className="flex h-[45px] min-w-0 flex-1 items-center justify-center rounded-[999px] border border-selected-token bg-surface-primary px-[32px]"
              >
                <span className="type-body-m text-primary-token whitespace-nowrap">Create Plan</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 border-t border-card-token bg-surface-primary">
        <AppNavbar
          activeTab="home"
          activeTone="brand"
          onCreatePlanClick={() => navigate("/add-specs")}
          onJoinPlanClick={() => navigate("/join-plan")}
          onTabClick={(tab) => {
            if (tab === "home") navigate("/");
            if (tab === "groups") navigate("/join-plan");
            if (tab === "profile") navigate("/profile");
          }}
        />
      </div>
    </div>
  );
}
