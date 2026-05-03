export type RepeatGroupRsvp = "in" | "out";

const STORAGE_KEY = "node-repeat-group-rsvp";

export const REPEAT_GROUP_RSVP_EVENT = "node-repeat-group-rsvp";

function canUseStorage() {
  return typeof window !== "undefined" && "localStorage" in window;
}

function parseMap(raw: string | null): Record<string, RepeatGroupRsvp> {
  if (!raw) return {};
  try {
    const obj = JSON.parse(raw) as Record<string, unknown>;
    const out: Record<string, RepeatGroupRsvp> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v === "in" || v === "out") out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

export function loadRepeatGroupRsvpMap(): Record<string, RepeatGroupRsvp> {
  if (!canUseStorage()) return {};
  return parseMap(window.localStorage.getItem(STORAGE_KEY));
}

export function getRepeatGroupRsvp(groupId: string): RepeatGroupRsvp | null {
  const id = groupId.trim();
  if (!id) return null;
  const v = loadRepeatGroupRsvpMap()[id];
  return v === "in" || v === "out" ? v : null;
}

export function setRepeatGroupRsvp(groupId: string, value: RepeatGroupRsvp) {
  if (!canUseStorage()) return;
  const id = groupId.trim();
  if (!id) return;
  const map = parseMap(window.localStorage.getItem(STORAGE_KEY));
  map[id] = value;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  window.dispatchEvent(new Event(REPEAT_GROUP_RSVP_EVENT));
}

export function clearRepeatGroupRsvp(groupId: string) {
  if (!canUseStorage()) return;
  const id = groupId.trim();
  if (!id) return;
  const map = parseMap(window.localStorage.getItem(STORAGE_KEY));
  delete map[id];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  window.dispatchEvent(new Event(REPEAT_GROUP_RSVP_EVENT));
}
