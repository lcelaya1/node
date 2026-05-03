import type { DemoUser } from "./demoUsers";

/** Quita query (tokens firmados etc.) antes de comparar URLs de avatar. */
export function stripAvatarUrlQuery(url: string): string {
  const t = url.trim();
  const q = t.indexOf("?");
  return q >= 0 ? t.slice(0, q) : t;
}

export function urlsLikelySameAvatar(aRaw: string, bRaw: string): boolean {
  const a = stripAvatarUrlQuery(aRaw).trim().toLowerCase();
  const b = stripAvatarUrlQuery(bRaw).trim().toLowerCase();
  if (!a || !b) return false;
  if (a === b) return true;
  try {
    const ua = new URL(a);
    const ub = new URL(b);
    return ua.origin === ub.origin && ua.pathname === ub.pathname;
  } catch {
    const lastA = a.split("/").pop() ?? "";
    const lastB = b.split("/").pop() ?? "";
    return lastA.length > 4 && lastA === lastB;
  }
}

/**
 * Usuario actual del RSVP en este círculo.
 * Si `navigator.state` lleva `viewerSeedUserId` (pasado desde Groups), evita race con la carga del perfil.
 */
export function resolveRsvpViewerInCircle(
  participants: DemoUser[],
  planCreator: DemoUser | null | undefined,
  profileAvatarUrl: string | null,
  profileFullName: string | null,
  explicitViewerSeed?: number | null,
): DemoUser | null {
  if (participants.length === 0) return null;

  if (explicitViewerSeed != null && Number.isFinite(explicitViewerSeed)) {
    const bySeed = participants.find((p) => p.seedUserId === explicitViewerSeed);
    if (bySeed) return bySeed;
  }

  const av = stripAvatarUrlQuery(profileAvatarUrl ?? "");
  if (av) {
    const byAvatar = participants.find((p) =>
      urlsLikelySameAvatar(p.avatarUrl ?? "", profileAvatarUrl ?? ""),
    );
    if (byAvatar) return byAvatar;
  }

  const fullName = profileFullName?.trim() ?? "";
  if (fullName) {
    const lowerFull = fullName.toLowerCase();
    const exact = participants.find((p) => p.name.trim().toLowerCase() === lowerFull);
    if (exact) return exact;
    const firstToken = lowerFull.split(/\s+/)[0] ?? "";
    if (firstToken) {
      const matches = participants.filter((p) => {
        const pn = p.name.trim().toLowerCase();
        return pn === firstToken || pn.startsWith(`${firstToken} `);
      });
      if (matches.length === 1) return matches[0]!;
    }
  }

  const cid = planCreator?.seedUserId;
  if (cid != null && cid !== 0) {
    const inCircle = participants.find((p) => p.seedUserId === cid);
    if (inCircle) return inCircle;
  }

  return participants[0] ?? null;
}
