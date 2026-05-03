import { supabase } from "./supabase";

export type DemoUser = {
  age: number;
  avatarUrl: string;
  bio: string;
  city: string;
  friendsCount: number;
  interests: string[];
  name: string;
  plansCreated: number;
  plansDone: number;
  seedUserId: number;
};

const DEMO_USER_VIBES: Record<number, string[]> = {
  1: ["Adventure seeker", "Always up for plans", "Chill vibes"],    // Sofia
  2: ["Super reliable", "Great energy", "Never cancels"],            // Marcos
  3: ["Good listener", "Spontaneous", "Makes everyone laugh"],       // Lucía
};

function normalizeDemoUser(row: Record<string, unknown>): DemoUser | null {
  if (typeof row.name !== "string") return null;

  const seedUserId =
    typeof row.seed_user_id === "number" ? row.seed_user_id : Number(row.seed_user_id ?? 0);

  return {
    age: typeof row.age === "number" ? row.age : Number(row.age ?? 0),
    avatarUrl: typeof row.avatar_url === "string" ? row.avatar_url : "",
    bio: typeof row.bio === "string" ? row.bio : "",
    city: typeof row.city === "string" ? row.city : "",
    friendsCount:
      typeof row.friends_count === "number"
        ? row.friends_count
        : Number(row.friends_count ?? 0),
    interests: DEMO_USER_VIBES[seedUserId] ?? [],
    name: row.name,
    plansCreated:
      typeof row.plans_created === "number"
        ? row.plans_created
        : Number(row.plans_created ?? 0),
    plansDone:
      typeof row.plans_done === "number"
        ? row.plans_done
        : Number(row.plans_done ?? 0),
    seedUserId:
      typeof row.seed_user_id === "number"
        ? row.seed_user_id
        : Number(row.seed_user_id ?? 0),
  };
}

export async function loadDemoUsers(): Promise<DemoUser[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("demo_users")
    .select(
      "seed_user_id, name, age, city, bio, friends_count, plans_created, plans_done, avatar_url, demo_user_interests(interest_catalog(name))",
    )
    .order("seed_user_id", { ascending: true });

  if (error || !data) return [];

  return data
    .map((row) => normalizeDemoUser(row as Record<string, unknown>))
    .filter((row): row is DemoUser => row !== null);
}

export function getPlanCreatorForIndex(users: DemoUser[], index: number) {
  if (users.length === 0) return null;
  return users[index % users.length] ?? null;
}

export function getChatParticipants(
  users: DemoUser[],
  creator: DemoUser | null,
): DemoUser[] {
  if (users.length === 0) return [];
  if (!creator) return users.slice(0, 3);

  const others = users.filter((user) => user.seedUserId !== creator.seedUserId);
  return [creator, ...others].slice(0, 3);
}
