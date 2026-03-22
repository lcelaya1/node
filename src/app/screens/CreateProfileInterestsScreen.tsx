import { useState } from "react";
import { CreateAccountBackButton } from "../components/CreateAccountBackButton";
import { supabase } from "../lib/supabase";

type CreateProfileInterestsScreenProps = {
  value?: string[];
  onChange?: (value: string[]) => void;
  onBack?: () => void;
  onContinue?: () => void;
};

const INTEREST_OPTIONS = [
  "Sports",
  "Travel",
  "Nature",
  "Tours",
  "Picnics",
  "Food",
  "Photography",
  "Outdoors",
  "Coffee",
  "Spa",
  "Self-care",
  "Make Up",
  "Mindfulness",
  "Tea",
  "Cocktails",
  "Literature",
  "Languages",
  "Fashion",
  "Films",
  "Entrepreneurship",
  "Art",
  "Music",
  "Cooking",
  "Social Media",
  "LGTBQIA+",
  "Theatre",
  "Content Creation",
  "Karaoke",
  "Science Fiction",
  "Politics",
  "Ecology",
];

function InterestChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[50px] ${active ? "bg-primary" : "bg-[#f9f9f9]"}`}
      style={{
        border: active
          ? "0.5px solid var(--color-border-selected)"
          : "1px solid #e6e6e6",
      }}
    >
      <div className="flex items-start px-[16px] py-[8px]">
        <p className={`type-body-xs text-center whitespace-nowrap ${active ? "text-invert-token" : "text-primary-token"}`}>
          {label}
        </p>
      </div>
    </button>
  );
}

export default function CreateProfileInterestsScreen({
  value = [],
  onChange,
  onBack,
  onContinue,
}: CreateProfileInterestsScreenProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const canContinue = value.length >= 3 && !isSaving;

  const toggleInterest = (interest: string) => {
    onChange?.(
      value.includes(interest)
        ? value.filter((item) => item !== interest)
        : [...value, interest],
    );
  };

  const handleContinue = async () => {
    if (!canContinue) return;

    if (!supabase) {
      onContinue?.();
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("We couldn’t find your account. Please log in again.");

      const { error } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          email: user.email ?? null,
          interests: value,
        },
        {
          onConflict: "id",
        },
      );

      if (error) throw error;

      onContinue?.();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong. Try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex size-full flex-col gap-[80px] bg-surface-primary pb-[32px]">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-between px-[24px] pt-[16px]">
        <div className="flex w-full flex-col gap-[20px]">
          <CreateAccountBackButton onClick={onBack} />

          <div className="flex w-full flex-col gap-[8px]">
            <p className="type-heading-xl text-primary-token">What are you into?</p>
            <p className="type-body-s text-secondary-token">
              Select minimum 3 preferences.
            </p>
          </div>

          <div className="flex w-full flex-wrap items-start gap-x-[8px] gap-y-[12px]">
            {INTEREST_OPTIONS.map((interest) => (
              <InterestChip
                key={interest}
                active={value.includes(interest)}
                label={interest}
                onClick={() => toggleInterest(interest)}
              />
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col gap-[20px]">
          {errorMessage ? (
            <p className="w-full text-left type-body-xs text-brand-token">{errorMessage}</p>
          ) : null}

          <button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue}
            className="flex w-full items-center justify-center rounded-[999px] px-[32px] py-[12px]"
            style={{
              backgroundColor: canContinue
                ? "var(--color-button-primary)"
                : "var(--color-surface-fill)",
            }}
          >
            <span
              className="type-body-m"
              style={{
                color: canContinue
                  ? "var(--color-text-invert)"
                  : "var(--color-surface-bg-secondary)",
              }}
            >
              {isSaving ? "Saving..." : "Continue"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
