import { useNavigate } from "react-router";
import { AppNavbar } from "../components/AppNavbar";
import { IconButton } from "../components/IconButton";

const profileImage = "https://www.figma.com/api/mcp/asset/920565ce-048b-463b-b67c-d2fb3054dbdb";

const interests = [
  "Rooftops",
  "Live music",
  "Coffee spots",
  "Gallery nights",
  "Weekend escapes",
  "Sunset drinks",
];

function InterestChip({ label }: { label: string }) {
  return (
    <div className="rounded-[999px] bg-surface-secondary px-[14px] py-[10px]">
      <span className="type-body-s text-primary-token">{label}</span>
    </div>
  );
}

export default function ProfileScreen() {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-surface-primary">
      <div
        className="flex flex-1 flex-col overflow-y-auto px-[20px] pt-[32px]"
        style={{ paddingBottom: "calc(108px + env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-[4px]">
            <p className="type-body-xs text-secondary-token">Your profile</p>
            <h1 className="type-heading-2xl text-primary-token">Cristina</h1>
          </div>

          <IconButton
            aria-label="Go home"
            hierarchy="Link"
            icon="Home"
            size="Mid"
            onClick={() => navigate("/")}
          />
        </div>

        <div className="mt-[32px] flex flex-col gap-[24px]">
          <div className="overflow-hidden rounded-[24px] border border-card-token bg-surface-primary">
            <div className="h-[300px] w-full overflow-hidden bg-surface-secondary">
              <img
                alt="Cristina profile"
                className="size-full object-cover"
                src={profileImage}
              />
            </div>

            <div className="flex flex-col gap-[20px] p-[20px]">
              <div className="flex items-start justify-between gap-[16px]">
                <div className="flex flex-col gap-[6px]">
                  <h2 className="type-heading-xl text-primary-token">Cristina, 27</h2>
                  <p className="type-body-s text-secondary-token">Madrid, Spain</p>
                </div>

                <div className="rounded-[999px] bg-surface-secondary px-[12px] py-[8px]">
                  <span className="type-body-xs text-primary-token">Open to plans</span>
                </div>
              </div>

              <div className="flex flex-col gap-[8px]">
                <h3 className="type-body-m-medium text-primary-token">About</h3>
                <p className="type-body-s text-primary-token">
                  I love easy-going plans that still feel special: rooftops, cozy dinner
                  spots, a good playlist, and the kind of evenings that stretch longer than
                  expected. Usually up for something social, but always better when the vibe
                  feels effortless.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-card-token bg-surface-primary p-[20px]">
            <div className="flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[8px]">
                <h3 className="type-body-m-medium text-primary-token">Interests</h3>
                <p className="type-body-s text-secondary-token">
                  A few things I always say yes to.
                </p>
              </div>

              <div className="flex flex-wrap gap-[8px]">
                {interests.map((interest) => (
                  <InterestChip key={interest} label={interest} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 border-t border-card-token bg-surface-primary">
        <AppNavbar
          activeTab="profile"
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
