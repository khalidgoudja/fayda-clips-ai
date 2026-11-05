import { useCallback, useEffect, useState } from 'react';

/** Saved stories ("read later"), kept in this browser only. */
const KEY = 'afrivue-saved';
const EVENT = 'afrivue-saved-change';

function read(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function write(list: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage blocked: the list still works for this visit */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: list }));
}

export function useSaved() {
  const [saved, setSaved] = useState<string[]>(read);

  useEffect(() => {
    const sync = (e: Event) => setSaved(e instanceof CustomEvent ? (e.detail as string[]) : read());
    const onStorage = (e: StorageEvent) => e.key === KEY && setSaved(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const isSaved = useCallback((slug: string) => saved.includes(slug), [saved]);
  const toggle = useCallback((slug: string) => {
    const cur = read();
    write(cur.includes(slug) ? cur.filter((s) => s !== slug) : [slug, ...cur]);
  }, []);
  const clear = useCallback(() => write([]), []);

  return { saved, isSaved, toggle, clear };
}
