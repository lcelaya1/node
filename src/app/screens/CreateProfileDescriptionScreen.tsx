import { useRef, useState } from "react";
import { AppIcon } from "../components/AppIcon";
import { AudioRecordingModal } from "../components/AudioRecordingModal";
import { CreateAccountBackButton } from "../components/CreateAccountBackButton";
import { supabase } from "../lib/supabase";

type CreateProfileDescriptionScreenProps = {
  value?: string;
  onChange?: (value: string) => void;
  onBack?: () => void;
  onContinue?: () => void;
};

export default function CreateProfileDescriptionScreen({
  value = "",
  onChange,
  onBack,
  onContinue,
}: CreateProfileDescriptionScreenProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const recordingBaseRef = useRef("");

  const canContinue = value.trim().length > 0 && !isSaving;

  const handleOpenRecording = () => {
    recordingBaseRef.current = value;
    setIsRecording(true);
  };

  const handleLiveTranscript = (text: string) => {
    const base = recordingBaseRef.current;
    onChange?.(base ? `${base} ${text}` : text);
  };

  const handleAudioSave = (text: string) => {
    const base = recordingBaseRef.current;
    onChange?.(text ? (base ? `${base} ${text}` : text) : base);
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
          bio: value.trim(),
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
    <>
      <div className="flex size-full flex-col gap-[80px] bg-surface-primary pb-[32px]">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-between px-[24px] pt-[16px]">
          <div className="flex w-full flex-col gap-[20px]">
            <CreateAccountBackButton onClick={onBack} />

            <div className="flex w-full flex-col gap-[8px]">
              <p className="type-heading-xl text-primary-token">Tell us a bit about yourself</p>
              <p className="type-body-s text-secondary-token">
                This description will show up in your profile.
              </p>
            </div>

            <div className="flex w-full flex-col gap-[8px]">
              <p className="type-body-m-medium text-primary-token">Biography</p>
              <div className="flex h-[240px] w-full flex-col justify-between rounded-[12px] bg-[#f3f3f3] p-[12px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
                <textarea
                  value={value}
                  onChange={(event) => onChange?.(event.target.value)}
                  placeholder="Start writing..."
                  className="type-body-m h-full w-full resize-none bg-transparent text-primary-token outline-none placeholder:text-secondary-token"
                />
                <div className="flex w-full items-end justify-end">
                  <button
                    type="button"
                    onClick={handleOpenRecording}
                    className="flex items-center justify-center rounded-[999px] bg-primary p-[6px] text-invert-token"
                    aria-label="Record biography"
                  >
                    <AppIcon name="Audio" size={16} />
                  </button>
                </div>
              </div>
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

      <AudioRecordingModal
        isOpen={isRecording}
        onClose={() => setIsRecording(false)}
        onSave={handleAudioSave}
        onLiveTranscript={handleLiveTranscript}
      />
    </>
  );
}
