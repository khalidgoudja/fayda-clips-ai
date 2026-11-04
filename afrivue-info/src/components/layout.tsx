import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { ArrowUp, Check, ChevronRight, Facebook, Globe, Instagram, Mail, Menu, Moon, Search, Send, Sun, X, Youtube } from 'lucide-react';
import { ARTICLES, SITE, byDate } from '../data';
import { LANGS, LANG_META, formatDate, useI18n, type Lang } from '../i18n';
import { Link } from '../router';
import { Cover, Logo } from './ui';

const NAV = ['home', 'chad', 'sahel', 'africa', 'analysis', 'videos', 'about'] as const;
type NavKey = (typeof NAV)[number];
const navPath = (k: NavKey) => (k === 'home' ? '/' : `/${k}`);

/* X (Twitter) glyph — lucide has no brand mark for it */
const XIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.36 5.77L17.75 3Zm-1.08 16.17h1.7L7.4 4.74H5.58l11.09 14.43Z" />
  </svg>
);

export function SocialLinks({ className = '' }: { className?: string }) {
  const items = [
    { href: SITE.social.x, label: 'X', icon: <XIcon /> },
    { href: SITE.social.facebook, label: 'Facebook', icon: <Facebook size={16} /> },
    { href: SITE.social.instagram, label: 'Instagram', icon: <Instagram size={16} /> },
    { href: SITE.social.youtube, label: 'YouTube', icon: <Youtube size={17} /> },
    { href: SITE.social.telegram, label: 'Telegram', icon: <Send size={15} /> },
  ];
  return (
    <ul className={`flex items-center gap-1 ${className}`}>
      {items.map((s) => (
        <li key={s.label}>
          <a href={s.href} aria-label={s.label} className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-gold hover:text-navy" target="_blank" rel="noopener noreferrer">
            {s.icon}
          </a>
        </li>
      ))}
    </ul>
  );
}

/* ── Language switcher (segmented) ── */
export function LanguageSwitcher({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div role="group" aria-label={t.ui.language} className="flex items-center gap-0.5" dir="ltr">
      <Globe size={14} className="me-1 opacity-70" aria-hidden />
      {LANGS.map((l) => {
        const active = l === lang;
        return (
          <button
            key={l}
            type="button"
            lang={l}
            onClick={() => setLang(l)}
            aria-pressed={active}
            title={LANG_META[l].label}
            className={`rounded px-2 py-0.5 text-xs font-semibold transition ${
              active
                ? 'bg-gold text-navy'
                : variant === 'dark'
                  ? 'text-paper/80 hover:bg-white/10 hover:text-white'
                  : 'text-heading hover:bg-navy/5 dark:hover:bg-white/10'
            } ${l === 'ar' ? 'font-arabic text-[13px]' : ''}`}
          >
            {LANG_META[l].short}
          </button>
        );
      })}
    </div>
  );
}

function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  const { t } = useI18n();
  return (
    <button type="button" onClick={onToggle} aria-label={dark ? t.ui.themeLight : t.ui.themeDark} title={dark ? t.ui.themeLight : t.ui.themeDark} className="grid h-7 w-7 place-items-center rounded-full text-paper/80 transition hover:bg-white/10 hover:text-white">
      {dark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}

/* ── Top utility bar ── */
export function TopBar({ dark, onToggleTheme }: { dark: boolean; onToggleTheme: () => void }) {
  const { lang } = useI18n();
  const today = formatDate(new Date().toISOString(), lang, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <div className="bg-navy text-paper">
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <p className="hidden truncate text-xs text-paper/75 sm:block">{today}</p>
        <div className="flex flex-1 items-center justify-between gap-2 sm:flex-none sm:justify-end sm:gap-4">
          <LanguageSwitcher />
          <span className="hidden h-4 w-px bg-white/20 sm:block" aria-hidden />
          <SocialLinks className="hidden md:flex [&_a]:h-7 [&_a]:w-7" />
          <ThemeToggle dark={dark} onToggle={onToggleTheme} />
        </div>
      </div>
    </div>
  );
}

/* ── Masthead + sticky navigation ── */
export function Header({ active, onSearch, onMenu }: { active: NavKey | null; onSearch: () => void; onMenu: () => void }) {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className="border-b border-line bg-bg">
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-4 sm:px-6 sm:py-6">
          <div className="flex items-center gap-2">
            <button type="button" onClick={onMenu} className="grid h-10 w-10 place-items-center rounded-full text-heading hover:bg-navy/5 lg:hidden dark:hover:bg-white/10" aria-label={t.ui.menu}>
              <Menu size={22} />
            </button>
            <p className="label hidden text-muted lg:block">{t.meta.tagline}</p>
          </div>
          <Link to="/" aria-label="AfriVue Info — home" className="rounded-md">
            <Logo />
          </Link>
          <div className="flex items-center justify-end gap-2">
            <button type="button" onClick={onSearch} className="grid h-10 w-10 place-items-center rounded-full text-heading hover:bg-navy/5 dark:hover:bg-white/10" aria-label={t.ui.search} title={t.ui.shortcut}>
              <Search size={20} />
            </button>
            <a href="#newsletter" onClick={(e) => { e.preventDefault(); document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' }); }} className="hidden rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy shadow-sm transition hover:bg-navy hover:text-white sm:inline-block dark:hover:bg-white dark:hover:text-navy">
              {t.newsletter.button}
            </a>
          </div>
        </div>
      </header>

      <nav aria-label="Main" className={`sticky top-0 z-40 border-b border-line bg-bg/95 backdrop-blur transition-shadow ${scrolled ? 'shadow-[0_6px_20px_-12px_rgba(11,37,69,0.45)]' : ''}`}>
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Link to="/" aria-hidden tabIndex={-1} className={`shrink-0 transition-all duration-300 ${scrolled ? 'w-auto opacity-100' : 'pointer-events-none w-0 overflow-hidden opacity-0'}`}>
            <Logo size="sm" tag={false} />
          </Link>
          <ul className="no-scrollbar -mx-1 flex flex-1 items-center gap-1 overflow-x-auto lg:justify-center">
            {NAV.map((k) => (
              <li key={k}>
                <Link
                  to={navPath(k)}
                  aria-current={active === k ? 'page' : undefined}
                  className={`relative block whitespace-nowrap px-3 py-3.5 text-sm font-semibold transition-colors ${
                    active === k ? 'text-heading' : 'text-muted hover:text-heading'
                  }`}
                >
                  {t.nav[k]}
                  <span className={`absolute inset-x-3 bottom-0 h-[3px] rounded-t bg-gold transition-transform duration-300 ${active === k ? 'scale-x-100' : 'scale-x-0'}`} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <button type="button" onClick={onSearch} className={`hidden h-9 w-9 shrink-0 place-items-center rounded-full text-heading hover:bg-navy/5 dark:hover:bg-white/10 ${scrolled ? 'lg:grid' : ''}`} aria-label={t.ui.search}>
            <Search size={18} />
          </button>
        </div>
      </nav>
    </>
  );
}

/* ── Breaking-news ticker ── */
export function Ticker() {
  const { t, lang } = useI18n();
  const items = useMemo(() => [...ARTICLES].sort(byDate).slice(0, 6), []);
  const list = (dup: boolean) =>
    items.map((a) => (
      <li key={`${a.slug}${dup ? '-d' : ''}`} className="flex items-center gap-3 whitespace-nowrap" aria-hidden={dup || undefined}>
        <span className="h-1.5 w-1.5 rotate-45 bg-gold" aria-hidden />
        <Link to={`/article/${a.slug}`} tabIndex={dup ? -1 : undefined} className="text-sm text-fg hover:text-accent hover:underline">
          {a.i18n[lang].title}
        </Link>
      </li>
    ));
  return (
    <div className="ticker border-b border-line bg-surface">
      <div className="mx-auto flex max-w-7xl items-stretch px-4 sm:px-6">
        <span className="label z-10 flex shrink-0 items-center gap-2 bg-terracotta px-3 py-2 text-white">
          <span className="live-dot h-2 w-2 rounded-full bg-white" aria-hidden /> {t.ui.latest}
        </span>
        <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_4%,#000_96%,transparent)]">
          <ul className="ticker-track flex w-max items-center gap-10 py-2 ps-6">
            {list(false)}
            {list(true)}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ── Mobile drawer ── */
export function MobileMenu({ open, onClose, active }: { open: boolean; onClose: () => void; active: NavKey | null }) {
  const { t } = useI18n();
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <div className={`fixed inset-0 z-50 lg:hidden ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-navy/60 backdrop-blur-sm transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t.ui.menu}
        className={`absolute inset-y-0 start-0 flex w-[86%] max-w-sm flex-col bg-navy text-paper shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <Logo size="sm" reversed />
          <button ref={closeRef} type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10" aria-label={t.ui.close}>
            <X size={22} />
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto px-3 py-4">
          {NAV.map((k) => (
            <li key={k}>
              <Link to={navPath(k)} onClick={onClose} className={`flex items-center justify-between rounded-md px-3 py-3.5 text-lg font-semibold ${active === k ? 'bg-white/10 text-gold' : 'hover:bg-white/5'}`}>
                {t.nav[k]}
                <ChevronRight size={18} className="opacity-50 rtl:rotate-180" />
              </Link>
            </li>
          ))}
        </ul>
        <div className="space-y-4 border-t border-white/10 px-5 py-5">
          <LanguageSwitcher />
          <SocialLinks />
        </div>
      </aside>
    </div>
  );
}

/* ── Search overlay ── */
export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, lang } = useI18n();
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQ('');
    const id = window.setTimeout(() => inputRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const norm = (s: string) => s.toLocaleLowerCase(LANG_META[lang].locale).normalize('NFD').replace(/[̀-ًͯ-ٟ]/g, '');
  const results = useMemo(() => {
    const term = norm(q.trim());
    if (term.length < 2) return [];
    return ARTICLES.filter((a) => {
      const c = a.i18n[lang];
      return norm(`${c.title} ${c.excerpt} ${t.nav[a.section]}`).includes(term);
    }).sort(byDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, lang]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-navy/70 p-4 pt-[10vh] backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-label={t.ui.search}>
      <div className="fade-up w-full max-w-2xl overflow-hidden rounded-xl bg-surface shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-line px-5">
          <Search size={20} className="shrink-0 text-gold" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.ui.searchPlaceholder}
            aria-label={t.ui.search}
            className="h-16 w-full bg-transparent text-lg text-fg outline-none placeholder:text-muted"
          />
          <button type="button" onClick={onClose} className="label shrink-0 rounded border border-line px-2 py-1 text-muted hover:text-heading" aria-label={t.ui.close}>
            Esc
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {q.trim().length < 2 ? (
            <p className="px-5 py-8 text-center text-sm text-muted">{t.ui.searchHint}</p>
          ) : results.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted">{t.ui.noResults}</p>
          ) : (
            <>
              <p className="label px-5 pt-4 text-muted">
                {results.length} {t.ui.results}
              </p>
              <ul className="p-2">
                {results.map((a) => (
                  <li key={a.slug}>
                    <Link to={`/article/${a.slug}`} onClick={onClose} className="group flex items-center gap-4 rounded-lg p-3 hover:bg-bg">
                      <Cover art={a.art} section={a.section} className="h-14 w-20 shrink-0 rounded" />
                      <span className="min-w-0">
                        <span className="label block text-terracotta dark:text-gold-300">{t.nav[a.section]}</span>
                        <span className="block truncate font-semibold text-heading">{a.i18n[lang].title}</span>
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

/* ── Newsletter band ── */
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
      localStorage.setItem('afrivue-newsletter', email.trim());
    } catch {
      /* ignore */
    }
    setState('done');
  };
  return (
    <section id="newsletter" aria-labelledby="nl-title" className="relative scroll-mt-16 overflow-hidden bg-navy text-paper">
      <div className="pointer-events-none absolute -end-24 -top-24 h-72 w-72 rounded-full border-[40px] border-gold/15" aria-hidden />
      <div className="pointer-events-none absolute -bottom-32 start-1/3 h-64 w-64 rounded-full bg-terracotta/20 blur-3xl" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 sm:px-6 md:grid-cols-2">
        <div>
          <p className="label mb-3 flex items-center gap-2 text-gold">
            <Mail size={14} aria-hidden /> {t.newsletter.kicker}
          </p>
          <h2 id="nl-title" className="text-3xl font-bold text-white sm:text-4xl">
            {t.newsletter.title}
          </h2>
          <p className="mt-3 max-w-md text-paper/80">{t.newsletter.text}</p>
        </div>
        {state === 'done' ? (
          <p className="fade-up flex items-center gap-3 rounded-lg bg-verified/90 px-5 py-4 font-medium text-white" role="status">
            <Check size={20} aria-hidden /> {t.newsletter.success}
          </p>
        ) : (
          <form onSubmit={submit} noValidate className="w-full">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="nl-email" className="sr-only">
                {t.newsletter.placeholder}
              </label>
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
                placeholder={t.newsletter.placeholder}
                className={`h-12 flex-1 rounded-full border bg-white/10 px-5 text-white outline-none placeholder:text-paper/50 focus:border-gold focus:bg-white/15 ${state === 'error' ? 'border-terracotta' : 'border-white/20'}`}
              />
              <button type="submit" className="h-12 rounded-full bg-gold px-7 font-semibold text-navy transition hover:bg-white">
                {t.newsletter.button}
              </button>
            </div>
            <p id="nl-help" className={`mt-2 ps-5 text-xs ${state === 'error' ? 'text-[#f0a78c]' : 'text-paper/60'}`} role={state === 'error' ? 'alert' : undefined}>
              {state === 'error' ? t.about.invalidEmail : t.newsletter.privacy}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

/* ── Footer ── */
export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#081c35] text-paper/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo reversed size="md" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed">{t.footer.about}</p>
          <SocialLinks className="mt-5 -ms-1.5 text-paper" />
        </div>
        <div>
          <h3 className="label mb-4 text-gold">{t.footer.sections}</h3>
          <ul className="space-y-2.5 text-sm">
            {(['chad', 'sahel', 'africa', 'analysis', 'videos'] as const).map((k) => (
              <li key={k}>
                <Link to={`/${k}`} className="hover:text-gold">
                  {t.nav[k]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="label mb-4 text-gold" lang={t.footer.company === 'AfriVue' ? 'en' : undefined}>{t.footer.company}</h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/about" className="hover:text-gold">
                {t.nav.about}
              </Link>
            </li>
            <li>
              <Link to="/about#contact" className="hover:text-gold">
                {t.footer.contact}
              </Link>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="hover:text-gold" dir="ltr">
                {SITE.email}
              </a>
            </li>
          </ul>
          <div className="mt-6">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-paper/55 sm:flex-row sm:px-6">
          <p>
            © {year} AfriVue Info. {t.footer.rights}
          </p>
          <p className="flex gap-4">
            <a href="#" className="hover:text-gold">{t.footer.privacy}</a>
            <a href="#" className="hover:text-gold">{t.footer.terms}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export function BackToTop() {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t.ui.backToTop}
      className={`fixed bottom-5 end-5 z-30 grid h-11 w-11 place-items-center rounded-full bg-gold text-navy shadow-lg transition-all hover:bg-navy hover:text-white ${show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
    >
      <ArrowUp size={20} />
    </button>
  );
}

export type { NavKey, Lang };
