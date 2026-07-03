/**
 * Browser-local store for entity visit counts. Everything here is per-user and
 * per-browser (backed by `window.localStorage`) — no backend is required, which
 * keeps the plugin self-contained and privacy-friendly.
 */

export type EntityVisitEntry = {
  /** Stringified entity ref, e.g. `component:default/my-service`. */
  ref: string;
  /** Total number of recorded visits. */
  count: number;
  /** ISO timestamp of the most recent visit. */
  lastVisited: string;
};

const KEY = 'entity-visits:v1';

/** Cap the store so a long-lived browser cannot grow it without bound. */
const MAX_ENTRIES = 500;

function readRaw(): EntityVisitEntry[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.map((e: EntityVisitEntry) => ({ ...e }))
      : [];
  } catch {
    return [];
  }
}

function writeRaw(list: EntityVisitEntry[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // ignore quota / private-mode errors
  }
}

/** Returns a defensive copy of all recorded visits. */
export function readAll(): EntityVisitEntry[] {
  return readRaw().map(e => ({ ...e }));
}

/** Removes every recorded visit. Backs the "Visited entities" reset. */
export function clearAll(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

const normalize = (ref: string) => ref.toLocaleLowerCase('en-US');

/**
 * Records a single visit to `ref`, incrementing its count and bumping its
 * `lastVisited` timestamp. Refs are matched case-insensitively.
 */
export function recordVisit(ref: string): void {
  const now = new Date().toISOString();
  const current = readRaw();
  const refKey = normalize(ref);

  let found = false;
  const updated: EntityVisitEntry[] = current.map(e => {
    if (normalize(e.ref) === refKey) {
      found = true;
      return { ...e, count: (e.count ?? 0) + 1, lastVisited: now };
    }
    return e;
  });

  if (!found) {
    updated.push({ ref, count: 1, lastVisited: now });
  }

  writeRaw(updated.slice(-MAX_ENTRIES));
}
