import { useEffect, useState } from "react";
import { RouterProvider } from "react-router";
import AuthScreen from "./screens/AuthScreen";
import CreateProfileBirthdayScreen from "./screens/CreateProfileBirthdayScreen";
import CreateProfileDescriptionScreen from "./screens/CreateProfileDescriptionScreen";
import CreateProfileInterestsScreen from "./screens/CreateProfileInterestsScreen";
import CreateProfileNameScreen from "./screens/CreateProfileNameScreen";
import CreateProfileLocationScreen from "./screens/CreateProfileLocationScreen";
import CreateProfilePictureScreen from "./screens/CreateProfilePictureScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import SplashScreen, { SPLASH_DURATION_MS } from "./screens/SplashScreen";
import { supabase } from "./lib/supabase";
import { router } from "./routes";
import type { Session } from "@supabase/supabase-js";

export default function App() {
  const [phase, setPhase] = useState<
    "splash" | "onboarding" | "auth" | "create-profile" | "create-profile-birthday" | "create-profile-description" | "create-profile-interests" | "create-profile-picture" | "create-profile-location" | "app"
  >("splash");
  const [profileDraftName, setProfileDraftName] = useState("");
  const [profileDraftBirthDate, setProfileDraftBirthDate] = useState("");
  const [profileDraftBio, setProfileDraftBio] = useState("");
  const [profileDraftInterests, setProfileDraftInterests] = useState<string[]>([]);
  const [profileDraftAvatarUrl, setProfileDraftAvatarUrl] = useState("");

  const resolveSignedInPhase = async (session: Session) => {
    if (!supabase) {
      setPhase("app");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle();

    if (error) {
      setPhase("create-profile");
      return;
    }

    const fullName = data?.full_name?.trim() ?? "";
    const birthDate = typeof data?.birth_date === "string" ? data.birth_date : "";
    const bio = data?.bio?.trim() ?? "";
    const interests = Array.isArray(data?.interests) ? data.interests : [];
    const avatarUrl = data?.avatar_url?.trim() ?? "";
    const hasLocation =
      typeof data?.latitude === "number" && typeof data?.longitude === "number";
    const authProviderName =
      typeof session.user.user_metadata?.full_name === "string"
        ? session.user.user_metadata.full_name.trim()
        : typeof session.user.user_metadata?.name === "string"
          ? session.user.user_metadata.name.trim()
          : "";

    const isProfileComplete =
      Boolean(fullName) &&
      Boolean(birthDate) &&
      Boolean(bio) &&
      interests.length >= 4 &&
      Boolean(avatarUrl) &&
      hasLocation;

    setProfileDraftName(
      !isProfileComplete && fullName && authProviderName && fullName === authProviderName
        ? ""
        : fullName,
    );
    setProfileDraftBirthDate(birthDate);
    setProfileDraftBio(bio);
    setProfileDraftInterests(interests);
    setProfileDraftAvatarUrl(avatarUrl);

    setPhase(isProfileComplete ? "app" : "create-profile");
  };

  useEffect(() => {
    let timeoutId: number | undefined;
    let isMounted = true;

    if (supabase) {
      supabase.auth.getSession().then(async ({ data }) => {
        if (!isMounted) return;

        if (data.session) {
          await resolveSignedInPhase(data.session);
          return;
        }

        timeoutId = window.setTimeout(() => {
          setPhase("onboarding");
        }, SPLASH_DURATION_MS);
      });
    } else {
      timeoutId = window.setTimeout(() => {
        setPhase("onboarding");
      }, SPLASH_DURATION_MS);
    }

    return () => {
      isMounted = false;
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!supabase) return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        void resolveSignedInPhase(session);
        return;
      }

      if (event === "INITIAL_SESSION") {
        return;
      }

      setProfileDraftName("");
      setProfileDraftBirthDate("");
      setProfileDraftBio("");
      setProfileDraftInterests([]);
      setProfileDraftAvatarUrl("");

      setPhase((currentPhase) =>
        currentPhase === "splash" ? currentPhase : "auth",
      );
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="app-shell">
      <div className="app-device">
        <div className="app-content">
          {phase === "splash" ? <SplashScreen /> : null}
          {phase === "onboarding" ? <OnboardingScreen onNext={() => {
            window.localStorage.setItem("node-onboarding-complete", "true");
            setPhase("auth");
          }} /> : null}
          {phase === "auth" ? (
            <AuthScreen
              onContinue={() => {
                if (!supabase) {
                  setPhase("app");
                  return;
                }

                void supabase.auth.getSession().then(({ data }) => {
                  if (data.session) {
                    void resolveSignedInPhase(data.session);
                  }
                });
              }}
            />
          ) : null}
          {phase === "create-profile" ? (
            <CreateProfileNameScreen
              value={profileDraftName}
              onChange={setProfileDraftName}
              onContinue={() => setPhase("create-profile-birthday")}
            />
          ) : null}
          {phase === "create-profile-birthday" ? (
            <CreateProfileBirthdayScreen
              name={profileDraftName}
              value={profileDraftBirthDate}
              onChange={setProfileDraftBirthDate}
              onBack={() => setPhase("create-profile")}
              onContinue={() => setPhase("create-profile-description")}
            />
          ) : null}
          {phase === "create-profile-description" ? (
            <CreateProfileDescriptionScreen
              value={profileDraftBio}
              onChange={setProfileDraftBio}
              onBack={() => setPhase("create-profile-birthday")}
              onContinue={() => setPhase("create-profile-interests")}
            />
          ) : null}
          {phase === "create-profile-interests" ? (
            <CreateProfileInterestsScreen
              value={profileDraftInterests}
              onChange={setProfileDraftInterests}
              onBack={() => setPhase("create-profile-description")}
              onContinue={() => setPhase("create-profile-picture")}
            />
          ) : null}
          {phase === "create-profile-picture" ? (
            <CreateProfilePictureScreen
              value={profileDraftAvatarUrl}
              onChange={setProfileDraftAvatarUrl}
              onBack={() => setPhase("create-profile-interests")}
              onContinue={() => setPhase("create-profile-location")}
            />
          ) : null}
          {phase === "create-profile-location" ? (
            <CreateProfileLocationScreen
              onBack={() => setPhase("create-profile-picture")}
              onContinue={() => setPhase("app")}
            />
          ) : null}
          {phase === "app" ? <RouterProvider router={router} /> : null}
        </div>
      </div>
    </div>
  );
}
