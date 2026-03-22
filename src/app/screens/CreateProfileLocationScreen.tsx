import { useState } from "react";
import { CreateAccountBackButton } from "../components/CreateAccountBackButton";
import { supabase } from "../lib/supabase";

type CreateProfileLocationScreenProps = {
  onBack?: () => void;
  onContinue?: () => void;
};

export default function CreateProfileLocationScreen({
  onBack,
  onContinue,
}: CreateProfileLocationScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleContinue = async () => {
    if (isLoading) return;

    if (!window.isSecureContext) {
      setErrorMessage("Location access requires HTTPS or localhost.");
      return;
    }

    if (!navigator.geolocation) {
      setErrorMessage("Location is not supported in this browser.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          if (supabase) {
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
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              },
              {
                onConflict: "id",
              },
            );

            if (error) throw error;
          }

          onContinue?.();
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : typeof error === "object" &&
                  error !== null &&
                  "message" in error &&
                  typeof error.message === "string"
                ? error.message
                : "Something went wrong. Try again.";

          setErrorMessage(message);
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setIsLoading(false);

        if (error.code === error.PERMISSION_DENIED) {
          setErrorMessage("Please allow location access to continue.");
          return;
        }

        if (error.code === error.POSITION_UNAVAILABLE) {
          setErrorMessage("We couldn’t get your location right now.");
          return;
        }

        if (error.code === error.TIMEOUT) {
          setErrorMessage("Location request timed out. Try again.");
          return;
        }

        setErrorMessage("Something went wrong. Try again.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  return (
    <div className="flex size-full flex-col justify-between bg-surface-primary px-[20px] pb-[32px] pt-[16px]">
      <div className="flex w-full">
        <CreateAccountBackButton onClick={onBack} />
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center">
        <button
          type="button"
          onClick={handleContinue}
          disabled={isLoading}
          className="flex w-full max-w-[345px] flex-col items-start gap-[16px] text-left disabled:opacity-100"
        >
          <div className="flex size-[56px] items-center justify-center rounded-full bg-button-secondary text-invert-token">
            <svg
              width="31"
              height="31"
              viewBox="0 0 31 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.1364 13.0909C21.1364 17.5452 15.4091 23.9091 15.4091 23.9091C15.4091 23.9091 9.68182 17.5452 9.68182 13.0909C9.68182 9.92785 12.246 7.36363 15.4091 7.36363C18.5721 7.36363 21.1364 9.92785 21.1364 13.0909Z"
                stroke="currentColor"
                strokeWidth="1.27273"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.4091 15C16.4634 15 17.3182 14.1452 17.3182 13.0909C17.3182 12.0365 16.4634 11.1818 15.4091 11.1818C14.3548 11.1818 13.5 12.0365 13.5 13.0909C13.5 14.1452 14.3548 15 15.4091 15Z"
                stroke="currentColor"
                strokeWidth="1.27273"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="flex w-full flex-col gap-[8px]">
            <p className="type-heading-xl text-primary-token">Share your location</p>
            <p className="type-body-m text-secondary-token">
              We use this to show you plans in your area. We never share your exact
              location.
            </p>
          </div>
        </button>
      </div>

      <div className="flex w-full flex-col gap-[20px]">
        {errorMessage ? (
          <p className="w-full text-left type-body-xs text-brand-token">{errorMessage}</p>
        ) : null}

        <button
          type="button"
          onClick={handleContinue}
          disabled={isLoading}
          className="flex w-full items-center justify-center rounded-[999px] bg-primary px-[32px] py-[12px] disabled:bg-surface-fill"
        >
          <span className="type-body-m text-invert-token">
            {isLoading ? "Loading..." : "Continue"}
          </span>
        </button>
      </div>
    </div>
  );
}
