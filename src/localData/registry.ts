import { useSyncExternalStore } from 'react';

/**
 * A single row in the shared "Local data" settings tab. Every plugin that
 * stores per-browser data contributes one entry describing what it stores and
 * how to clear it.
 */
export type LocalDataResetEntry = {
  /**
   * Stable identifier, unique across all contributing plugins. Used for
   * de-duplication and as the React key. e.g. `visited-entities`.
   */
  id: string;
  /** Short human-readable name, e.g. "Visited entities". */
  title: string;
  /** One-line explanation of what clearing this removes. */
  description: string;
  /** Runs when the user clicks the reset button. */
  action: () => void | Promise<void>;
  /** Toast shown after a successful reset. Defaults to `${title} cleared.`. */
  successMessage?: string;
  /** Button label. Defaults to "Clear". */
  buttonLabel?: string;
  /**
   * Ordering hint (ascending). Entries without a weight sort after those with
   * one, then alphabetically by title. Defaults to `undefined`.
   */
  order?: number;
};

/**
 * Module-scoped registry shared across plugins. This is intentionally a plain
 * singleton rather than an extension input so it behaves identically under the
 * legacy app and the New Frontend System, and so future plugins (homepage
 * layout, feeds, …) can contribute without depending on any particular host
 * wiring — they only need to import {@link registerLocalDataReset}.
 */
const entries = new Map<string, LocalDataResetEntry>();
const listeners = new Set<() => void>();

let snapshot: LocalDataResetEntry[] = [];

function recompute() {
  snapshot = [...entries.values()].sort((a, b) => {
    const aw = a.order ?? Number.POSITIVE_INFINITY;
    const bw = b.order ?? Number.POSITIVE_INFINITY;
    return aw - bw || a.title.localeCompare(b.title);
  });
  listeners.forEach(l => l());
}

/**
 * Registers (or replaces, by `id`) a reset entry in the shared "Local data"
 * settings tab. Safe to call at module-evaluation time. Returns an unregister
 * function.
 */
export function registerLocalDataReset(entry: LocalDataResetEntry): () => void {
  entries.set(entry.id, entry);
  recompute();
  return () => {
    if (entries.get(entry.id) === entry) {
      entries.delete(entry.id);
      recompute();
    }
  };
}

/** Current registered entries, sorted for display. */
export function getLocalDataResets(): LocalDataResetEntry[] {
  return snapshot;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** React hook returning the live, sorted list of registered reset entries. */
export function useLocalDataResets(): LocalDataResetEntry[] {
  return useSyncExternalStore(subscribe, getLocalDataResets, getLocalDataResets);
}
