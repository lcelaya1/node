import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { FlowScreenHeader } from "../components/FlowScreenHeader";
import { IconButton } from "../components/IconButton";
import type { DemoUser } from "../lib/demoUsers";
import { savePlanFeedback, type ParticipantReviewInput } from "../lib/planFeedback";
import { loadSavedPlan, markPlanCompleted } from "../lib/plans";
import { saveGroup } from "../lib/groups";

type RepeatVibeState = {
  overallLabel?: string;
  overallRating?: number;
  participantReviews?: ParticipantReviewInput[];
  participants?: DemoUser[];
  plan?: {
    id?: string | number;
    title?: string;
  };
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
        Repeat the vibe?
      </p>
      <p className="w-full type-body-s text-secondary-token">
        Select who you&apos;d like to see again.
      </p>
    </div>
  );
}

function Avatar({
  imageUrl,
  name,
}: {
  imageUrl?: string;
  name: string;
}) {
  if (imageUrl) {
    return (
      <img
        alt={name}
        className="size-[44px] rounded-full object-cover"
        src={imageUrl}
      />
    );
  }

  return (
    <div className="flex size-[44px] items-center justify-center rounded-full bg-[#dfdfdf]">
      <span className="text-[14px] leading-[18px] text-primary-token">
        {name.charAt(0)}
      </span>
    </div>
  );
}

function UserRepeatCard({
  age,
  imageUrl,
  isSelected,
  name,
  onToggle,
}: {
  age?: number;
  imageUrl?: string;
  isSelected: boolean;
  name: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full rounded-[8px] border bg-surface-primary p-[16px] text-left ${
        isSelected ? "border-selected-token" : "border-card-token"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[8px]">
          <Avatar imageUrl={imageUrl} name={name} />
          <p className="type-body-s text-primary-token">
            {name}
            {typeof age === "number" && age > 0 ? `, ${age}` : ""}
          </p>
        </div>

        {isSelected ? (
          <IconButton
            icon="Done"
            hierarchy="Secondary"
            size="Small"
            onClick={(event) => {
              event.stopPropagation();
              onToggle();
            }}
            aria-label={`Remove ${name} from meet again`}
          />
        ) : (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onToggle();
            }}
            className="type-body-s text-secondary-token"
          >
            Meet again
          </button>
        )}
      </div>
    </button>
  );
}

export default function RepeatVibeScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as RepeatVibeState | null) ?? null;
  const [savedParticipants, setSavedParticipants] = useState<DemoUser[]>([]);
  const participants = useMemo<ParticipantCard[]>(
    () =>
      (state?.participants?.length ? state.participants : savedParticipants).map((participant) => ({
        age: participant.age,
        imageUrl: participant.avatarUrl || undefined,
        name: participant.name,
      })),
    [savedParticipants, state?.participants],
  );
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    let active = true;

    const run = async () => {
      const planId = state?.plan?.id;
      if (state?.participants?.length || planId === undefined || planId === null) return;

      const savedPlan = await loadSavedPlan(String(planId));
      if (!active) return;

      setSavedParticipants(savedPlan?.participants ?? []);
    };

    void run();

    return () => {
      active = false;
    };
  }, [state?.participants, state?.plan?.id]);

  const toggleUser = (name: string) => {
    setSelectedUsers((current) => {
      const next = new Set(current);

      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }

      return next;
    });
  };

  const hasSelections = selectedUsers.size > 0;
  const participantSource = state?.participants?.length ? state.participants : savedParticipants;

  const handleConfirm = async () => {
    if (!hasSelections) return;

    const selectedUsersArray = Array.from(selectedUsers);
    if (state?.plan?.id !== undefined && state?.plan?.id !== null && state?.overallLabel !== undefined && state?.overallRating !== undefined) {
      await savePlanFeedback({
        overallLabel: state.overallLabel,
        overallRating: state.overallRating,
        participantReviews:
          state.participantReviews?.map((review) => ({
            ...review,
            wantsToMeetAgain: selectedUsersArray.includes(review.name),
          })) ?? [],
        planId: String(state.plan.id),
        planTitle: state.plan.title,
      });
    }

    if (state?.plan?.id !== undefined && state?.plan?.id !== null) {
      await markPlanCompleted(String(state.plan.id));
    }

    const groupParticipants = participantSource.filter((participant) =>
      selectedUsersArray.includes(participant.name),
    );
    const groupTitle = groupParticipants.map((participant) => participant.name).join(", ");
    const groupId = `repeat-${selectedUsersArray.slice().sort().join("-").toLowerCase()}`;

    await saveGroup({
      createdAt: new Date().toISOString(),
      id: groupId,
      participants: groupParticipants,
      title: groupTitle || "Repeat vibe",
    });

    navigate("/vibe-matched", {
      state: {
        groupId,
        groupTitle: groupTitle || "Repeat vibe",
        participants: participantSource,
        selectedUsers: selectedUsersArray,
      },
    });
  };

  const handleJustForToday = async () => {
    if (state?.plan?.id !== undefined && state?.plan?.id !== null && state?.overallLabel !== undefined && state?.overallRating !== undefined) {
      await savePlanFeedback({
        overallLabel: state.overallLabel,
        overallRating: state.overallRating,
        participantReviews: state.participantReviews ?? [],
        planId: String(state.plan.id),
        planTitle: state.plan.title,
      });
    }

    if (state?.plan?.id !== undefined && state?.plan?.id !== null) {
      await markPlanCompleted(String(state.plan.id));
    }
    navigate("/", { replace: true });
  };

  const handleSkip = async () => {
    if (state?.plan?.id !== undefined && state?.plan?.id !== null) {
      await markPlanCompleted(String(state.plan.id));
    }
    navigate("/", { replace: true });
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-surface-primary">
      <div
        className="flex flex-1 flex-col overflow-y-auto px-[20px] pt-[32px]"
        style={{ paddingBottom: "calc(32px + env(safe-area-inset-bottom))" }}
      >
        <FlowScreenHeader
          onBack={() => navigate(-1)}
          onSkip={() => void handleSkip()}
        />

        <div className="flex flex-col gap-[32px] pt-[36px]">
          <InfoContent />

          <div className="flex flex-col gap-[12px]">
            {participants.map((participant) => (
              <UserRepeatCard
                key={participant.name}
                age={participant.age}
                imageUrl={participant.imageUrl}
                isSelected={selectedUsers.has(participant.name)}
                name={participant.name}
                onToggle={() => toggleUser(participant.name)}
              />
            ))}
          </div>

          <div className="flex flex-col gap-[12px]">
            <button
              type="button"
              onClick={() => void handleConfirm()}
              className={`flex h-[45px] w-full items-center justify-center rounded-[999px] ${
                hasSelections ? "bg-button-primary" : "bg-[#71717a]"
              }`}
            >
              <span className="type-body-m text-invert-token">Confirm</span>
            </button>

            <button
              type="button"
              onClick={() => void handleJustForToday()}
              className="flex h-[45px] w-full items-center justify-center rounded-[999px] border border-selected-token bg-surface-primary"
            >
              <span className="type-body-m text-primary-token">Just for today</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
