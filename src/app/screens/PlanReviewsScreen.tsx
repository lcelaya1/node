import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { FlowScreenHeader } from "../components/FlowScreenHeader";
import { IconButton } from "../components/IconButton";
import type { DemoUser } from "../lib/demoUsers";
import { buildParticipantReviews } from "../lib/planFeedback";
import { loadSavedPlan } from "../lib/plans";
import mariaAvatar from "../../assets/Rectangle 8.png";

type ParticipantEntry = {
  imageUrl?: string;
  interests: string[];
  name: string;
};

const fallbackParticipants: ParticipantEntry[] = [
  { name: "Maria", imageUrl: mariaAvatar, interests: ["Great energy", "Good listener", "Funny"] },
  { name: "Jan",   imageUrl: undefined,   interests: ["Punctual", "Easy-going", "Deep talker"] },
  { name: "Marc",  imageUrl: undefined,   interests: ["Funny", "Great energy", "Punctual"] },
  { name: "Clara", imageUrl: undefined,   interests: ["Good listener", "Easy-going", "Funny"] },
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
  customInput: string;
  customVibes: string[];
  expanded: boolean;
  selectedVibes: string[];
};

type UserReviewProps = {
  customInput: string;
  customVibes: string[];
  imageUrl?: string;
  isConfirmed: boolean;
  isExpanded: boolean;
  name: string;
  onCustomInputChange: (value: string) => void;
  onCustomVibeAdd: (vibe: string) => void;
  onCustomVibeRemove: (vibe: string) => void;
  onToggle: () => void;
  onVibeToggle: (vibe: string) => void;
  profileTags: string[];
  selectedVibes: string[];
};

function InfoContent() {
  return (
    <div className="flex w-full flex-col items-start gap-[8px]">
      <p className="w-full font-primary text-[24px] leading-[28px] text-primary-token">
        The Vibe Check.
      </p>
      <p className="w-full type-body-s text-secondary-token">
        Tag the energy each person gave you — what did they transmit during the plan?
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
  onRemove,
  onClick,
}: {
  children: string;
  selected?: boolean;
  onRemove?: () => void;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-[6px] rounded-[50px] border px-[16px] py-[8px] text-[12px] leading-[16px] transition-colors ${
        selected
          ? "bg-button-primary border-button-primary text-invert-token"
          : "border-primary-token bg-surface-primary text-primary-token"
      }`}
    >
      {children}
      {onRemove && (
        <span
          role="button"
          aria-label={`Remove ${children}`}
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="flex items-center justify-center opacity-60 hover:opacity-100"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      )}
    </button>
  );
}

function UserReview({
  customInput = "",
  customVibes = [],
  imageUrl,
  isConfirmed,
  isExpanded,
  name,
  onCustomInputChange,
  onCustomVibeAdd,
  onCustomVibeRemove,
  onToggle,
  onVibeToggle,
  profileTags = [],
  selectedVibes = [],
}: UserReviewProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasInput = selectedVibes.length > 0 || customVibes.length > 0;
  const showDone = isConfirmed || (isExpanded && hasInput);
  const showAdd = !isExpanded && !isConfirmed;

  const confirmedVibes = useMemo(
    () => [...selectedVibes, ...customVibes],
    [customVibes, selectedVibes],
  );
  const showConfirmedVibes = isConfirmed && confirmedVibes.length > 0;

  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (!trimmed || customVibes.includes(trimmed)) return;
    onCustomVibeAdd(trimmed);
    onCustomInputChange("");
    inputRef.current?.focus();
  };

  return (
    <div
      className={`w-full rounded-[8px] border bg-surface-primary p-[16px] ${
        isExpanded ? "border-selected-token" : "border-card-token"
      } cursor-pointer`}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.target instanceof HTMLInputElement) return;
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
          className="mt-[16px] flex flex-col gap-[16px] border-t border-card-token pt-[16px]"
          onClick={(event) => event.stopPropagation()}
        >
          {/* Profile tags — the 3 traits from their profile */}
          <div className="flex flex-col gap-[8px]">
            <p className="text-[12px] leading-[16px] text-primary-token">
              What did {name} transmit to you?
            </p>
            <div className="flex flex-wrap gap-[8px]">
              {profileTags.map((tag) => (
                <ReviewChip
                  key={tag}
                  selected={selectedVibes.includes(tag)}
                  onClick={(event) => {
                    event.stopPropagation();
                    onVibeToggle(tag);
                  }}
                >
                  {tag}
                </ReviewChip>
              ))}
            </div>
          </div>

          {/* Custom tags adder */}
          <div className="flex flex-col gap-[8px]">
            {customVibes.length > 0 && (
              <div className="flex flex-wrap gap-[8px]">
                {customVibes.map((vibe) => (
                  <ReviewChip
                    key={vibe}
                    selected
                    onRemove={() => onCustomVibeRemove(vibe)}
                  >
                    {vibe}
                  </ReviewChip>
                ))}
              </div>
            )}

            <div className="flex items-center gap-[8px] w-full rounded-[12px] bg-[#f3f3f3] px-[12px] py-[11px]">
              <input
                ref={inputRef}
                type="text"
                value={customInput}
                onChange={(event) => onCustomInputChange(event.target.value)}
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => {
                  event.stopPropagation();
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleAddCustom();
                  }
                }}
                placeholder="Something else you want to add?"
                className="flex-1 min-w-0 bg-transparent text-[14px] leading-[18px] text-primary-token outline-none placeholder:text-[#9a9a9a]"
              />
              {customInput.trim() && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleAddCustom(); }}
                  className="shrink-0 flex items-center justify-center size-[22px] rounded-full bg-button-primary"
                  aria-label="Add tag"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 1V9M1 5H9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
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

  const participants = useMemo<ParticipantEntry[]>(
    () =>
      state?.participants?.length
        ? state.participants.map((p) => ({
            imageUrl: p.avatarUrl || undefined,
            interests: p.interests.slice(0, 3),
            name: p.name,
          }))
        : savedParticipants.length
          ? savedParticipants.map((p) => ({
              imageUrl: p.avatarUrl || undefined,
              interests: p.interests.slice(0, 3),
              name: p.name,
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
            customInput: "",
            customVibes: [],
            expanded: false,
            selectedVibes: [],
          } satisfies UserReviewData,
        ]),
      ) as Record<string, UserReviewData>,
    [participants],
  );

  const [userReviews, setUserReviews] = useState<Record<string, UserReviewData>>(reviewsByName);

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
    return () => { active = false; };
  }, [state?.participants, state?.plan?.id]);

  useEffect(() => {
    setUserReviews((current) => {
      return Object.fromEntries(
        participants.map(({ name }) => [
          name,
          current[name] ?? {
            confirmed: false,
            customInput: "",
            customVibes: [],
            expanded: false,
            selectedVibes: [],
          },
        ]),
      );
    });
  }, [participants]);

  const goToAddMemories = (includeReviews: boolean) =>
    navigate("/add-memories", {
      state: {
        overallLabel: state?.overallLabel,
        overallRating: state?.overallRating,
        participants: state?.participants ?? savedParticipants,
        participantReviews: includeReviews
          ? buildParticipantReviews(
              (state?.participants?.length ? state.participants : savedParticipants) as DemoUser[],
              // adapt to expected shape
              Object.fromEntries(
                Object.entries(userReviews).map(([name, r]) => [
                  name,
                  { ...r, customVibe: r.customVibes.join(", ") },
                ]),
              ),
            )
          : undefined,
        plan: state?.plan,
      },
    });

  const handleSkip = () => goToAddMemories(false);
  const handleContinue = () => goToAddMemories(true);

  const toggleUserExpanded = (name: string) => {
    setUserReviews((current) => {
      const review = current[name] ?? reviewsByName[name];
      if (review.expanded) {
        return {
          ...current,
          [name]: {
            ...review,
            confirmed: review.selectedVibes.length > 0 || review.customVibes.length > 0,
            expanded: false,
          },
        };
      }
      if (review.confirmed) {
        return { ...current, [name]: { ...review, confirmed: false, expanded: true } };
      }
      return { ...current, [name]: { ...review, expanded: true } };
    });
  };

  const toggleVibe = (userName: string, vibe: string) => {
    setUserReviews((current) => {
      const review = current[userName] ?? reviewsByName[userName];
      const selectedVibes = review.selectedVibes.includes(vibe)
        ? review.selectedVibes.filter((item) => item !== vibe)
        : [...review.selectedVibes, vibe];
      return { ...current, [userName]: { ...review, selectedVibes } };
    });
  };

  const addCustomVibe = (userName: string, vibe: string) => {
    setUserReviews((current) => {
      const review = current[userName] ?? reviewsByName[userName];
      if (review.customVibes.includes(vibe)) return current;
      return { ...current, [userName]: { ...review, customVibes: [...review.customVibes, vibe] } };
    });
  };

  const removeCustomVibe = (userName: string, vibe: string) => {
    setUserReviews((current) => {
      const review = current[userName] ?? reviewsByName[userName];
      return { ...current, [userName]: { ...review, customVibes: review.customVibes.filter((v) => v !== vibe) } };
    });
  };

  const updateCustomInput = (userName: string, value: string) => {
    setUserReviews((current) => ({
      ...current,
      [userName]: { ...(current[userName] ?? reviewsByName[userName]), customInput: value },
    }));
  };

  const hasConfirmedReviews = Object.values(userReviews).some(
    (review) => review.confirmed && (review.selectedVibes.length > 0 || review.customVibes.length > 0),
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
                  profileTags={participant.interests}
                  isExpanded={review.expanded}
                  isConfirmed={review.confirmed}
                  onToggle={() => toggleUserExpanded(participant.name)}
                  selectedVibes={review.selectedVibes}
                  onVibeToggle={(vibe) => toggleVibe(participant.name, vibe)}
                  customInput={review.customInput}
                  customVibes={review.customVibes}
                  onCustomInputChange={(value) => updateCustomInput(participant.name, value)}
                  onCustomVibeAdd={(vibe) => addCustomVibe(participant.name, vibe)}
                  onCustomVibeRemove={(vibe) => removeCustomVibe(participant.name, vibe)}
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
