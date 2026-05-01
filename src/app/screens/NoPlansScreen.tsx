import imgRectangle5 from "../../imports/HomeEmptyState-1/013450d245e5fec3448a756985226df66b4c9636.png";
import imgRectangle6 from "../../imports/HomeEmptyState-1/8a0e19358e2f5bd5028be349081fbeb730f40d74.png";
import imgRectangle7 from "../../imports/HomeEmptyState-1/e5383d30c3fc2901cd6298c589af694ae7c9981f.png";
import { useNavigate } from "react-router";
import { AppNavbar } from "../components/AppNavbar";
import { HomeHeader } from "../components/HomeHeader";

function Frame7() {
  return (
    <div className="h-[125.435px] relative shrink-0 w-[170.871px]">
      <div className="absolute h-[107.551px] left-0 rounded-[8px] top-[8.94px] w-[78.402px]">
        <div className="absolute inset-0 opacity-50 overflow-hidden pointer-events-none rounded-[8px]">
          <img alt="" className="absolute h-[104.3%] left-[0.02%] max-w-none top-[-4.34%] w-[105.93%]" src={imgRectangle5} />
        </div>
      </div>
      <div className="absolute h-[107.551px] left-[92.47px] rounded-[8px] top-[8.94px] w-[78.402px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover opacity-50 pointer-events-none rounded-[8px] size-full" src={imgRectangle6} />
      </div>
      <div className="absolute h-[125.435px] left-[39.72px] rounded-[8px] top-0 w-[91.439px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full" src={imgRectangle7} />
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-full">
      <Frame7 />
    </div>
  );
}

export default function NoPlansScreen() {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-surface-primary">
      <div
        className="flex flex-1 flex-col overflow-y-auto px-[20px]"
        style={{ paddingBottom: "calc(108px + env(safe-area-inset-bottom))" }}
      >
        <HomeHeader title="Hello, Cristina!" topPaddingClassName="pt-[32px]" />

        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-[32px]">
            <Frame4 />

            <div className="flex flex-col items-center gap-[20px] text-center">
              <div className="flex w-full flex-col items-center gap-[8px]">
                <h2 className="type-heading-l text-primary-token w-[208px]">When if not today?</h2>
                <p className="type-body-s text-primary-token w-[208px]">
                  You have nothing planned yet.
                  <br />
                  It&apos;s time to start a new experience.
                </p>
              </div>
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
            if (tab === "groups") navigate("/groups");
            if (tab === "diary") navigate("/diary");
            if (tab === "profile") navigate("/profile");
          }}
        />
      </div>
    </div>
  );
}
