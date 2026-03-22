import { supabase } from "./supabase";

export type JoinFilterState = {
  battery: "low" | "mid" | "full";
  budget: "free" | "€" | "€€" | "€€€";
  date: "today" | "tomorrow" | "weekend";
  distance: "close" | "ride" | "anywhere";
};

export type CatalogPlan = {
  address: string;
  budget?: string;
  description: string;
  eventDate: string;
  id: string;
  imageSrc: string;
  interestMatches?: number;
  location: string;
  matchScore?: number;
  placeName: string;
  seedPlanId?: number;
  startTime: string;
  title: string;
  when: string;
};

type MatchPlanCatalogRow = {
  address: string | null;
  budget?: string | null;
  description: string | null;
  distance?: string | null;
  event_date: string | null;
  id: string;
  match_score?: number | null;
  photo_url: string | null;
  place_name: string | null;
  seed_plan_id?: number | null;
  social_battery?: string | null;
  start_time: string | null;
  timing?: string | null;
  title: string | null;
};

const DISTANCE_MAP: Record<JoinFilterState["distance"], "close-by" | "short-ride" | "further-out"> = {
  anywhere: "further-out",
  close: "close-by",
  ride: "short-ride",
};

function formatCatalogDate(eventDate?: string | null, startTime?: string | null) {
  if (!eventDate) return "May 12 · 6pm";

  const parsed = new Date(`${eventDate}T12:00:00`);
  const dateLabel = Number.isNaN(parsed.getTime())
    ? eventDate
    : parsed.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  if (!startTime) return dateLabel;

  const [hoursString = "0", minutesString = "0"] = startTime.split(":");
  const hours = Number(hoursString);
  const minutes = Number(minutesString);
  const normalizedHours = Number.isNaN(hours) ? 0 : hours;
  const normalizedMinutes = Number.isNaN(minutes) ? 0 : minutes;
  const suffix = normalizedHours >= 12 ? "pm" : "am";
  const twelveHour = normalizedHours % 12 || 12;
  const minuteLabel = normalizedMinutes === 0 ? "" : `:${String(normalizedMinutes).padStart(2, "0")}`;

  return `${dateLabel} · ${twelveHour}${minuteLabel}${suffix}`;
}

function mapCatalogRow(row: MatchPlanCatalogRow): CatalogPlan {
  return {
    address: row.address ?? "",
    budget: row.budget ?? undefined,
    description: row.description ?? "",
    eventDate: row.event_date ?? "",
    id: row.id,
    imageSrc: row.photo_url ?? "",
    location: row.place_name ? `${row.place_name}${row.address ? ` · ${row.address}` : ""}` : row.address ?? "",
    matchScore: row.match_score ?? undefined,
    placeName: row.place_name ?? "",
    seedPlanId: row.seed_plan_id ?? undefined,
    startTime: row.start_time ?? "",
    title: row.title ?? "Untitled plan",
    when: formatCatalogDate(row.event_date, row.start_time),
  };
}

function normalizeValue(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getInterestKeywords(interest: string) {
  const normalized = normalizeValue(interest);
  const variants = new Set<string>([normalized]);

  if (normalized === "coffee") {
    variants.add("cafe");
    variants.add("café");
    variants.add("brunch");
    variants.add("latte");
  }

  if (normalized === "food") {
    variants.add("dinner");
    variants.add("brunch");
    variants.add("tapas");
    variants.add("market");
    variants.add("cooking");
  }

  if (normalized === "cocktails") {
    variants.add("drinks");
    variants.add("rooftop");
    variants.add("bar");
    variants.add("beer");
    variants.add("vermouth");
  }

  if (normalized === "music") {
    variants.add("vinyl");
    variants.add("karaoke");
    variants.add("bar");
  }

  if (normalized === "art") {
    variants.add("gallery");
    variants.add("museum");
    variants.add("picasso");
    variants.add("dali");
  }

  if (normalized === "films") {
    variants.add("cinema");
    variants.add("movie");
  }

  if (normalized === "nature" || normalized === "outdoors" || normalized === "hikes") {
    variants.add("park");
    variants.add("picnic");
    variants.add("walk");
    variants.add("river");
    variants.add("toledo");
  }

  if (normalized === "sports") {
    variants.add("run");
    variants.add("jog");
    variants.add("skate");
    variants.add("skateboard");
  }

  if (normalized === "travel") {
    variants.add("trip");
    variants.add("toledo");
    variants.add("day out");
  }

  if (normalized === "spa" || normalized === "self-care" || normalized === "mindfulness") {
    variants.add("chill");
    variants.add("decompress");
    variants.add("quiet");
  }

  return Array.from(variants);
}

function countInterestMatches(plan: CatalogPlan, interests: string[]) {
  if (interests.length === 0) return 0;

  const haystack = normalizeValue(
    [plan.title, plan.description, plan.placeName, plan.address, plan.location].join(" "),
  );

  return interests.reduce((count, interest) => {
    const keywords = getInterestKeywords(interest);
    return keywords.some((keyword) => haystack.includes(keyword)) ? count + 1 : count;
  }, 0);
}

async function loadCurrentUserInterests() {
  if (!supabase) return [];

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return [];

  const { data, error } = await supabase
    .from("profiles")
    .select("interests")
    .eq("id", user.id)
    .maybeSingle();

  if (error) return [];

  return Array.isArray(data?.interests) ? data.interests.filter((item): item is string => typeof item === "string") : [];
}

export async function loadMatchedCatalogPlans(filters: JoinFilterState): Promise<CatalogPlan[]> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const userInterests = await loadCurrentUserInterests();

  const { data, error } = await supabase.rpc("match_plan_catalog", {
    p_budget: filters.budget,
    p_distance: DISTANCE_MAP[filters.distance],
    p_limit: 18,
    p_social_battery: filters.battery,
    p_timing: filters.date,
  });

  if (error) {
    throw error;
  }

  return ((data as MatchPlanCatalogRow[] | null) ?? [])
    .map(mapCatalogRow)
    .map((plan) => {
      const interestMatches = countInterestMatches(plan, userInterests);
      return {
        ...plan,
        interestMatches,
        matchScore: (plan.matchScore ?? 0) + interestMatches * 5,
      };
    })
    .sort((left, right) => {
      const scoreDifference = (right.matchScore ?? 0) - (left.matchScore ?? 0);
      if (scoreDifference !== 0) return scoreDifference;

      const interestDifference = (right.interestMatches ?? 0) - (left.interestMatches ?? 0);
      if (interestDifference !== 0) return interestDifference;

      const dateDifference = left.eventDate.localeCompare(right.eventDate);
      if (dateDifference !== 0) return dateDifference;

      return left.startTime.localeCompare(right.startTime);
    })
    .slice(0, 3);
}

export async function loadCatalogPlanById(planId: string | number): Promise<CatalogPlan | null> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("plan_catalog")
    .select("id, title, description, event_date, start_time, place_name, address, photo_url, seed_plan_id, budget")
    .eq("id", String(planId))
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) return null;

  return mapCatalogRow(data as MatchPlanCatalogRow);
}
