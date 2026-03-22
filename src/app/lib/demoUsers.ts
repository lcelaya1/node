import { supabase } from "./supabase";

export type DemoUser = {
  age: number;
  avatarUrl: string;
  bio: string;
  city: string;
  interests: string[];
  name: string;
  plansCreated: number;
  plansDone: number;
  seedUserId: number;
};

function normalizeDemoUser(row: Record<string, unknown>): DemoUser | null {
  if (typeof row.name !== "string") return null;

  return {
    age: typeof row.age === "number" ? row.age : Number(row.age ?? 0),
    avatarUrl: typeof row.avatar_url === "string" ? row.avatar_url : "",
    bio: typeof row.bio === "string" ? row.bio : "",
    city: typeof row.city === "string" ? row.city : "",
    interests: Array.isArray(row.demo_user_interests)
      ? row.demo_user_interests
          .map((item) => {
            if (
              item &&
              typeof item === "object" &&
              "interest_catalog" in item &&
              item.interest_catalog &&
              typeof item.interest_catalog === "object" &&
              "name" in item.interest_catalog
            ) {
              return typeof item.interest_catalog.name === "string"
                ? item.interest_catalog.name
                : null;
            }

            return null;
          })
          .filter((item): item is string => Boolean(item))
      : [],
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
      "seed_user_id, name, age, city, bio, plans_created, plans_done, avatar_url, demo_user_interests(interest_catalog(name))",
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
