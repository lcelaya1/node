import { useState } from "react";
import { CreateAccountBackButton } from "../components/CreateAccountBackButton";
import { supabase } from "../lib/supabase";

type CreateProfileNameScreenProps = {
  value?: string;
  onChange?: (value: string) => void;
  onBack?: () => void;
  onContinue?: () => void;
};

export default function CreateProfileNameScreen({
  value = "",
  onChange,
  onBack,
  onContinue,
}: CreateProfileNameScreenProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const canContinue = value.trim().length > 0 && !isSaving;

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
          full_name: value.trim(),
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
            <p className="type-heading-xl text-primary-token">
              First, what&apos;s your name?
            </p>
            <p className="type-body-s text-secondary-token">
              This is the name that would appear
            </p>
          </div>

          <div className="flex w-full flex-col gap-[8px]">
            <p className="type-body-m-medium text-primary-token">Your name</p>
            <div className="flex w-full items-center rounded-[12px] bg-[#f3f3f3] p-[12px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
              <input
                type="text"
                value={value}
                onChange={(event) => onChange?.(event.target.value)}
                className="type-body-m min-w-0 flex-1 bg-transparent text-primary-token outline-none placeholder:text-secondary-token"
                placeholder="Cristina"
              />
            </div>
          </div>

          {errorMessage ? (
            <p className="type-body-xs text-brand-token">{errorMessage}</p>
          ) : null}
        </div>

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
  );
}
