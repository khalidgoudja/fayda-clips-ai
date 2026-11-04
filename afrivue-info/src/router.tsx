import { useEffect, useState, type AnchorHTMLAttributes } from 'react';
import { isLang, useI18n, type Lang } from './i18n';

/**
 * Tiny hash router: URLs look like  #/ar/article/ndjamena-trade-corridor
 * Hash routing works on any static host without server rewrites.
 */
export interface Route {
  lang: Lang | null;
  path: string[]; // e.g. ['article', 'slug']
  anchor: string | null; // e.g. #/en/about#contact → 'contact'
}

export function parseHash(hash = window.location.hash): Route {
  const [raw, anchor = null] = hash.replace(/^#\/?/, '').split('#');
  const parts = raw.split('/').filter(Boolean).map(decodeURIComponent);
  if (isLang(parts[0])) return { lang: parts[0], path: parts.slice(1), anchor };
  return { lang: null, path: parts, anchor };
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseHash());
  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export const hrefFor = (lang: Lang, to: string) => `#/${lang}${to.startsWith('/') ? to : `/${to}`}`;

export function navigate(lang: Lang, to: string) {
  window.location.hash = hrefFor(lang, to);
}

export function Link({ to, ...rest }: { to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { lang } = useI18n();
  return <a href={hrefFor(lang, to)} {...rest} />;
}
