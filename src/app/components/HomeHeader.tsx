import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabase";

const avatarImage = "https://www.figma.com/api/mcp/asset/920565ce-048b-463b-b67c-d2fb3054dbdb";

function getTodayLabel() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

type HomeHeaderProps = {
  title?: string;
  topPaddingClassName?: string;
};

export function HomeHeader({
  title = "Hello, Cristina!",
  topPaddingClassName = "pt-[32px]",
}: HomeHeaderProps) {
  const navigate = useNavigate();
  const todayLabel = getTodayLabel();
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (!supabase) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (error || !data || !isMounted) return;

      if (typeof data.full_name === "string") {
        setFullName(data.full_name.trim());
      }

      if (typeof data.avatar_url === "string") {
        setAvatarUrl(data.avatar_url.trim());
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const resolvedTitle = useMemo(() => {
    const fallbackName = title.replace(/^Hello,\s*/i, "").replace(/!$/, "").trim();
    const name = fullName || fallbackName;
    return `Hello, ${name}!`;
  }, [fullName, title]);

  return (
    <div className={`flex items-start justify-between ${topPaddingClassName}`}>
      <div className="flex flex-col items-start gap-[4px]">
        <p className="type-body-xs text-secondary-token">{todayLabel}</p>
        <h1 className="type-heading-2xl text-primary-token">{resolvedTitle}</h1>
      </div>

      <button
        type="button"
        aria-label="Open profile"
        className="size-[40px] overflow-hidden rounded-full bg-surface-secondary"
        onClick={() => navigate("/profile")}
      >
        <img
          alt={fullName || "Profile"}
          className="size-full object-cover"
          src={avatarUrl || avatarImage}
        />
      </button>
    </div>
  );
}
