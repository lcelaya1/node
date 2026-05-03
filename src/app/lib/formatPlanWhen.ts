/** Parse local calendar date `YYYY-MM-DD` (avoid UTC drift from `new Date(iso)`). */
function parseIsoDateLocal(iso: string): Date | null {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (
    !Number.isFinite(y) ||
    mo < 1 ||
    mo > 12 ||
    d < 1 ||
    d > 31
  )
    return null;
  const dt = new Date(y, mo - 1, d);
  if (
    dt.getFullYear() !== y ||
    dt.getMonth() !== mo - 1 ||
    dt.getDate() !== d
  )
    return null;
  return dt;
}

function formatDayMonthShort(d: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
  }).format(d);
}

/** Turns `YYYY-MM-DD` into e.g. `09 May`; passthrough if not a plain ISO date. */
export function formatIsoDateOnlyForDisplay(iso: string): string {
  const t = iso.trim();
  const d = parseIsoDateLocal(t);
  return d ? formatDayMonthShort(d) : t;
}

/** Replaces a leading ISO date in a “when” line (`2026-05-09 · 20:08` → `09 May · 20:08`). */
export function formatWhenLineForDisplay(when: string): string {
  const t = when.trim();
  return t.replace(/^(\d{4}-\d{2}-\d{2})/, (iso) => {
    const d = parseIsoDateLocal(iso);
    return d ? formatDayMonthShort(d) : iso;
  });
}
