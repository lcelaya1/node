import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { AppNavbar } from "../components/AppNavbar";
import { GroupCard } from "../components/GroupCard";
import { loadSavedGroups, type SavedGroup } from "../lib/groups";
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

export default function GroupsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as GroupsLocationState | null) ?? null;
  const [groups, setGroups] = useState<SavedGroup[]>([]);
  const [avatarUrl, setAvatarUrl] = useState("");
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
        .select("avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (!active || error) return;

      setAvatarUrl(
        typeof data?.avatar_url === "string" ? data.avatar_url.trim() : "",
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
        <div className="flex items-center justify-between pt-[32px]">
          <h1 className="type-heading-2xl text-primary-token">My circles</h1>

          <div className="size-[40px] overflow-hidden rounded-full bg-surface-secondary">
            {avatarUrl ? (
              <img
                alt="Profile"
                className="size-full object-cover"
                src={avatarUrl}
              />
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-[14px]">
          {groups.length > 0 ? (
            groups.map((group) => (
              <GroupCard
                key={group.id}
                currentUserAvatar={avatarUrl || undefined}
                group={group}
                onClick={() =>
                  navigate("/chat", {
                    state: {
                      groupId: group.id,
                      isRepeatGroup: true,
                      participants: group.participants,
                      plan: {
                        id: group.id,
                        title: group.title,
                      },
                    },
                  })
                }
              />
            ))
          ) : (
            <div className="flex min-h-[calc(100dvh-238px)] w-full items-center justify-center">
              <div className="flex w-full max-w-[353px] flex-col items-center gap-[40px]">
                <div className="relative h-[125px] w-[257.5px]">
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
