import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import type { DemoUser } from "../lib/demoUsers";
import { supabase } from "../lib/supabase";

type VibeMatchedState = {
  groupId?: string;
  groupTitle?: string;
  participants?: DemoUser[];
  selectedUsers?: string[];
};

type ParticipantCard = {
  age?: number;
  imageUrl?: string;
  name: string;
};

function InfoContent() {
  return (
    <div className="flex w-full flex-col items-start gap-[8px]">
      <p className="w-full font-primary text-[24px] leading-[28px] text-primary-token">
        Vibe matched!
      </p>
      <p className="w-full type-body-s text-secondary-token">
        Confirmed! You want to meet again.
      </p>
    </div>
  );
}

function Profile({
  age,
  imageUrl,
  name,
}: ParticipantCard) {
  return (
    <div className="flex w-[90px] shrink-0 flex-col items-center gap-[14px]">
      {imageUrl ? (
        <img
          alt={name}
          className="size-[90px] rounded-full object-cover"
          src={imageUrl}
        />
      ) : (
        <div className="flex size-[90px] items-center justify-center rounded-full bg-[#d9d9d9]">
          <span className="type-body-m text-primary-token">{name.charAt(0)}</span>
        </div>
      )}
      <p className="type-body-s text-primary-token">
        {name}
        {typeof age === "number" ? `, ${age}` : ""}
      </p>
    </div>
  );
}

export default function VibeMatchedScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as VibeMatchedState | null) ?? null;
  const selectedUsers = state?.selectedUsers ?? [];
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string | null>(null);
  const matchedParticipants = useMemo(
    () =>
      (state?.participants ?? [])
        .filter((participant) => selectedUsers.includes(participant.name))
        .map((participant) => ({
          age: participant.age,
          imageUrl: participant.avatarUrl || undefined,
          name: participant.name,
        })),
    [selectedUsers, state?.participants],
  );

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

      setCurrentUserAvatar(
        typeof data?.avatar_url === "string" && data.avatar_url.trim().length > 0
          ? data.avatar_url
          : null,
      );
    };

    void run();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (matchedParticipants.length === 0) return;
    if (!state?.groupId) return;

    const timeoutId = window.setTimeout(() => {
      navigate("/chat", {
        replace: true,
        state: {
          groupId: state.groupId,
          isRepeatGroup: true,
          participants: (state?.participants ?? []).filter((participant) =>
            selectedUsers.includes(participant.name),
          ),
          plan: {
            id: state.groupId,
            title: state.groupTitle || "Repeat vibe",
          },
        },
      });
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [matchedParticipants.length, navigate, selectedUsers, state?.groupId, state?.groupTitle, state?.participants]);

  return (
    <div className="flex h-full flex-col bg-surface-primary px-[20px] pt-[103px]">
      <div className="flex flex-1 flex-col items-center pb-[32px]">
        <div className="flex w-full flex-col items-center gap-[32px]">
          <InfoContent />

          <div className="flex flex-wrap items-start justify-center gap-[12px]">
            {matchedParticipants.map((participant) => (
              <Profile
                key={participant.name}
                age={participant.age}
                imageUrl={participant.imageUrl}
                name={participant.name}
              />
            ))}
            <Profile imageUrl={currentUserAvatar ?? undefined} name="You" />
          </div>
        </div>
      </div>
    </div>
  );
}
