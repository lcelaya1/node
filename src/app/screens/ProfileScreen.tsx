import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import logoutIcon from "../../assets/svg/Log In.svg";
import { AppIcon } from "../components/AppIcon";
import { IconButton } from "../components/IconButton";
import { InterestTile } from "../components/InterestTile";
import { AppNavbar } from "../components/AppNavbar";
import { loadInterestCatalogMap } from "../lib/interestCatalog";
import { loadSavedPlans, type SavedPlan } from "../lib/plans";
import { supabase } from "../lib/supabase";
import { cn } from "../components/ui/utils";
import type { DemoUser } from "../lib/demoUsers";

const avatarImage = "https://www.figma.com/api/mcp/asset/920565ce-048b-463b-b67c-d2fb3054dbdb";
const coffeeImage = "https://www.figma.com/api/mcp/asset/9c115bd6-c3fd-4327-b7b4-40dab8c2e9d3";
const hikesImage = "https://www.figma.com/api/mcp/asset/7d129f93-070f-406e-8d44-b798c798a01f";
const yogaImage = "https://www.figma.com/api/mcp/asset/6339610d-16c4-4351-b612-8488629bee40";
const festivalImage = "https://www.figma.com/api/mcp/asset/3c756414-859a-411c-a3fa-1e2c8385c96e";

type ProfileTab = "about" | "created" | "past";

type ProfileData = {
  avatarUrl: string;
  bio: string;
  birthDate: string;
  fullName: string;
  interests: string[];
  plansCreated?: number;
  plansDone?: number;
};

type ProfileChipProps = {
  active?: boolean;
  label: string;
  onClick?: () => void;
};

function ProfileChip({ active = false, label, onClick }: ProfileChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-px min-w-0 flex-1 items-start justify-center rounded-[50px] px-[16px] py-[8px]",
        active
          ? "bg-button-primary text-invert-token"
          : "bg-surface-primary text-primary-token",
      )}
      style={{ border: "0.5px solid var(--color-border-selected)" }}
    >
      <span className="type-body-xs whitespace-nowrap">{label}</span>
    </button>
  );
}

type CreatedPlanCardProps = {
  imageSrc: string;
  location: string;
  title: string;
  when: string;
};

function CreatedPlanCard({ imageSrc, location, title, when }: CreatedPlanCardProps) {
  return (
    <div className="flex h-[120px] items-start overflow-hidden rounded-[4px] border border-card-token bg-surface-primary">
      <div className="flex h-full min-w-0 flex-1 flex-col items-start px-[12px] py-[16px]">
        <div className="flex w-full flex-col gap-[8px]">
          <p className="type-body-m-medium text-primary-token">{title}</p>

          <div className="flex flex-col gap-[4px]">
            <div className="flex items-center gap-[4px]">
              <AppIcon
                name="Calendar"
                size={12}
                className="shrink-0 text-secondary-token"
              />
              <span className="type-body-xs text-secondary-token">{when}</span>
            </div>

            <div className="flex items-center gap-[4px]">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0 text-secondary-token"
              >
                <path
                  d="M8.25 5.08333C8.25 6.9375 6 9.58333 6 9.58333C6 9.58333 3.75 6.9375 3.75 5.08333C3.75 3.84069 4.75736 2.83333 6 2.83333C7.24264 2.83333 8.25 3.84069 8.25 5.08333Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 5.83333C6.41421 5.83333 6.75 5.49755 6.75 5.08333C6.75 4.66912 6.41421 4.33333 6 4.33333C5.58579 4.33333 5.25 4.66912 5.25 5.08333C5.25 5.49755 5.58579 5.83333 6 5.83333Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="type-body-xs text-secondary-token">{location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-full w-[120px] shrink-0 overflow-hidden rounded-[8px]">
        <img alt={title} className="size-full object-cover" src={imageSrc} />
      </div>
    </div>
  );
}

function calculateAge(birthDate: string) {
  if (!birthDate) return null;

  const parsedDate = new Date(birthDate);
  if (Number.isNaN(parsedDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - parsedDate.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > parsedDate.getMonth() ||
    (today.getMonth() === parsedDate.getMonth() &&
      today.getDate() >= parsedDate.getDate());

  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }

  return age;
}

function getPlanStartDate(plan: SavedPlan) {
  if (!plan.whenDate || !plan.whenTime) return null;

  const parsedDate = new Date(`${plan.whenDate}T${plan.whenTime}`);
  if (Number.isNaN(parsedDate.getTime())) return null;

  return parsedDate;
}

function getInterestImage(label: string) {
  switch (label.trim().toLowerCase()) {
    case "coffee":
      return coffeeImage;
    case "hikes":
    case "hiking":
    case "outdoors":
    case "nature":
      return hikesImage;
    case "yoga":
    case "mindfulness":
    case "self-care":
    case "spa":
      return yogaImage;
    case "festival":
    case "music":
    case "cocktails":
    case "karaoke":
      return festivalImage;
    default:
      return [coffeeImage, hikesImage, yogaImage, festivalImage][
        label.length % 4
      ];
  }
}

export default function ProfileScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const demoProfile = ((location.state as { demoProfile?: DemoUser } | null) ?? null)
    ?.demoProfile;
  const [activeTab, setActiveTab] = useState<ProfileTab>("about");
  const [profile, setProfile] = useState<ProfileData>({
    avatarUrl: "",
    bio: "",
    birthDate: "",
    fullName: "",
    interests: [],
    plansCreated: 0,
    plansDone: 0,
  });
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [interestImageMap, setInterestImageMap] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (demoProfile) {
        setProfile({
          avatarUrl: demoProfile.avatarUrl,
          bio: demoProfile.bio,
          birthDate: "",
          fullName: demoProfile.name,
          interests: demoProfile.interests,
          plansCreated: demoProfile.plansCreated,
          plansDone: demoProfile.plansDone,
        });
        return;
      }

      if (!supabase) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, birth_date, bio, interests, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (error || !data || !isMounted) return;

      setProfile({
        avatarUrl: typeof data.avatar_url === "string" ? data.avatar_url : "",
        bio: typeof data.bio === "string" ? data.bio : "",
        birthDate: typeof data.birth_date === "string" ? data.birth_date : "",
        fullName: typeof data.full_name === "string" ? data.full_name : "",
        interests: Array.isArray(data.interests) ? data.interests : [],
        plansCreated: 0,
        plansDone: 0,
      });
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [demoProfile]);

  useEffect(() => {
    let isMounted = true;

    const loadCatalog = async () => {
      const nextMap = await loadInterestCatalogMap();
      if (!isMounted) return;
      setInterestImageMap(nextMap);
    };

    void loadCatalog();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      if (demoProfile) return;

      try {
        const plans = await loadSavedPlans();
        if (!isMounted) return;
        setSavedPlans(plans);
      } catch {
        if (!isMounted) return;
        setSavedPlans([]);
      }
    };

    void run();

    return () => {
      isMounted = false;
    };
  }, [demoProfile]);

  const age = useMemo(() => calculateAge(profile.birthDate), [profile.birthDate]);
  const createdPlans = useMemo(
    () => savedPlans.filter((plan) => plan.source === "created"),
    [savedPlans],
  );
  const joinedPlans = useMemo(
    () => savedPlans.filter((plan) => plan.source !== "created"),
    [savedPlans],
  );
  const pastJoinedPlans = useMemo(() => {
    const now = new Date();

    return joinedPlans.filter((plan) => {
      const startDate = getPlanStartDate(plan);
      if (!startDate) return false;

      const availableAt = new Date(startDate.getTime() + 3 * 60 * 60 * 1000);
      return now >= availableAt;
    });
  }, [joinedPlans]);
  const displayAge = demoProfile?.age ?? age;
  const displayName = profile.fullName.trim() || "Profile";
  const displayTitle = displayAge !== null ? `${displayName}, ${displayAge}` : displayName;
  const displayBio =
    profile.bio.trim() || "Tell us a bit about yourself to complete your profile.";
  const displayAvatar = profile.avatarUrl.trim() || avatarImage;
  const displayInterests = profile.interests.slice(0, 4);

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      return;
    }

    navigate("/");
  };

  return (
    <div
      className="relative flex h-full min-h-0 flex-col overflow-hidden"
      style={{ backgroundColor: "var(--color-surface-bg-primary)" }}
    >
      <div
        className="flex min-h-0 flex-1 touch-pan-y flex-col overflow-y-auto"
        style={{
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorY: "contain",
          paddingBottom: "calc(108px + env(safe-area-inset-bottom))",
        }}
      >
        <div className="sticky top-0 z-10 border-b border-card-token bg-surface-primary px-[20px] pt-[16px]">
          <div className="flex items-center justify-between pb-[12px] pt-[0px]">
            {demoProfile ? (
              <>
                <IconButton
                  icon="Left"
                  hierarchy="Link"
                  size="Mid"
                  onClick={() => navigate(-1)}
                  aria-label="Back"
                />
                <h1 className="type-heading-m text-primary-token">Profile</h1>
                <div className="size-[44px]" />
              </>
            ) : (
              <>
                <h1 className="type-heading-m text-primary-token">Profile</h1>
                <button
                  type="button"
                  aria-label="Log out"
                  className="flex size-[44px] items-center justify-center"
                  onClick={handleLogout}
                >
                  <img alt="" aria-hidden="true" className="size-[24px]" src={logoutIcon} />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="px-[20px] pt-[24px]">
          <div className="flex flex-col items-center gap-[32px]">
            <div className="flex w-full flex-col items-center gap-[20px]">
              <div className="flex w-full flex-col items-center gap-[13px]">
                <div className="size-[102px] overflow-hidden rounded-full bg-surface-secondary">
                  <img alt={displayName} className="size-full object-cover" src={displayAvatar} />
                </div>

                <div className="flex w-full flex-col items-center gap-[4px] text-center">
                  <p className="type-heading-xl text-primary-token">{displayTitle}</p>
                  <div className="flex items-center gap-[8px] text-secondary-token">
                    <span className="type-body-s">
                      {demoProfile ? profile.plansCreated ?? 0 : createdPlans.length} plans created
                    </span>
                    <span className="type-body-s">·</span>
                    <span className="type-body-s">
                      {demoProfile ? profile.plansDone ?? 0 : pastJoinedPlans.length} plans done
                    </span>
                  </div>
                </div>
              </div>

              {demoProfile ? null : (
                <div className="flex w-full items-start justify-center gap-[12px]">
                  <ProfileChip
                    active={activeTab === "about"}
                    label="About"
                    onClick={() => setActiveTab("about")}
                  />
                  <ProfileChip
                    active={activeTab === "created"}
                    label="Created by you"
                    onClick={() => setActiveTab("created")}
                  />
                  <ProfileChip
                    active={activeTab === "past"}
                    label="Past plans"
                    onClick={() => setActiveTab("past")}
                  />
                </div>
              )}
            </div>

            {demoProfile || activeTab === "about" ? (
              <div className="flex w-full flex-col gap-[24px]">
                <div className="flex flex-col gap-[8px]">
                  <h2 className="type-body-m-medium text-primary-token">Interests</h2>
                  <div className="grid grid-cols-2 gap-x-[8px] gap-y-[7px]">
                    {displayInterests.length > 0 ? (
                      displayInterests.map((interest) => (
                        <InterestTile
                          key={interest}
                          imageSrc={
                            interestImageMap.get(interest.trim().toLowerCase()) ??
                            getInterestImage(interest)
                          }
                          label={interest}
                        />
                      ))
                    ) : (
                      <>
                        <InterestTile imageSrc={coffeeImage} label="Coffee" />
                        <InterestTile imageSrc={hikesImage} label="Hikes" />
                        <InterestTile imageSrc={yogaImage} label="Yoga" />
                        <InterestTile imageSrc={festivalImage} label="Festival" />
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === "created" ? (
              <div className="flex w-full flex-col gap-[16px]">
                <h2 className="type-body-m-medium text-primary-token">Created by you</h2>
                {createdPlans.length > 0 ? (
                  <div className="flex w-full flex-col gap-[8px]">
                    {createdPlans.map((plan) => (
                      <CreatedPlanCard
                        key={plan.id}
                        imageSrc={plan.picturePreview}
                        location={plan.where}
                        title={plan.title}
                        when={plan.when}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="type-body-s text-secondary-token">
                    You haven&apos;t created any plans yet.
                  </p>
                )}
              </div>
            ) : null}

            {activeTab === "past" ? (
              <div className="flex w-full flex-col gap-[16px]">
                <h2 className="type-body-m-medium text-primary-token">Past plans</h2>
                {pastJoinedPlans.length > 0 ? (
                  <div className="flex w-full flex-col gap-[8px]">
                    {pastJoinedPlans.map((plan) => (
                      <CreatedPlanCard
                        key={plan.id}
                        imageSrc={plan.picturePreview}
                        location={plan.where}
                        title={plan.title}
                        when={plan.when}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="type-body-s text-secondary-token">
                    You don&apos;t have any past plans yet.
                  </p>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 border-t border-card-token bg-surface-primary">
        {demoProfile ? null : (
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
        )}
      </div>
    </div>
  );
}
