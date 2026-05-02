import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import logoutIcon from "../../assets/svg/Log In.svg";
import { IconButton } from "../components/IconButton";
import { AppNavbar } from "../components/AppNavbar";
import { loadInterestCatalogMap } from "../lib/interestCatalog";
import { loadSavedPlans, type SavedPlan } from "../lib/plans";
import { loadSavedGroups, type SavedGroup } from "../lib/groups";
import { isProfileAvatarDisplayUrl } from "../lib/profileAvatar";
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
  friendsCount?: number;
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
        "relative flex min-h-px min-w-0 items-start justify-center rounded-[999px] px-[16px] py-[6px]",
        active ? "bg-[#e4e4e7] text-primary-token" : "bg-surface-primary text-primary-token",
      )}
    >
      <span className="type-body-s whitespace-nowrap">{label}</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[999px] border border-card-token"
      />
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
  const titleRef = useRef<HTMLParagraphElement>(null);
  const [descriptionLineClamp, setDescriptionLineClamp] = useState(2);

  useEffect(() => {
    const node = titleRef.current;
    if (!node) return;

    const computed = window.getComputedStyle(node);
    const lineHeight = Number.parseFloat(computed.lineHeight || "0");
    if (!lineHeight) return;

    const measuredTitleLines = Math.max(1, Math.round(node.clientHeight / lineHeight));
    const titleLines = Math.min(measuredTitleLines, 2);
    const remainingLines = Math.max(1, 3 - titleLines);
    setDescriptionLineClamp(remainingLines);
  }, [title]);

  return (
    <div className="relative flex h-[104px] min-h-[104px] max-h-[104px] w-full items-stretch rounded-[8px] bg-surface-primary">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border border-card-token"
      />
      <div className="min-h-px min-w-0 flex-1 self-stretch">
        <div className="flex size-full flex-col items-start justify-center gap-[4px] p-[16px]">
          <p
            ref={titleRef}
            className="type-body-m-medium w-full overflow-hidden text-ellipsis text-primary-token"
            style={{
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              display: "-webkit-box",
            }}
          >
            {title}
          </p>
          <p
            className="type-body-xs w-full overflow-hidden text-secondary-token"
            style={{
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: descriptionLineClamp,
              display: "-webkit-box",
            }}
          >
            {when} at {location}
          </p>
        </div>
      </div>

      <div className="relative h-[104px] min-h-[104px] max-h-[104px] w-[142px] shrink-0 overflow-hidden rounded-[8px]">
        <img alt={title} className="absolute inset-0 size-full object-cover" src={imageSrc} />
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
    friendsCount: 0,
    plansCreated: 0,
    plansDone: 0,
  });
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [savedGroups, setSavedGroups] = useState<SavedGroup[]>([]);
  const [interestImageMap, setInterestImageMap] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (demoProfile) {
        setProfile({
          avatarUrl: demoProfile.avatarUrl,
          bio: demoProfile.bio,
          birthDate: "",
          friendsCount: demoProfile.friendsCount,
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

      const metadataName =
        typeof user.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name
          : typeof user.user_metadata?.name === "string"
            ? user.user_metadata.name
            : "";
      const metadataAvatar =
        typeof user.user_metadata?.avatar_url === "string"
          ? user.user_metadata.avatar_url
          : "";

      setProfile({
        avatarUrl:
          typeof data.avatar_url === "string" && isProfileAvatarDisplayUrl(data.avatar_url)
            ? data.avatar_url
            : isProfileAvatarDisplayUrl(metadataAvatar)
              ? metadataAvatar
              : "",
        bio: typeof data.bio === "string" ? data.bio : "",
        birthDate: typeof data.birth_date === "string" ? data.birth_date : "",
        fullName:
          typeof data.full_name === "string" && data.full_name.trim()
            ? data.full_name
            : metadataName,
        interests: Array.isArray(data.interests) ? data.interests : [],
        friendsCount: 0,
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

    const run = async () => {
      if (demoProfile) return;

      try {
        const groups = await loadSavedGroups();
        if (!isMounted) return;
        setSavedGroups(groups);
      } catch {
        if (!isMounted) return;
        setSavedGroups([]);
      }
    };

    void run();

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
  const pastJoinedPlans = useMemo(
    () => joinedPlans.filter((plan) => Boolean(plan.completedAt)),
    [joinedPlans],
  );
  const myFriendsCount = useMemo(() => {
    const seen = new Set<string>();

    savedGroups.forEach((group) => {
      group.participants.forEach((participant) => {
        const key = participant.seedUserId
          ? `seed:${participant.seedUserId}`
          : `name:${participant.name.trim().toLowerCase()}`;
        if (key !== "name:") {
          seen.add(key);
        }
      });
    });

    return seen.size;
  }, [savedGroups]);
  const displayAge = demoProfile?.age ?? age;
  const displayName = profile.fullName.trim() || "My profile";
  const displayTitle = displayAge !== null ? `${displayName}, ${displayAge}` : displayName;
  const displayBio =
    profile.bio.trim() || "Tell us a bit about yourself to complete your profile.";
  const displayAvatar = profile.avatarUrl.trim() || avatarImage;
  const displayInterests = profile.interests.slice(0, 3);
  const displayFriends = demoProfile?.friendsCount ?? myFriendsCount;
  const displayPlansCreated = demoProfile ? profile.plansCreated ?? 0 : createdPlans.length;
  const displayPlansDone = demoProfile ? profile.plansDone ?? 0 : pastJoinedPlans.length;

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      return;
    }

    navigate("/");
  };

  return (
    <div
      className={cn(
        "relative grid h-full overflow-hidden",
        demoProfile
          ? "grid-rows-[minmax(0,1fr)]"
          : "grid-rows-[minmax(0,1fr)_auto]",
      )}
      style={{ backgroundColor: "var(--color-surface-bg-primary)" }}
    >

      <div className="min-h-0 overflow-x-hidden px-[20px] pt-[24px]">
        <div className="flex h-full min-h-0 flex-col items-center gap-[32px]">
          {demoProfile ? (
            <div className="flex w-full items-center justify-between">
              <IconButton
                icon="Left"
                hierarchy="Link"
                size="Mid"
                onClick={() => navigate(-1)}
                aria-label="Back"
              />
              <h1 className="type-heading-m text-primary-token">Profile</h1>
              <div className="size-[44px]" />
            </div>
          ) : (
            <div className="flex w-full items-center justify-between">
                <p className="type-heading-2xl text-primary-token">My profile</p>
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="inline-flex size-[24px] items-center justify-center"
                aria-label="Log out"
              >
                <img alt="" aria-hidden="true" className="size-[24px]" src={logoutIcon} />
              </button>
            </div>
          )}

          <div className="flex w-full flex-col items-center gap-[12px] px-[20px]">
            <div className="flex w-full flex-col items-center gap-[8px]">
              <div className="size-[102px] overflow-hidden rounded-[51px] bg-surface-secondary">
                <img alt={displayName} className="size-full object-cover" src={displayAvatar} />
              </div>

              <div className="flex w-full flex-col items-center gap-[4px] text-center">
                <p className="type-heading-2xl text-primary-token">{displayTitle}</p>
                <div className="flex flex-wrap items-center justify-center gap-[8px] text-[14px] leading-[18px] text-secondary-token">
                  <span>{displayFriends} friends</span>
                  <span>·</span>
                  <span>{displayPlansCreated} plans created</span>
                  <span>·</span>
                  <span>{displayPlansDone} plans done</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-[6px]">
              {(displayInterests.length > 0 ? displayInterests : ["Good listener", "Punctual", "Funny"]).map((interest) => (
                <span
                  key={interest}
                  className="rounded-[50px] bg-[#f6f6f6] px-[16px] py-[8px] text-[12px] leading-[16px] text-black"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div className="flex min-h-0 w-full flex-1 flex-col gap-[16px]">
            <div className="flex w-full flex-col gap-[8px]">
              <h2 className="text-[20px] leading-[24px] text-primary-token">My plans</h2>
              <div className="flex w-full items-start gap-[6px] overflow-x-auto">
                <ProfileChip
                  active={activeTab === "about"}
                  label="All"
                  onClick={() => setActiveTab("about")}
                />
                <ProfileChip
                  active={activeTab === "created"}
                  label="Created by me"
                  onClick={() => setActiveTab("created")}
                />
                <ProfileChip
                  active={activeTab === "past"}
                  label="Past plans"
                  onClick={() => setActiveTab("past")}
                />
              </div>
            </div>

            <div
              className="flex min-h-0 w-full flex-1 flex-col gap-[12px] overflow-y-auto pr-[2px]"
              style={{
                WebkitOverflowScrolling: "touch",
                overscrollBehaviorY: "contain",
                paddingBottom: "calc(24px + env(safe-area-inset-bottom))",
              }}
            >
              {(activeTab === "about" ? savedPlans : activeTab === "created" ? createdPlans : pastJoinedPlans).map((plan) => (
                <CreatedPlanCard
                  key={plan.id}
                  imageSrc={plan.picturePreview}
                  location={plan.where}
                  title={plan.title}
                  when={plan.when}
                />
              ))}
              {(activeTab === "about" ? savedPlans : activeTab === "created" ? createdPlans : pastJoinedPlans).length === 0 ? (
                <p className="type-body-s text-secondary-token">No plans to show.</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="z-20 border-t border-card-token bg-surface-primary">
        {demoProfile ? null : (
          <AppNavbar
            activeTab="profile"
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
        )}
      </div>
    </div>
  );
}
