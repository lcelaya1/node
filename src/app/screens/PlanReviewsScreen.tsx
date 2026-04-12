import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { FlowScreenHeader } from "../components/FlowScreenHeader";
import { IconButton } from "../components/IconButton";
import type { DemoUser } from "../lib/demoUsers";
import { buildParticipantReviews } from "../lib/planFeedback";
import { loadSavedPlan } from "../lib/plans";
import mariaAvatar from "../../assets/Rectangle 8.png";

const vibeOptions = [
  "Great energy",
  "Good listener",
  "Funny",
  "Punctual",
  "Easy-going",
  "Deep talker",
];

const fallbackParticipants = [
  { name: "Maria", imageUrl: mariaAvatar },
  { name: "Jan" },
  { name: "Marc" },
  { name: "Clara" },
];

type PlanReviewsState = {
  overallLabel?: string;
  overallRating?: number;
  participants?: DemoUser[];
  plan?: {
    id?: string | number;
    title?: string;
  };
};

type UserReviewData = {
  confirmed: boolean;
  customVibe: string;
  expanded: boolean;
  selectedVibes: string[];
};

type UserReviewProps = {
  customVibe: string;
  imageUrl?: string;
  isConfirmed: boolean;
  isExpanded: boolean;
  name: string;
  onCustomVibeChange: (value: string) => void;
  onToggle: () => void;
  onVibeToggle: (vibe: string) => void;
  selectedVibes: string[];
};

function InfoContent() {
  return (
    <div className="flex w-full flex-col items-start gap-[8px]">
      <p className="w-full font-primary text-[24px] leading-[28px] text-primary-token">
        The Vibe Check.
      </p>
      <p className="w-full type-body-s text-secondary-token">
        Because great connections deserve a shoutout. Who made your day better?
      </p>
    </div>
  );
}

function Avatar({ imageUrl, name }: { imageUrl?: string; name: string }) {
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
    <div className="flex size-[44px] items-center justify-center rounded-full bg-surface-secondary">
      <span className="text-[14px] leading-[18px] text-primary-token">
        {name.charAt(0)}
      </span>
    </div>
  );
}

function ReviewChip({
  children,
  selected = false,
  onClick,
}: {
  children: string;
  selected?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[50px] border border-primary-token px-[16px] py-[8px] text-[12px] leading-[16px] transition-colors ${
        selected
          ? "bg-button-primary text-invert-token"
          : "bg-surface-primary text-primary-token"
      }`}
    >
      {children}
    </button>
  );
}

function UserReview({
  customVibe,
  imageUrl,
  isConfirmed,
  isExpanded,
  name,
  onCustomVibeChange,
  onToggle,
  onVibeToggle,
  selectedVibes,
}: UserReviewProps) {
  const hasInput = selectedVibes.length > 0 || customVibe.trim().length > 0;
  const showDone = isConfirmed || (isExpanded && hasInput);
  const showAdd = !isExpanded && !isConfirmed;
  const confirmedVibes = useMemo(() => {
    const trimmedCustomVibe = customVibe.trim();
    return trimmedCustomVibe
      ? [...selectedVibes, trimmedCustomVibe]
      : selectedVibes;
  }, [customVibe, selectedVibes]);

  const showConfirmedVibes = isConfirmed && confirmedVibes.length > 0;

  return (
    <div
      className={`w-full rounded-[8px] border bg-surface-primary p-[16px] ${
        isExpanded ? "border-selected-token" : "border-card-token"
      } cursor-pointer`}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onToggle();
        }
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[8px]">
          <Avatar imageUrl={imageUrl} name={name} />
          <p className="type-body-s text-primary-token">{name}</p>
        </div>

        <IconButton
          icon={showDone ? "Done" : "Add"}
          hierarchy={showDone ? "Secondary" : "Link"}
          size={showDone ? "Small" : "Large"}
          onClick={(event) => {
            event.stopPropagation();
            onToggle();
          }}
          className={`transition-transform active:scale-95 ${showDone || showAdd ? "" : "invisible"}`}
          aria-label={
            showDone
              ? isExpanded
                ? `Confirm ${name}'s vibes`
                : `Edit ${name}'s vibes`
              : showAdd
                ? `Add vibes for ${name}`
                : undefined
          }
        />
      </div>

      {showConfirmedVibes && !isExpanded ? (
        <div className="mt-[16px] flex flex-wrap gap-[8px]">
          {confirmedVibes.map((vibe) => (
            <ReviewChip key={vibe}>{vibe}</ReviewChip>
          ))}
        </div>
      ) : null}

      {isExpanded ? (
        <div
          className="mt-[16px] flex flex-col gap-[16px]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="h-px w-full bg-card-token" />

          <div className="flex flex-col gap-[8px]">
            <p className="text-[12px] leading-[16px] text-primary-token">
              Choose {name}&apos;s vibes
            </p>
            <div className="flex flex-wrap gap-[8px]">
              {vibeOptions.map((vibe) => (
                <ReviewChip
                  key={vibe}
                  selected={selectedVibes.includes(vibe)}
                  onClick={(event) => {
                    event.stopPropagation();
                    onVibeToggle(vibe);
                  }}
                >
                  {vibe}
                </ReviewChip>
              ))}
            </div>
          </div>

          <div className="w-full rounded-[12px] bg-[#f3f3f3] px-[12px] py-[14px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
            <input
              type="text"
              value={customVibe}
              onChange={(event) => onCustomVibeChange(event.target.value)}
              onClick={(event) => event.stopPropagation()}
              placeholder="Add a specific vibe..."
              className="w-full bg-transparent text-[14px] leading-[18px] text-primary-token outline-none placeholder:text-[#9a9a9a]"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function PlanReviewsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as PlanReviewsState | null) ?? null;
  const [savedParticipants, setSavedParticipants] = useState<DemoUser[]>([]);
  const participants = useMemo(
    () =>
      state?.participants?.length
        ? state.participants.map((participant) => ({
            imageUrl: participant.avatarUrl || undefined,
            name: participant.name,
          }))
        : savedParticipants.length
          ? savedParticipants.map((participant) => ({
              imageUrl: participant.avatarUrl || undefined,
              name: participant.name,
            }))
          : fallbackParticipants,
    [savedParticipants, state?.participants],
  );
  const reviewsByName = useMemo(
    () =>
      Object.fromEntries(
        participants.map(({ name }) => [
          name,
          {
            confirmed: false,
            customVibe: "",
            expanded: false,
            selectedVibes: [],
          },
        ]),
      ) as Record<string, UserReviewData>,
    [participants],
  );
  const [userReviews, setUserReviews] = useState<Record<string, UserReviewData>>(
    reviewsByName,
  );

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

  useEffect(() => {
    setUserReviews((current) => {
      const next = Object.fromEntries(
        participants.map(({ name }) => [
          name,
          current[name] ?? {
            confirmed: false,
            customVibe: "",
            expanded: false,
            selectedVibes: [],
          },
        ]),
      );

      return next;
    });
  }, [participants]);

  const goToRepeatVibe = (includeReviews: boolean) =>
    navigate("/repeat-vibe", {
      state: {
        overallLabel: state?.overallLabel,
        overallRating: state?.overallRating,
        participants:
          state?.participants ?? savedParticipants,
        participantReviews: includeReviews
          ? buildParticipantReviews(
              (state?.participants?.length ? state.participants : savedParticipants) as DemoUser[],
              userReviews,
            )
          : undefined,
        plan: state?.plan,
      },
    });
  const handleSkip = () => goToRepeatVibe(false);
  const handleContinue = () => goToRepeatVibe(true);

  const toggleUserExpanded = (name: string) => {
    setUserReviews((current) => {
      const review = current[name] ?? reviewsByName[name];

      if (review.expanded) {
        return {
          ...current,
          [name]: {
            ...review,
            confirmed: review.selectedVibes.length > 0 || review.customVibe.trim().length > 0,
            expanded: false,
          },
        };
      }

      if (review.confirmed) {
        return {
          ...current,
          [name]: {
            ...review,
            confirmed: false,
            expanded: true,
          },
        };
      }

      return {
        ...current,
        [name]: {
          ...review,
          expanded: true,
        },
      };
    });
  };

  const toggleVibe = (userName: string, vibe: string) => {
    setUserReviews((current) => {
      const review = current[userName] ?? reviewsByName[userName];
      const selectedVibes = review.selectedVibes.includes(vibe)
        ? review.selectedVibes.filter((item) => item !== vibe)
        : [...review.selectedVibes, vibe];

      return {
        ...current,
        [userName]: {
          ...review,
          selectedVibes,
        },
      };
    });
  };

  const updateCustomVibe = (userName: string, value: string) => {
    setUserReviews((current) => ({
      ...current,
      [userName]: {
        ...(current[userName] ?? reviewsByName[userName]),
        customVibe: value,
      },
    }));
  };

  const hasConfirmedReviews = Object.values(userReviews).some(
    (review) => review.confirmed && (review.selectedVibes.length > 0 || review.customVibe.trim().length > 0),
  );

  return (
    <div className="flex size-full flex-col bg-surface-primary px-[20px] pb-[16px] pt-[32px]">
      <FlowScreenHeader onBack={() => navigate(-1)} onSkip={handleSkip} />

      <div className="min-h-0 flex-1 overflow-y-auto pb-[12px] pt-[36px]">
        <div className="flex w-full flex-col gap-[32px]">
          <InfoContent />

          <div className="flex w-full flex-col gap-[12px]">
            {participants.map((participant) => {
              const review = userReviews[participant.name] ?? reviewsByName[participant.name];

              return (
              <UserReview
                key={participant.name}
                name={participant.name}
                imageUrl={participant.imageUrl}
                isExpanded={review.expanded}
                isConfirmed={review.confirmed}
                onToggle={() => toggleUserExpanded(participant.name)}
                selectedVibes={review.selectedVibes}
                onVibeToggle={(vibe) => toggleVibe(participant.name, vibe)}
                customVibe={review.customVibe}
                onCustomVibeChange={(value) => updateCustomVibe(participant.name, value)}
              />
              );
            })}
          </div>
        </div>
      </div>

      {hasConfirmedReviews ? (
        <button
          type="button"
          onClick={handleContinue}
          className="flex h-[45px] w-full items-center justify-center rounded-[999px] bg-button-primary"
        >
          <span className="type-body-m text-invert-token">Continue</span>
        </button>
      ) : null}
    </div>
  );
}
