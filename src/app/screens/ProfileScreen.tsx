import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import logoutIcon from "../../assets/svg/Log In.svg";
import { AppNavbar } from "../components/AppNavbar";
import { supabase } from "../lib/supabase";
import { cn } from "../components/ui/utils";

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
        "rounded-[50px] border px-[16px] py-[8px]",
        active
          ? "border-selected-token bg-button-primary text-invert-token"
          : "border-card-token bg-surface-primary text-primary-token",
      )}
    >
      <span className="type-body-xs whitespace-nowrap">{label}</span>
    </button>
  );
}

type InterestCardProps = {
  imageSrc: string;
  label: string;
};

function InterestCard({ imageSrc, label }: InterestCardProps) {
  return (
    <div className="relative h-[120px] overflow-hidden rounded-[16px]">
      <img alt={label} className="size-full object-cover" src={imageSrc} />
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      />
      <div className="absolute inset-x-[12px] bottom-[12px] flex justify-center">
        <div className="flex h-[26px] w-[87px] items-center justify-center rounded-[999px] bg-surface-secondary">
          <span className="type-body-s-bold text-primary-token">{label}</span>
        </div>
      </div>
    </div>
  );
}

type CreatedPlanCardProps = {
  imageSrc: string;
  title: string;
  subtitle: string;
};

function CreatedPlanCard({ imageSrc, title, subtitle }: CreatedPlanCardProps) {
  return (
    <div className="overflow-hidden rounded-[16px] border border-card-token bg-surface-primary">
      <div className="h-[132px] overflow-hidden">
        <img alt={title} className="size-full object-cover" src={imageSrc} />
      </div>
      <div className="flex flex-col gap-[2px] p-[12px]">
        <p className="type-body-s-bold text-primary-token">{title}</p>
        <p className="type-body-xs text-secondary-token">{subtitle}</p>
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
  const [activeTab, setActiveTab] = useState<ProfileTab>("about");
  const [profile, setProfile] = useState<ProfileData>({
    avatarUrl: "",
    bio: "",
    birthDate: "",
    fullName: "",
    interests: [],
  });

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
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
      });
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const age = useMemo(() => calculateAge(profile.birthDate), [profile.birthDate]);
  const displayName = profile.fullName.trim() || "Profile";
  const displayTitle = age !== null ? `${displayName}, ${age}` : displayName;
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
      className="relative flex h-full flex-col overflow-hidden"
      style={{ backgroundColor: "var(--color-surface-bg-primary)" }}
    >
      <div
        className="flex flex-1 flex-col overflow-y-auto"
        style={{ paddingBottom: "calc(108px + env(safe-area-inset-bottom))" }}
      >
        <div className="border-b border-card-token bg-surface-primary px-[20px] pt-[32px]">
          <div className="flex items-center justify-between pb-[12px] pt-[0px]">
            <h1 className="type-heading-m text-primary-token">Profile</h1>
            <button
              type="button"
              aria-label="Log out"
              className="flex size-[44px] items-center justify-center"
              onClick={handleLogout}
            >
              <img alt="" aria-hidden="true" className="size-[24px]" src={logoutIcon} />
            </button>
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
                    <span className="type-body-s">0 plans created</span>
                    <span className="type-body-s">·</span>
                    <span className="type-body-s">0 plans done</span>
                  </div>
                </div>
              </div>

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
            </div>

            {activeTab === "about" ? (
              <div className="flex w-full flex-col gap-[24px]">
                <div className="flex flex-col gap-[8px]">
                  <h2 className="type-body-m-medium text-primary-token">About</h2>
                  <p className="type-body-s text-primary-token">{displayBio}</p>
                </div>

                <div className="flex flex-col gap-[8px]">
                  <h2 className="type-body-m-medium text-primary-token">Interests</h2>
                  <div className="grid grid-cols-2 gap-x-[8px] gap-y-[7px]">
                    {displayInterests.length > 0 ? (
                      displayInterests.map((interest) => (
                        <InterestCard
                          key={interest}
                          imageSrc={getInterestImage(interest)}
                          label={interest}
                        />
                      ))
                    ) : (
                      <>
                        <InterestCard imageSrc={coffeeImage} label="Coffee" />
                        <InterestCard imageSrc={hikesImage} label="Hikes" />
                        <InterestCard imageSrc={yogaImage} label="Yoga" />
                        <InterestCard imageSrc={festivalImage} label="Festival" />
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === "created" ? (
              <div className="flex w-full flex-col gap-[16px]">
                <h2 className="type-body-m-medium text-primary-token">Created by you</h2>
                <div className="flex flex-col gap-[12px]">
                  <CreatedPlanCard
                    imageSrc={coffeeImage}
                    subtitle="Today, 18:00h"
                    title="Rooftop drinks in Madrid"
                  />
                  <CreatedPlanCard
                    imageSrc={yogaImage}
                    subtitle="Friday, 20:30h"
                    title="Dinner with good music"
                  />
                </div>
              </div>
            ) : null}

            {activeTab === "past" ? (
              <div className="flex w-full flex-col gap-[16px]">
                <h2 className="type-body-m-medium text-primary-token">Past plans</h2>
                <div className="flex flex-col gap-[12px]">
                  <CreatedPlanCard
                    imageSrc={festivalImage}
                    subtitle="Last weekend"
                    title="Sunset terrace in Lisbon"
                  />
                  <CreatedPlanCard
                    imageSrc={hikesImage}
                    subtitle="Two weeks ago"
                    title="Late-night tapas route"
                  />
                </div>
              </div>
            ) : null}
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
