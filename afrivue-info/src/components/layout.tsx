import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { ArrowUp, ChevronLeft, ChevronRight, Mail, Menu, Moon, Pause, Play, Search, Sun, X } from 'lucide-react';
import { ARTICLES, SITE, byDate } from '../data';
import { LANGS, LANG_META, formatDate, formatTime, useI18n } from '../i18n';
import { Link } from '../router';
import { Cover, Logo, LogoMark, SocialLinks } from './ui';

export const NAV = ['home', 'chad', 'africa', 'politics', 'economy', 'society', 'culture', 'sports', 'technology', 'analysis', 'indepth', 'video'] as const;
export type NavKey = (typeof NAV)[number] | 'about' | 'development';
export const navPath = (k: NavKey) => (k === 'home' ? '/' : k === 'indepth' ? '/in-depth' : `/${k}`);

const scrollToNewsletter = () => document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

/* ── Language selector: AR / EN / FR / TR, keeps the current page ── */
export function LanguageSelector({ tone = 'dark', className = '' }: { tone?: 'dark' | 'light'; className?: string }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div role="group" aria-label={t.ui.language} className={`flex items-center ${className}`} dir="ltr">
      {LANGS.map((l, i) => {
        const on = l === lang;
        return (
          <span key={l} className="flex items-center">
            {i > 0 && <span className={`h-3 w-px ${tone === 'dark' ? 'bg-white/20' : 'bg-line'}`} aria-hidden />}
            <button
              type="button"
              lang={l}
              onClick={() => setLang(l)}
              aria-pressed={on}
              aria-label={LANG_META[l].label}
              title={LANG_META[l].label}
              className={`relative px-2.5 py-1 text-xs font-semibold tracking-wide transition-colors ${
                on ? (tone === 'dark' ? 'text-white' : 'text-heading') : tone === 'dark' ? 'text-white/55 hover:text-white' : 'text-muted hover:text-heading'
              }`}
            >
              {LANG_META[l].short}
              <span className={`absolute inset-x-2 -bottom-0.5 h-[2px] bg-emerald transition-transform ${on ? 'scale-x-100' : 'scale-x-0'}`} aria-hidden />
            </button>
          </span>
        );
      })}
    </div>
  );
}

/* ── Thin utility bar ── */
export function UtilityBar({ dark, onToggleTheme }: { dark: boolean; onToggleTheme: () => void }) {
  const { t } = useI18n();
  return (
    <div className="bg-navy text-white">
      <div className="mx-auto flex h-9 max-w-[1320px] items-center justify-between gap-3 px-4 text-xs sm:px-6">
        <p className="min-w-0 truncate text-white/75">
          {SITE.demo && (
            <>
              <span className="sm:hidden">{t.demo.short}</span>
              <span className="hidden sm:inline">{t.demo.notice}</span>
            </>
          )}
        </p>
        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          <SocialLinks size={13} className="hidden lg:flex" itemClass="h-7 w-7 opacity-70 hover:opacity-100" />
          <span className="hidden h-3.5 w-px bg-white/20 lg:block" aria-hidden />
          <button type="button" onClick={scrollToNewsletter} className="hidden items-center gap-1.5 text-white/75 hover:text-white md:flex">
            <Mail size={13} aria-hidden /> {t.ui.newsletter}
          </button>
          <span className="hidden h-3.5 w-px bg-white/20 md:block" aria-hidden />
          <LanguageSelector />
          <button type="button" onClick={onToggleTheme} aria-label={dark ? t.ui.themeLight : t.ui.themeDark} title={dark ? t.ui.themeLight : t.ui.themeDark} className="grid h-7 w-7 place-items-center text-white/70 hover:text-white">
            {dark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Masthead ── */
export function Masthead({ onSearch, onMenu }: { onSearch: () => void; onMenu: () => void }) {
  const { t, lang } = useI18n();
  const today = formatDate(new Date().toISOString(), lang, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <header className="bg-bg">
      <div className="mx-auto grid max-w-[1320px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-4 sm:px-6 sm:py-7">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onMenu} className="-ms-2 grid h-10 w-10 place-items-center text-heading lg:hidden" aria-label={t.ui.menu}>
            <Menu size={22} />
          </button>
          <div className="hidden lg:block">
            <p className="font-display text-[1.05rem] font-semibold italic text-heading">{t.meta.tagline}</p>
            <p className="mt-0.5 text-[13px] text-muted">{today}</p>
          </div>
        </div>
        <Link to="/" aria-label="AfriVue Info" className="block">
          <Logo />
        </Link>
        <div className="flex items-center justify-end gap-2">
          <button type="button" onClick={onSearch} className="-me-2 grid h-10 w-10 place-items-center text-heading sm:me-0" aria-label={t.ui.search} aria-keyshortcuts="/">
            <Search size={21} />
          </button>
          <button type="button" onClick={scrollToNewsletter} className="hidden h-10 items-center gap-2 bg-navy px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 sm:flex dark:bg-emerald dark:text-navy dark:hover:bg-emerald-300">
            {t.newsletter.button}
          </button>
        </div>
      </div>
      <p className="border-t border-line px-4 py-2 text-center text-[12px] text-muted lg:hidden">
        <span className="font-display italic text-heading">{t.meta.tagline}</span> · {today}
      </p>
    </header>
  );
}

/* ── Sticky primary navigation ── */
export function PrimaryNav({ active, onSearch }: { active: NavKey | null; onSearch: () => void }) {
  const { t } = useI18n();
  const [stuck, setStuck] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <>
      <div ref={sentinel} aria-hidden />
      <nav aria-label="Primary" className={`sticky top-0 z-40 border-y border-line bg-bg/95 backdrop-blur transition-shadow duration-300 ${stuck ? 'shadow-[0_8px_24px_-18px_rgba(11,37,69,0.5)]' : ''}`}>
        <div className="mx-auto flex max-w-[1320px] items-center px-4 sm:px-6">
          <Link to="/" aria-label="AfriVue Info" tabIndex={stuck ? 0 : -1} className={`shrink-0 overflow-hidden transition-all duration-300 ${stuck ? 'me-3 w-8 opacity-100' : 'w-0 opacity-0'}`}>
            <LogoMark className="h-5 w-auto" />
          </Link>
          <ul className="no-scrollbar flex flex-1 items-center overflow-x-auto [mask-image:linear-gradient(90deg,#000_92%,transparent)] lg:[mask-image:none] rtl:[mask-image:linear-gradient(270deg,#000_92%,transparent)] lg:rtl:[mask-image:none]">
            {NAV.map((k) => {
              const on = active === k;
              return (
                <li key={k}>
                  <Link
                    to={navPath(k)}
                    aria-current={on ? 'page' : undefined}
                    className={`relative block whitespace-nowrap px-3 py-3.5 text-[14px] font-medium transition-colors xl:px-3.5 ${on ? 'text-heading' : 'text-fg/80 hover:text-heading'}`}
                  >
                    {t.nav[k]}
                    <span className={`absolute inset-x-3 bottom-0 h-[3px] bg-emerald transition-transform duration-300 ${on ? 'scale-x-100' : 'scale-x-0'}`} aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>
          <button type="button" onClick={onSearch} className="ms-2 hidden h-9 w-9 shrink-0 place-items-center text-heading lg:grid" aria-label={t.ui.search}>
            <Search size={18} />
          </button>
        </div>
      </nav>
    </>
  );
}

/* ── Calm breaking-news ticker: one headline at a time ── */
export function Ticker() {
  const { t, lang } = useI18n();
  const items = useMemo(() => {
    const s = [...ARTICLES].sort(byDate);
    return [...s.filter((a) => a.breaking), ...s.filter((a) => !a.breaking)].slice(0, 6);
  }, []);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    if (paused || hover) return;
    const id = window.setInterval(() => setI((x) => (x + 1) % items.length), 6500);
    return () => window.clearInterval(id);
  }, [paused, hover, items.length]);
  const a = items[i];
  const go = (d: number) => setI((x) => (x + d + items.length) % items.length);
  return (
    <div className="border-b border-line bg-surface" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onFocus={() => setHover(true)} onBlur={() => setHover(false)}>
      <div className="mx-auto flex h-11 max-w-[1320px] items-center gap-3 px-4 sm:px-6">
        <span className="kicker flex shrink-0 items-center gap-2 text-terracotta">
          <span className="h-1.5 w-1.5 rounded-full bg-terracotta" aria-hidden />
          {t.ui.breaking}
        </span>
        <span className="h-4 w-px bg-line" aria-hidden />
        <div className="min-w-0 flex-1" aria-live={paused ? 'polite' : 'off'}>
          <p key={a.slug} className="ticker-in flex min-w-0 items-baseline gap-2.5 text-sm">
            <time className="shrink-0 text-muted tabular-nums" dateTime={a.date} dir="ltr">
              {formatTime(a.date, lang)}
            </time>
            <Link to={`/article/${a.slug}`} className="truncate font-medium text-heading hover:underline">
              {a.i18n[lang].title}
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 items-center text-muted">
          <button type="button" onClick={() => go(-1)} className="grid h-8 w-7 place-items-center hover:text-heading" aria-label={t.ui.prev}>
            <ChevronLeft size={16} className="rtl:rotate-180" />
          </button>
          <button type="button" onClick={() => setPaused((p) => !p)} className="grid h-8 w-7 place-items-center hover:text-heading" aria-label={paused ? t.ui.resume : t.ui.pause} aria-pressed={paused}>
            {paused ? <Play size={13} /> : <Pause size={13} />}
          </button>
          <button type="button" onClick={() => go(1)} className="grid h-8 w-7 place-items-center hover:text-heading" aria-label={t.ui.next}>
            <ChevronRight size={16} className="rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Modal helper: Esc to close, body scroll lock, focus return ── */
function useModal(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      prev?.focus?.();
    };
  }, [open, onClose]);
}
export { useModal };

/* ── Mobile drawer ── */
export function MobileMenu({ open, onClose, active }: { open: boolean; onClose: () => void; active: NavKey | null }) {
  const { t } = useI18n();
  const closeRef = useRef<HTMLButtonElement>(null);
  useModal(open, onClose);
  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);
  return (
    <div className={`fixed inset-0 z-50 lg:hidden ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open} inert={!open}>
      <div className={`absolute inset-0 bg-navy-950/60 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t.ui.menu}
        className={`absolute inset-y-0 start-0 flex w-[86%] max-w-sm flex-col bg-navy text-white shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <Logo size="sm" reversed />
          <button ref={closeRef} type="button" onClick={onClose} className="-me-2 grid h-10 w-10 place-items-center" aria-label={t.ui.close}>
            <X size={22} />
          </button>
        </div>
        <div className="border-b border-white/10 px-3 py-3">
          <p className="kicker px-2 pb-2 text-white/50">{t.ui.language}</p>
          <LanguageSelector />
        </div>
        <ul className="flex-1 overflow-y-auto px-2 py-3">
          {[...NAV, 'about' as const].map((k) => (
            <li key={k}>
              <Link to={navPath(k)} onClick={onClose} aria-current={active === k ? 'page' : undefined} className={`flex items-center justify-between px-3 py-3 text-[17px] font-medium ${active === k ? 'text-emerald-300' : 'text-white/90 hover:text-white'}`}>
                {t.nav[k]}
                <ChevronRight size={16} className="opacity-40 rtl:rotate-180" />
              </Link>
            </li>
          ))}
        </ul>
        <div className="border-t border-white/10 px-4 py-4">
          <SocialLinks itemClass="h-9 w-9 opacity-80 hover:opacity-100" />
        </div>
      </aside>
    </div>
  );
}

/* ── Search ── */
export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, lang } = useI18n();
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  useModal(open, onClose);
  useEffect(() => {
    if (!open) return;
    setQ('');
    const id = window.setTimeout(() => inputRef.current?.focus(), 20);
    return () => window.clearTimeout(id);
  }, [open]);

  const norm = (s: string) => s.toLocaleLowerCase(LANG_META[lang].locale).normalize('NFD').replace(/[̀-ًͯ-ٟ]/g, '');
  const term = norm(q.trim());
  const results = useMemo(() => {
    if (term.length < 2) return [];
    return ARTICLES.filter((a) => {
      const c = a.i18n[lang];
      return norm(`${c.title} ${c.excerpt} ${t.nav[a.topic]} ${t.regions[a.region]} ${t.formats[a.format]}`).includes(term);
    }).sort(byDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term, lang]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-bg/97 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={t.ui.search}>
      <div className="fade-in mx-auto max-w-3xl px-4 pt-6 sm:px-6 sm:pt-16">
        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="flex items-center gap-2 text-sm font-medium text-muted hover:text-heading">
            {t.ui.close} <X size={18} />
          </button>
        </div>
        <label htmlFor="site-search" className="kicker mt-4 block text-accent">
          {t.ui.search}
        </label>
        <div className="mt-2 flex items-center gap-3 border-b-2 border-navy pb-2 dark:border-emerald">
          <Search size={24} className="shrink-0 text-muted" aria-hidden />
          <input
            id="site-search"
            ref={inputRef}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.ui.searchPlaceholder}
            autoComplete="off"
            className="font-display h-14 w-full bg-transparent text-2xl text-heading outline-none placeholder:text-muted/70 sm:text-3xl"
          />
        </div>
        <div className="py-8" aria-live="polite">
          {term.length < 2 ? (
            <>
              <p className="text-sm text-muted">{t.ui.searchHint}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {NAV.slice(1).map((k) => (
                  <li key={k}>
                    <Link to={navPath(k)} onClick={onClose} className="inline-block border border-line px-3 py-1.5 text-sm text-heading hover:border-navy dark:hover:border-emerald">
                      {t.nav[k]}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : results.length === 0 ? (
            <p className="text-muted">{t.ui.noResults}</p>
          ) : (
            <>
              <p className="kicker mb-4 text-muted">
                {results.length} {t.ui.results}
              </p>
              <ul className="divide-y divide-line">
                {results.map((a) => (
                  <li key={a.slug}>
                    <Link to={`/article/${a.slug}`} onClick={onClose} className="group flex items-center gap-4 py-4">
                      <Cover art={a.art} region={a.region} image={a.image} className="h-16 w-24 shrink-0" />
                      <span className="min-w-0">
                        <span className="kicker block text-accent">
                          {t.nav[a.topic]} · {t.formats[a.format]}
                        </span>
                        <span className="font-display hl mt-0.5 block text-lg font-semibold leading-snug text-heading">{a.i18n[lang].title}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Newsletter: "Africa, seen closer." ── */
export function Newsletter() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'error' | 'done'>(() => {
    try {
      return localStorage.getItem('afrivue-newsletter') ? 'done' : 'idle';
    } catch {
      return 'idle';
    }
  });
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setState('error');
    try {
      localStorage.setItem('afrivue-newsletter', '1');
    } catch {
      /* ignore */
    }
    // TODO: connect to your newsletter provider (Mailchimp, Brevo, Buttondown…)
    setState('done');
  };
  return (
    <section id="newsletter" aria-labelledby="nl-title" className="scroll-mt-16 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.1fr_1fr] md:py-20">
        <div>
          <p className="kicker text-accent">{t.newsletter.kicker}</p>
          <h2 id="nl-title" className="font-display mt-3 text-4xl font-bold leading-[1.08] text-heading sm:text-5xl">
            {t.newsletter.title}
          </h2>
          <p className="mt-4 max-w-md text-[17px] leading-relaxed text-muted">{t.newsletter.text}</p>
        </div>
        {state === 'done' ? (
          <p className="fade-in border-s-[3px] border-emerald bg-bg px-5 py-5 text-lg font-medium text-heading" role="status">
            {t.newsletter.success}
          </p>
        ) : (
          <form onSubmit={submit} noValidate>
            <label htmlFor="nl-email" className="mb-2 block text-sm font-medium text-heading">
              {t.newsletter.placeholder}
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="nl-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (state === 'error') setState('idle');
                }}
                aria-invalid={state === 'error'}
                aria-describedby="nl-help"
                placeholder="name@example.com"
                dir="ltr"
                className={`h-12 flex-1 border bg-bg px-4 text-fg outline-none transition-colors placeholder:text-muted/60 focus:border-navy dark:focus:border-emerald ${state === 'error' ? 'border-terracotta' : 'border-line'} rtl:text-right`}
              />
              <button type="submit" className="h-12 bg-navy px-7 font-semibold text-white transition-colors hover:bg-emerald-700 dark:bg-emerald dark:text-navy dark:hover:bg-emerald-300">
                {t.newsletter.button}
              </button>
            </div>
            <p id="nl-help" className={`mt-2 text-[13px] ${state === 'error' ? 'text-terracotta' : 'text-muted'}`} role={state === 'error' ? 'alert' : undefined}>
              {state === 'error' ? t.newsletter.invalid : t.newsletter.privacy}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

/* ── Footer ── */
export function Footer() {
  const { t, setLang, lang } = useI18n();
  const year = new Date().getFullYear();
  const sections = NAV.slice(1);
  const company: [string, string][] = [
    [t.footer.aboutUs, '/about'],
    [t.footer.team, '/about#team'],
    [t.footer.contact, '/about#contact'],
    [t.footer.corrections, '/page/corrections'],
    [t.footer.privacy, '/page/privacy'],
    [t.footer.terms, '/page/terms'],
  ];
  return (
    <footer className="bg-navy text-white/75">
      <div className="mx-auto max-w-[1320px] px-4 pb-8 pt-14 sm:px-6">
        <div className="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Logo reversed />
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed">{t.footer.mission}</p>
            <SocialLinks className="-ms-2 mt-5 text-white" itemClass="h-9 w-9 opacity-75 hover:opacity-100" size={16} />
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="col-span-2 sm:col-span-1">
              <h3 className="kicker mb-4 text-emerald-300">{t.footer.sections}</h3>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm sm:grid-cols-1">
                {sections.map((k) => (
                  <li key={k}>
                    <Link to={navPath(k)} className="hover:text-white">
                      {t.nav[k]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="kicker mb-4 text-emerald-300">{t.footer.company}</h3>
              <ul className="space-y-2.5 text-sm">
                {company.map(([l, to]) => (
                  <li key={to}>
                    <Link to={to} className="hover:text-white">
                      {l}
                    </Link>
                  </li>
                ))}
                <li>
                  <button type="button" onClick={scrollToNewsletter} className="hover:text-white">
                    {t.footer.newsletter}
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="kicker mb-4 text-emerald-300">{t.footer.languages}</h3>
              <ul className="space-y-2.5 text-sm">
                {LANGS.map((l) => (
                  <li key={l}>
                    <button type="button" lang={l} onClick={() => setLang(l)} aria-current={l === lang ? 'true' : undefined} className={l === lang ? 'font-semibold text-white' : 'hover:text-white'}>
                      {LANG_META[l].label}
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm">
                <a href={`mailto:${SITE.email}`} className="hover:text-white" dir="ltr">
                  {SITE.email}
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} AfriVue Info. {t.footer.rights}
          </p>
          {SITE.demo && <p>{t.demo.notice}</p>}
        </div>
      </div>
    </footer>
  );
}

export function BackToTop() {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 1200);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t.ui.backToTop}
      className={`fixed bottom-5 end-5 z-30 grid h-11 w-11 place-items-center rounded-full bg-navy text-white shadow-lg transition-all hover:bg-emerald-700 dark:bg-emerald dark:text-navy ${show ? 'opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`}
    >
      <ArrowUp size={19} />
    </button>
  );
}
