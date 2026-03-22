import { useMemo, useState } from "react";
import logoNode from "../../assets/svg/Logo Node.svg";
import { AppIcon } from "../components/AppIcon";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const googleIcon = new URL("../../assets/Google.png", import.meta.url).href;

type AuthScreenProps = {
  onContinue?: () => void;
};

type AuthMode = "signup" | "login";

type AuthInputProps = {
  label: string;
  placeholder?: string;
  password?: boolean;
  value: string;
  onChange: (value: string) => void;
};

function AuthInput({
  label,
  placeholder,
  password = false,
  value,
  onChange,
}: AuthInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className="flex w-full flex-col gap-[8px]">
      <p className="type-body-m-medium text-primary-token">
        {label}
      </p>
      <div className="flex w-full items-center rounded-[12px] bg-[#f3f3f3] p-[12px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
        {password ? (
          <>
            <input
              type={isPasswordVisible ? "text" : "password"}
              value={value}
              onChange={(event) => onChange(event.target.value)}
              className="type-body-m min-w-0 flex-1 bg-transparent text-primary-token outline-none placeholder:text-secondary-token"
              placeholder={placeholder}
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible((current) => !current)}
              className="flex shrink-0 items-center justify-center text-primary-token"
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            >
              <AppIcon name={isPasswordVisible ? "Eye" : "Password"} size={20} />
            </button>
          </>
        ) : (
          <input
            type="email"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="type-body-m min-w-0 flex-1 bg-transparent text-primary-token outline-none placeholder:text-secondary-token"
            placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );
}

function AuthToggleButton({
  active,
  label,
  onClick,
}: {
  active?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-0 min-w-0 flex-1 rounded-[50px] px-[16px] py-[8px] ${
        active ? "bg-button-primary text-invert-token" : "bg-surface-primary text-primary-token"
      }`}
      style={{
        border: active ? "0.5px solid var(--color-border-selected)" : "0.5px solid var(--color-border-selected)",
      }}
    >
      <span className="type-body-m whitespace-nowrap">{label}</span>
    </button>
  );
}

export default function AuthScreen({ onContinue }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isSignup = mode === "signup";
  const canSubmit = useMemo(() => {
    if (!email.trim() || !password.trim()) return false;
    if (!isSignup) return true;
    return Boolean(repeatPassword.trim());
  }, [email, password, repeatPassword, isSignup]);

  const handleEmailAuth = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setErrorMessage("Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local first.");
      return;
    }

    if (!canSubmit) {
      setErrorMessage("Complete all the fields first.");
      return;
    }

    if (isSignup && password !== repeatPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (!data.session) {
          setErrorMessage("Check your email to confirm your account, then log in.");
        } else {
          onContinue?.();
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        onContinue?.();
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setErrorMessage("Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local first.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      setIsLoading(false);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="flex size-full flex-col gap-[80px] bg-surface-primary pb-[32px]">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col px-[24px] pt-[60px]">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-[40px]">
          <div className="flex w-full flex-col gap-[32px]">
            <div className="flex items-start gap-[8px]">
              <p className="type-heading-2xl text-primary-token">{`Welcome to `}</p>
              <img alt="Node" className="h-[33.12px] w-[92px]" src={logoNode} />
            </div>

            <div className="flex w-full items-start justify-center gap-[12px]">
              <AuthToggleButton
                active={isSignup}
                label="Sign Up"
                onClick={() => {
                  setMode("signup");
                  setErrorMessage("");
                }}
              />
              <AuthToggleButton
                active={!isSignup}
                label="Log In"
                onClick={() => {
                  setMode("login");
                  setErrorMessage("");
                }}
              />
            </div>
          </div>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-between">
            <div className="flex flex-col gap-[24px]">
              <AuthInput
                label="Email"
                onChange={setEmail}
                placeholder="you@example.com"
                value={email}
              />
              <AuthInput
                label="Password"
                onChange={setPassword}
                password
                value={password}
              />
              {isSignup ? (
                <AuthInput
                  label="Repeat password"
                  onChange={setRepeatPassword}
                  password
                  value={repeatPassword}
                />
              ) : null}
            </div>

            <div className="flex w-full flex-col items-center gap-[20px]">
              {errorMessage ? (
                <p className="w-full text-left type-body-xs text-brand-token">{errorMessage}</p>
              ) : null}

              <button
                type="button"
                onClick={handleEmailAuth}
                disabled={isLoading || !canSubmit}
                className="flex w-full items-center justify-center rounded-[999px] bg-button-secondary px-[32px] py-[12px] disabled:bg-surface-fill"
              >
                <span className="type-body-m text-invert-token">
                  {isLoading ? "Loading..." : isSignup ? "Sign Up" : "Log In"}
                </span>
              </button>

              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-[4px] rounded-[999px] border border-selected-token bg-surface-primary px-[32px] py-[12px] disabled:opacity-60"
              >
                <img alt="" aria-hidden="true" className="h-[21px] w-[21px] object-contain" src={googleIcon} />
                <span className="type-body-m text-primary-token">
                  {isSignup ? "Sign Up with Google" : "Log In with Google"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
