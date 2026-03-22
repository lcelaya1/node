import { useRef, useState } from "react";
import { AppIcon } from "../components/AppIcon";
import { CreateAccountBackButton } from "../components/CreateAccountBackButton";
import { supabase } from "../lib/supabase";

type CreateProfilePictureScreenProps = {
  value?: string;
  onChange?: (value: string) => void;
  onBack?: () => void;
  onContinue?: () => void;
};

export default function CreateProfilePictureScreen({
  value = "",
  onChange,
  onBack,
  onContinue,
}: CreateProfilePictureScreenProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canContinue = Boolean(value) && !isSaving;

  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange?.(reader.result);
        setErrorMessage("");
      }
    };
    reader.onerror = () => {
      setErrorMessage("We couldn’t read that image. Try another one.");
    };
    reader.readAsDataURL(file);
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
          avatar_url: value,
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
              Choose your profile picture
            </p>
            <p className="type-body-s text-secondary-token">
              Add at least one picture to complete your profile.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePickImage}
            className="relative flex h-[210px] w-full items-center justify-center overflow-hidden rounded-[16px] border-[0.5px] border-primary-token bg-[#efefef]"
          >
            {value ? (
              <img
                alt="Selected profile"
                className="absolute inset-0 size-full object-cover"
                src={value}
              />
            ) : null}

            {!value ? (
              <div className="flex items-center justify-center gap-[10px] px-[68px] py-[81px]">
                <AppIcon className="text-primary-token" name="Camera" size={24} />
              </div>
            ) : null}

            <div className="absolute bottom-[13px] right-[13px] flex items-center justify-center rounded-[999px] bg-button-secondary p-[6px] text-invert-token">
              <AppIcon name="Add" size={16} />
            </div>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
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
