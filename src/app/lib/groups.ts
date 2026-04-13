import type { DemoUser } from "./demoUsers";
import { supabase } from "./supabase";

export type SavedGroup = {
  createdAt: string;
  id: string;
  participants: DemoUser[];
  title: string;
};

const STORAGE_KEY = "node-repeat-groups";

function canUseStorage() {
  return typeof window !== "undefined" && "localStorage" in window;
}

async function getCurrentUserId() {
  if (!supabase) return null;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user.id;
}

export async function loadSavedGroups(): Promise<SavedGroup[]> {
  const userId = await getCurrentUserId();
  const groupsById = new Map<string, SavedGroup>();

  if (supabase && userId) {
    const { data, error } = await supabase
      .from("repeat_groups")
      .select(`
        id,
        title,
        created_at,
        repeat_group_members(
          participant_seed_user_id,
          participant_name,
          participant_avatar_url,
          participant_age,
          sort_order
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      data.forEach((group) => {
        groupsById.set(group.id, {
          createdAt: group.created_at,
          id: group.id,
          participants: [...(group.repeat_group_members ?? [])]
            .sort((left, right) => (left.sort_order ?? 0) - (right.sort_order ?? 0))
            .map((member) => ({
              age: member.participant_age ?? 0,
              avatarUrl: member.participant_avatar_url ?? "",
              bio: "",
              city: "",
              interests: [],
              name: member.participant_name,
              plansCreated: 0,
              plansDone: 0,
              seedUserId: member.participant_seed_user_id ?? 0,
            })),
          title: group.title,
        });
      });
    }
  }

  if (canUseStorage()) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SavedGroup[];
        if (Array.isArray(parsed)) {
          parsed.forEach((group) => {
            if (!groupsById.has(group.id)) {
              groupsById.set(group.id, group);
            }
          });
        }
      }
    } catch {
      // Ignore malformed local cache and continue with any groups already loaded.
    }
  }

  return [...groupsById.values()].sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt),
  );
}

export async function saveGroup(group: SavedGroup): Promise<SavedGroup[]> {
  const groups = await loadSavedGroups();
  const nextGroups = [group, ...groups.filter((item) => item.id !== group.id)];

  const userId = await getCurrentUserId();

  if (supabase && userId) {
    await supabase.from("repeat_groups").upsert({
      created_at: group.createdAt,
      id: group.id,
      title: group.title,
      user_id: userId,
    });

    await supabase.from("repeat_group_members").delete().eq("group_id", group.id);

    if (group.participants.length > 0) {
      await supabase.from("repeat_group_members").insert(
        group.participants.map((participant, index) => ({
          group_id: group.id,
          participant_age: participant.age ?? null,
          participant_avatar_url: participant.avatarUrl ?? null,
          participant_name: participant.name,
          participant_seed_user_id: participant.seedUserId ?? null,
          sort_order: index,
        })),
      );
    }
  }

  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextGroups));
  }

  return nextGroups;
}

export async function deleteGroup(groupId: string): Promise<SavedGroup[]> {
  const groups = await loadSavedGroups();
  const nextGroups = groups.filter((group) => group.id !== groupId);

  const userId = await getCurrentUserId();

  if (supabase && userId) {
    await supabase
      .from("repeat_groups")
      .delete()
      .eq("id", groupId)
      .eq("user_id", userId);
  }

  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextGroups));
  }

  return nextGroups;
}
