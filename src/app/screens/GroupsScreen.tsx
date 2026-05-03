import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { AppNavbar } from "../components/AppNavbar";
import { GroupCard } from "../components/GroupCard";
import { loadSavedGroups, type SavedGroup } from "../lib/groups";
import {
  REPEAT_GROUP_RSVP_EVENT,
  getRepeatGroupRsvp,
  loadRepeatGroupRsvpMap,
  setRepeatGroupRsvp,
  type RepeatGroupRsvp,
} from "../lib/repeatGroupRsvp";
import { loadRepeatGroupPlans } from "../lib/repeatGroupPlans";
import { resolveRsvpViewerInCircle } from "../lib/resolveCircleViewer";
import { supabase } from "../lib/supabase";
import imageLeft from "../../assets/V2 APP (25/Rectangle 13.png";
import imageBottom from "../../assets/V2 APP (25/Rectangle 14.png";
import imageRight from "../../assets/V2 APP (25/Rectangle 15.png";

type GroupsLocationState = {
  acceptedParticipantNames?: string[];
  newCircleTitle?: string;
};

function CircleAcceptedModal({
  description,
  isOpen,
  onClose,
}: {
  description: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: "var(--color-overlay-scrim)" }}
        onClick={onClose}
      />
      <div className="fixed inset-x-[20px] bottom-[110px] z-50 mx-auto max-w-[353px] rounded-[8px] bg-surface-primary px-[20px] py-[12px] shadow-[0px_8px_24px_rgba(9,9,11,0.16)]">
        <p className="type-body-m text-secondary-token">{description}</p>
      </div>
    </>
  );
}

function GroupPlansLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[10px]">
      <div className="flex items-center gap-[4px]">
        <div className="relative size-[12px] shrink-0">
          <svg className="absolute inset-0 block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="6" fill="#FC312E" />
          </svg>
        </div>
        <p className="text-[12px] leading-[16px] text-secondary-token">New plan proposal</p>
      </div>

      <div className="flex items-center gap-[4px]">
        <div className="relative size-[12px] shrink-0">
          <svg className="absolute inset-0 block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="6" fill="var(--color-text-primary)" />
          </svg>
        </div>
        <p className="text-[12px] leading-[16px] text-secondary-token">Plan incoming</p>
      </div>

      <div className="flex items-center gap-[4px]">
        <div className="relative size-[12px] shrink-0">
          <svg className="absolute inset-0 block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="6" fill="#E4E4E7" />
          </svg>
        </div>
        <p className="text-[12px] leading-[16px] text-secondary-token">No plans yet</p>
      </div>
    </div>
  );
}

export default function GroupsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as GroupsLocationState | null) ?? null;
  const [groups, setGroups] = useState<SavedGroup[]>([]);
  const [planRsvpByGroupId, setPlanRsvpByGroupId] = useState<
    Record<string, RepeatGroupRsvp>
  >({});
  const [avatarUrl, setAvatarUrl] = useState("");
  const [profileFullName, setProfileFullName] = useState("");
  const [isAcceptedModalOpen, setIsAcceptedModalOpen] = useState(
    Boolean(locationState?.acceptedParticipantNames?.length),
  );

  const acceptedDescription = useMemo(() => {
    const names = locationState?.acceptedParticipantNames ?? [];
    if (names.length === 0) return "";
    if (names.length === 1) {
      return `${names[0]} accepted your request and your circle is now active.`;
    }

    if (names.length === 2) {
      return `${names[0]} and ${names[1]} accepted your request and your circle is now active.`;
    }

    return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]} accepted your request and your circle is now active.`;
  }, [locationState?.acceptedParticipantNames]);

  const closeAcceptedModal = () => {
    setIsAcceptedModalOpen(false);
    navigate("/groups", { replace: true });
  };

  useEffect(() => {
    if (!isAcceptedModalOpen || !locationState?.acceptedParticipantNames?.length) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      closeAcceptedModal();
    }, 5000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isAcceptedModalOpen, locationState?.acceptedParticipantNames?.length]);

  useEffect(() => {
    let active = true;

    const run = async () => {
      const nextGroups = await loadSavedGroups();
      if (!active) return;
      setGroups(nextGroups);
    };

    void run();

    return () => {
      active = false;
    };
  }, []);

  /** Planes ya guardados antes de persistir RSVP al crear propia propuesta. */
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      for (const g of groups) {
        if (cancelled) break;
        if (getRepeatGroupRsvp(g.id)) continue;
        const plans = await loadRepeatGroupPlans(g.id);
        if (cancelled) break;
        const latest = plans[plans.length - 1];
        if (latest?.createdByName?.trim() === "You") {
          setRepeatGroupRsvp(g.id, "in");
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [groups]);

  const refreshPlanRsvp = useCallback(() => {
    setPlanRsvpByGroupId(loadRepeatGroupRsvpMap());
  }, []);

  useEffect(() => {
    refreshPlanRsvp();
  }, [location.pathname, location.key, refreshPlanRsvp]);

  useEffect(() => {
    window.addEventListener(REPEAT_GROUP_RSVP_EVENT, refreshPlanRsvp);
    return () => window.removeEventListener(REPEAT_GROUP_RSVP_EVENT, refreshPlanRsvp);
  }, [refreshPlanRsvp]);

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (!supabase) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !active) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url, full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (!active || error) return;

      setAvatarUrl(
        typeof data?.avatar_url === "string" ? data.avatar_url.trim() : "",
      );
      setProfileFullName(
        typeof data?.full_name === "string" ? data.full_name.trim() : "",
      );
    };

    void run();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-surface-primary">
      <div
        className="flex flex-1 flex-col gap-[24px] overflow-y-auto px-[20px]"
        style={{ paddingBottom: "calc(108px + env(safe-area-inset-bottom))" }}
      >
        <div className="flex flex-col gap-[16px] pt-[32px]">
          <h1 className="type-heading-2xl text-primary-token">My circles</h1>
          <GroupPlansLegend />
        </div>

        <div className="flex flex-wrap gap-[14px]">
          {groups.length > 0 ? (
            groups.map((group) => (
              <GroupCard
                key={group.id}
                currentUserAvatar={avatarUrl || undefined}
                group={group}
                savedPlanRsvp={planRsvpByGroupId[group.id] ?? null}
                onClick={() => {
                  const participantsList = group.participants;
                  const viewer = resolveRsvpViewerInCircle(
                    participantsList,
                    participantsList[0] ?? null,
                    avatarUrl.trim() ? avatarUrl : null,
                    profileFullName.trim() ? profileFullName : null,
                    null,
                  );
                  navigate("/chat", {
                    state: {
                      groupId: group.id,
                      isRepeatGroup: true,
                      participants: participantsList,
                      plan: {
                        id: group.id,
                        title: group.title,
                        creator: participantsList[0],
                      },
                      ...(typeof viewer?.seedUserId === "number"
                        ? { viewerSeedUserId: viewer.seedUserId }
                        : {}),
                    },
                  });
                }}
              />
            ))
          ) : (
            <div className="flex min-h-[calc(100dvh-238px)] w-full items-center justify-center">
              <div className="flex w-full max-w-[353px] flex-col items-center gap-[32px]">
                <div className="relative w-[172px] overflow-visible" style={{ aspectRatio: "257.5 / 125" }}>
                  <div className="absolute left-0 top-0 h-[125px] w-[257.5px] origin-top-left scale-[0.667961]">
                    <div
                      className="absolute left-0 top-[0.46px] flex size-[100px] items-center justify-center"
                      style={{ transform: "rotate(-12deg)" }}
                    >
                      <img
                        alt=""
                        className="size-[100px] rounded-full border-[2.5px] object-cover"
                        style={{ borderColor: "var(--color-surface-surface-bg-primary, #FEFEFE)" }}
                        src={imageLeft}
                      />
                    </div>
                    <div
                      className="absolute right-0 top-0 flex size-[100px] items-center justify-center"
                      style={{ transform: "rotate(10deg)" }}
                    >
                      <img
                        alt=""
                        className="size-[100px] rounded-full border-[2.5px] object-cover"
                        style={{ borderColor: "var(--color-surface-surface-bg-primary, #FEFEFE)" }}
                        src={imageRight}
                      />
                    </div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                      <img
                        alt=""
                        className="size-[100px] rounded-full border-[2.5px] object-cover"
                        style={{ borderColor: "var(--color-surface-surface-bg-primary, #FEFEFE)" }}
                        src={imageBottom}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex w-full flex-col items-center gap-[8px] text-center">
                  <p className="type-heading-l text-primary-token">
                    You don&apos;t have any circles yet
                  </p>
                  <p className="w-[218px] type-body-s text-primary-token">
                    After you finish a plan, you&apos;ll choose who you&apos;d like to meet again.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <CircleAcceptedModal
        isOpen={isAcceptedModalOpen}
        onClose={closeAcceptedModal}
        description={acceptedDescription}
      />

      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-card-token bg-surface-primary">
        <AppNavbar
          activeTab="groups"
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
