import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AppNavbar } from "../components/AppNavbar";
import { GroupCard } from "../components/GroupCard";
import { loadSavedGroups } from "../lib/groups";
import { supabase } from "../lib/supabase";

export default function GroupsScreen() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<SavedGroup[]>([]);
  const [avatarUrl, setAvatarUrl] = useState("");

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
            <p className="type-body-s text-secondary-token">
              Your repeat-vibe groups will appear here.
            </p>
          )}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-card-token bg-surface-primary">
        <AppNavbar
          activeTab="groups"
          activeTone="brand"
          onCreatePlanClick={() => navigate("/add-specs")}
          onJoinPlanClick={() => navigate("/join-plan")}
          onTabClick={(tab) => {
            if (tab === "home") navigate("/");
            if (tab === "groups") navigate("/groups");
            if (tab === "profile") navigate("/profile");
          }}
        />
      </div>
    </div>
  );
}
