import { supabase } from "./supabase";
import fallbackOutdoor from "../../imports/Onboarding1-2/d71adbbd75a6058eb54bbe101e0aa79bcdcdb1ac.png";
import fallbackMix from "../../imports/Onboarding1-2/b8f37e23b800ebfea321ded39d699db9bb424ab8.png";
import fallbackSkate from "../../imports/Onboarding1-2/658312597027029fbdfa0cb56d27fd3a6b129582.png";

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
  distance?: string;
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
  /** `close-by` | `short-ride` | `further-out` */
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

export const ONBOARDING_PLAN_IDS = [
  "68e9d3ca-5155-40c9-a475-7ca3afbecb83",
  "2c5b2095-64eb-435e-86d0-03b9013d9047",
  "2775d28d-520a-4865-bbbe-23d4f2588554",
  "03f7b2ef-aa1b-4b6a-8010-b1289d0e3372",
  "96c021c6-29c0-49cb-8292-4d308194600f",
];

export const ONBOARDING_PLAN_INTEREST_MAP: Record<string, string[]> = {
  "68e9d3ca-5155-40c9-a475-7ca3afbecb83": ["Sports", "Outdoors"],
  "2c5b2095-64eb-435e-86d0-03b9013d9047": ["Cooking", "Food"],
  "2775d28d-520a-4865-bbbe-23d4f2588554": ["Art"],
  "03f7b2ef-aa1b-4b6a-8010-b1289d0e3372": ["Cocktails"],
  "96c021c6-29c0-49cb-8292-4d308194600f": ["Coffee", "Literature"],
};

/** Infer liked onboarding cards from merged interest tags (e.g. `profileDraftInterests`) when revisiting this step. */
export function likedOnboardingPlanIdsFromInterests(tags: readonly string[]): Set<string> {
  const chosen = new Set(tags);
  const result = new Set<string>();
  for (const planId of ONBOARDING_PLAN_IDS) {
    const planTags = ONBOARDING_PLAN_INTEREST_MAP[planId] ?? [];
    if (planTags.length > 0 && planTags.every((t) => chosen.has(t))) {
      result.add(planId);
    }
  }
  return result;
}

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
    distance: row.distance ?? undefined,
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

/** Where line for proposal cards: place + rough distance from catalog bucket. */
export function proposalWhereLabel(placeName: string, distance?: string | null): string {
  const name = placeName.trim() || "Location";
  const km =
    distance === "short-ride" ? "3km" : distance === "further-out" ? "8km" : "1.2km";
  return `${name} (${km})`;
}

/** One random row from `plan_catalog` (for demos / chat). Requires Supabase session if RLS is auth-only. */
export async function loadRandomCatalogPlan(): Promise<CatalogPlan | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("plan_catalog")
    .select(
      "id, title, description, event_date, start_time, place_name, address, photo_url, seed_plan_id, budget, distance",
    )
    .limit(120);

  if (error || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  const row = data[Math.floor(Math.random() * data.length)] as MatchPlanCatalogRow;
  try {
    return mapCatalogRow(row);
  } catch {
    return null;
  }
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
    .filter((row) => !ONBOARDING_PLAN_IDS.includes(row.id))
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

/** Local demo stack when Supabase is off, the query fails, or `plan_catalog` has no rows (dev / preview). */
export function getFallbackOnboardingPlans(): CatalogPlan[] {
  const imgs = [fallbackSkate, fallbackMix, fallbackOutdoor] as const;
  type Stub = Omit<CatalogPlan, "id">;

  const stubs: Record<(typeof ONBOARDING_PLAN_IDS)[number], Stub> = {
    "68e9d3ca-5155-40c9-a475-7ca3afbecb83": {
      address: "Pl. dels Àngels, 1, Barcelona",
      description: "",
      eventDate: "2026-06-21",
      imageSrc: imgs[0],
      location: "MACBA Skate Plaza",
      placeName: "MACBA Skate Plaza",
      startTime: "17:00",
      title: "Skateboard session at the plaza",
      when: "21 Jun · 5pm",
    },
    "2c5b2095-64eb-435e-86d0-03b9013d9047": {
      address: "Carrer de Blai",
      description: "",
      eventDate: "2026-06-27",
      imageSrc: imgs[1],
      location: "Poble-sec",
      placeName: "Tapas crawl",
      startTime: "19:30",
      title: "Late tapas crawl",
      when: "27 Jun · 7:30pm",
    },
    "2775d28d-520a-4865-bbbe-23d4f2588554": {
      address: "Centre",
      description: "",
      eventDate: "2026-07-04",
      imageSrc: imgs[2],
      location: "Galeria Senda",
      placeName: "Galeria Senda",
      startTime: "19:30",
      title: "Art gallery opening",
      when: "4 Jul · 7:30pm",
    },
    "03f7b2ef-aa1b-4b6a-8010-b1289d0e3372": {
      address: "Eixample",
      description: "",
      eventDate: "2026-06-19",
      imageSrc: imgs[1],
      location: "Cocktail bar",
      placeName: "Vermuteria Rosa",
      startTime: "21:00",
      title: "Cocktails and vinyl",
      when: "19 Jun · 9pm",
    },
    "96c021c6-29c0-49cb-8292-4d308194600f": {
      address: "Gràcia",
      description: "",
      eventDate: "2026-06-15",
      imageSrc: imgs[0],
      location: "Café Cometa",
      placeName: "Café Cometa",
      startTime: "10:00",
      title: "Coffee & book at a quiet café",
      when: "15 Jun · 10am",
    },
  };

  return ONBOARDING_PLAN_IDS.map((id) => ({ id, ...stubs[id] }));
}

export async function loadOnboardingPlans(): Promise<CatalogPlan[]> {
  try {
    const fallbackList = getFallbackOnboardingPlans();
    const byFallbackId = new Map(fallbackList.map((plan) => [plan.id, plan]));

    if (!supabase) {
      return fallbackList;
    }

    const { data, error } = await supabase
      .from("plan_catalog")
      .select("id, title, description, event_date, start_time, place_name, address, photo_url, seed_plan_id, budget")
      .in("id", ONBOARDING_PLAN_IDS);

    const serverById = new Map<string, CatalogPlan>();
    if (!error && Array.isArray(data)) {
      for (const row of data as MatchPlanCatalogRow[]) {
        try {
          const plan = mapCatalogRow(row);
          serverById.set(plan.id, plan);
        } catch {
          /* skip malformed row */
        }
      }
    }

    /** Always expose all onboarding slots: server wins per id, else local stub */
    return ONBOARDING_PLAN_IDS.map((id) => serverById.get(id) ?? byFallbackId.get(id)!);
  } catch {
    try {
      return getFallbackOnboardingPlans();
    } catch {
      return [];
    }
  }
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
