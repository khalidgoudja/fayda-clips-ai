import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowLeft, Check, Facebook, Link2, Mail, MapPin, Minus, Plus, Send } from 'lucide-react';
import { ARTICLES, SECTIONS, SITE, VIDEOS, byDate, type Article, type ArticleType, type Section, type Video } from '../data';
import { formatDate, useI18n } from '../i18n';
import { Link } from '../router';
import { ArticleCard, ArticleRow, Cover, Logo, MetaLine, SectionHeading, SectionTag, VerifiedBadge } from '../components/ui';
import { Newsletter, SocialLinks } from '../components/layout';
import { VideoCard } from './Home';

/* ── Shared page hero ── */
function PageHero({ kicker, title, intro, children }: { kicker?: string; title: string; intro: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-surface">
      <div className="pointer-events-none absolute -end-20 -top-20 h-64 w-64 rounded-full border-[36px] border-gold/10" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        {kicker && <p className="label mb-3 text-terracotta dark:text-gold-300">{kicker}</p>}
        <h1 className="text-4xl font-bold tracking-tight text-heading sm:text-5xl">{title}</h1>
        <span className="mt-5 block h-1 w-16 bg-gold" aria-hidden />
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{intro}</p>
        {children}
      </div>
    </section>
  );
}

function Chips<T extends string>({ value, options, onChange, label }: { value: T; options: { v: T; l: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="no-scrollbar flex gap-2 overflow-x-auto">
      {options.map((o) => (
        <button
          key={o.v}
          role="tab"
          aria-selected={value === o.v}
          onClick={() => onChange(o.v)}
          className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition ${
            value === o.v ? 'border-navy bg-navy text-white dark:border-gold dark:bg-gold dark:text-navy' : 'border-line text-muted hover:border-navy hover:text-heading'
          }`}
        >
          {o.l}
        </button>
      ))}
    </div>
  );
}

/* ── Chad / Sahel / Africa ── */
export function SectionPage({ section }: { section: Section }) {
  const { t } = useI18n();
  const [type, setType] = useState<'all' | ArticleType>('all');
  const all = useMemo(() => ARTICLES.filter((a) => a.section === section).sort(byDate), [section]);
  const list = all.filter((a) => type === 'all' || a.type === type);
  const [first, ...rest] = list;
  const others = ARTICLES.filter((a) => a.section !== section).sort(byDate).slice(0, 4);

  return (
    <>
      <PageHero kicker={`${all.length} ${t.ui.stories}`} title={t.sections[section].title} intro={t.sections[section].intro}>
        <div className="mt-8">
          <Chips
            label={t.sections[section].title}
            value={type}
            onChange={setType}
            options={[
              { v: 'all', l: t.ui.all },
              { v: 'news', l: t.ui.news },
              { v: 'analysis', l: t.ui.analysis },
            ]}
          />
        </div>
      </PageHero>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12">
        <div className="lg:col-span-8" key={type}>
          {first ? (
            <>
              <ArticleCard a={first} size="lg" />
              <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2">
                {rest.map((a) => (
                  <ArticleCard key={a.slug} a={a} />
                ))}
              </div>
            </>
          ) : (
            <p className="rounded-lg border border-dashed border-line p-10 text-center text-muted">{t.ui.noResults}</p>
          )}
        </div>
        <aside className="lg:col-span-4">
          <div className="rounded-lg border border-line bg-surface p-5 lg:sticky lg:top-20">
            <h2 className="label mb-1 text-heading">{t.home.regions}</h2>
            {others.map((a) => (
              <ArticleRow key={a.slug} a={a} />
            ))}
          </div>
        </aside>
      </div>
      <Newsletter />
    </>
  );
}

/* ── Analysis ── */
export function AnalysisPage() {
  const { t, lang } = useI18n();
  const [region, setRegion] = useState<'all' | Section>('all');
  const list = ARTICLES.filter((a) => a.type === 'analysis' && (region === 'all' || a.section === region)).sort(byDate);
  return (
    <>
      <PageHero kicker={t.home.analysisBand} title={t.analysisPage.title} intro={t.analysisPage.intro}>
        <div className="mt-8">
          <Chips label={t.analysisPage.title} value={region} onChange={setRegion} options={[{ v: 'all', l: t.ui.all }, ...SECTIONS.map((s) => ({ v: s, l: t.nav[s] }))]} />
        </div>
      </PageHero>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6" key={region}>
        {list.length === 0 && <p className="rounded-lg border border-dashed border-line p-10 text-center text-muted">{t.ui.noResults}</p>}
        {list.map((a) => (
          <article key={a.slug} className="group fade-up grid gap-6 border-b border-line py-10 first:pt-0 last:border-0 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-center">
            <Link to={`/article/${a.slug}`} tabIndex={-1} aria-hidden className="block overflow-hidden rounded-lg">
              <Cover art={a.art} section={a.section} className="aspect-[4/3]" />
            </Link>
            <div>
              <div className="mb-3 flex items-center gap-2">
                <SectionTag section={a.section} />
                <span className="label text-muted">{t.desks[a.desk].t}</span>
              </div>
              <h2 className="text-2xl font-bold leading-snug text-heading sm:text-3xl">
                <Link to={`/article/${a.slug}`} className="headline-link">
                  {a.i18n[lang].title}
                </Link>
              </h2>
              <p className="mt-3 leading-relaxed text-muted">{a.i18n[lang].excerpt}</p>
              <MetaLine a={a} className="mt-4" />
            </div>
          </article>
        ))}
      </div>
      <Newsletter />
    </>
  );
}

/* ── Videos ── */
export function VideosPage({ onPlay }: { onPlay: (v: Video) => void }) {
  const { t } = useI18n();
  const [region, setRegion] = useState<'all' | Section>('all');
  const list = VIDEOS.filter((v) => region === 'all' || v.section === region).sort(byDate);
  return (
    <>
      <section className="bg-[#081c35]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="label mb-3 text-gold">{t.home.videosBand}</p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">{t.videosPage.title}</h1>
          <span className="mt-5 block h-1 w-16 bg-gold" aria-hidden />
          <p className="mt-5 max-w-2xl text-lg text-paper/75">{t.videosPage.intro}</p>
          <div className="mt-8 [&_button[aria-selected=false]]:border-white/20 [&_button[aria-selected=false]]:text-paper/75 [&_button[aria-selected=true]]:border-gold [&_button[aria-selected=true]]:bg-gold [&_button[aria-selected=true]]:text-navy">
            <Chips label={t.videosPage.title} value={region} onChange={setRegion} options={[{ v: 'all', l: t.ui.all }, ...SECTIONS.map((s) => ({ v: s, l: t.nav[s] }))]} />
          </div>
          <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3" key={region}>
            {list.map((v, i) => (
              <div key={v.id} className={`fade-up ${i === 0 && region === 'all' ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2' : ''}`}>
                <VideoCard v={v} big={i === 0 && region === 'all'} onPlay={onPlay} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <Newsletter />
    </>
  );
}

export function VideoModal({ video, onClose }: { video: Video | null; onClose: () => void }) {
  const { t, lang } = useI18n();
  useEffect(() => {
    if (!video) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [video, onClose]);
  if (!video) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={video.title[lang]} onClick={onClose}>
      <div className="fade-up w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <p className="label text-gold">
              {t.nav[video.section]} · <span dir="ltr">{video.duration}</span>
            </p>
            <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">{video.title[lang]}</h2>
          </div>
          <button autoFocus type="button" onClick={onClose} className="shrink-0 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-gold hover:text-navy">
            {t.ui.close}
          </button>
        </div>
        <div className="overflow-hidden rounded-lg bg-black shadow-2xl">
          {video.youtubeId ? (
            <iframe
              className="aspect-video w-full"
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&hl=${lang}`}
              title={video.title[lang]}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <Cover art={video.art} section={video.section} className="aspect-video">
              <div className="absolute inset-0 grid place-items-center p-6 text-center">
                <div className="max-w-sm rounded-lg bg-navy/85 p-6 backdrop-blur">
                  <Logo size="sm" reversed />
                  <p className="mt-4 text-sm text-paper/85">{t.ui.videoSoon}</p>
                </div>
              </div>
            </Cover>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Article ── */
function ShareBar({ title }: { title: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const enc = encodeURIComponent;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };
  const btn = 'grid h-9 w-9 place-items-center rounded-full border border-line text-heading transition hover:border-gold hover:bg-gold hover:text-navy';
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="label me-1 text-muted">{t.ui.share}</span>
      <a className={btn} href={`https://x.com/intent/post?text=${enc(title)}&url=${enc(url)}`} target="_blank" rel="noopener noreferrer" aria-label="X">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.36 5.77L17.75 3Zm-1.08 16.17h1.7L7.4 4.74H5.58l11.09 14.43Z" />
        </svg>
      </a>
      <a className={btn} href={`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
        <Facebook size={15} />
      </a>
      <a className={btn} href={`https://wa.me/?text=${enc(`${title} ${url}`)}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
        </svg>
      </a>
      <a className={btn} href={`https://t.me/share/url?url=${enc(url)}&text=${enc(title)}`} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
        <Send size={14} />
      </a>
      <button type="button" className={btn} onClick={copy} aria-label={t.ui.copyLink} title={t.ui.copyLink}>
        {copied ? <Check size={15} className="text-verified" /> : <Link2 size={15} />}
      </button>
      <span role="status" className={`text-xs font-medium text-verified transition-opacity ${copied ? 'opacity-100' : 'opacity-0'}`}>
        {t.ui.copied}
      </span>
    </div>
  );
}

const SIZES = ['text-base', 'text-[17px]', 'text-lg', 'text-xl'];

export function ArticlePage({ a }: { a: Article }) {
  const { t, lang } = useI18n();
  const c = a.i18n[lang];
  const [progress, setProgress] = useState(0);
  const [size, setSize] = useState(() => {
    try {
      const v = Number(localStorage.getItem('afrivue-textsize'));
      return Number.isInteger(v) && v >= 0 && v < SIZES.length ? v : 1;
    } catch {
      return 1;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem('afrivue-textsize', String(size));
    } catch {
      /* ignore */
    }
  }, [size]);
  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById('article-body');
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      setProgress(Math.min(1, Math.max(0, (-r.top + window.innerHeight * 0.3) / Math.max(total, 1))));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [a.slug]);

  const related = useMemo(() => {
    const same = ARTICLES.filter((x) => x.slug !== a.slug && x.section === a.section);
    const other = ARTICLES.filter((x) => x.slug !== a.slug && x.section !== a.section).sort(byDate);
    return [...same, ...other].slice(0, 3);
  }, [a.slug, a.section]);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[45] h-1 bg-transparent" aria-hidden>
        <div className="h-full bg-gold transition-[width] duration-150 ltr:origin-left" style={{ width: `${progress * 100}%`, marginInlineStart: 0 }} />
      </div>

      <article className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-12">
        <nav aria-label="Breadcrumb" className="label mb-6 flex items-center gap-2 text-muted">
          <Link to="/" className="hover:text-heading">
            {t.nav.home}
          </Link>
          <span aria-hidden>/</span>
          <Link to={`/${a.section}`} className="hover:text-heading">
            {t.nav[a.section]}
          </Link>
          {a.type === 'analysis' && (
            <>
              <span aria-hidden>/</span>
              <Link to="/analysis" className="hover:text-heading">
                {t.nav.analysis}
              </Link>
            </>
          )}
        </nav>

        <header className="mx-auto max-w-3xl">
          <div className="mb-4 flex items-center gap-2">
            <SectionTag section={a.section} />
            {a.verified && <VerifiedBadge />}
          </div>
          <h1 className="text-[2rem] font-bold leading-[1.15] tracking-tight text-heading sm:text-[2.6rem]">{c.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted sm:text-xl">{c.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-navy text-sm font-bold text-gold" aria-hidden dir="ltr">
                AV
              </span>
              <div>
                <p className="text-sm font-semibold text-heading">
                  {t.ui.by} {t.desks[a.desk].t}
                </p>
                <p className="text-xs text-muted">
                  <time dateTime={a.date}>{formatDate(a.date, lang, { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</time> · {a.readMin} {t.ui.minRead}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1" role="group" aria-label={t.ui.textSize}>
              <span className="label me-2 text-muted">{t.ui.textSize}</span>
              <button type="button" onClick={() => setSize((s) => Math.max(0, s - 1))} disabled={size === 0} className="grid h-8 w-8 place-items-center rounded-full border border-line text-heading hover:border-gold disabled:opacity-40" aria-label="A-">
                <Minus size={14} />
              </button>
              <button type="button" onClick={() => setSize((s) => Math.min(SIZES.length - 1, s + 1))} disabled={size === SIZES.length - 1} className="grid h-8 w-8 place-items-center rounded-full border border-line text-heading hover:border-gold disabled:opacity-40" aria-label="A+">
                <Plus size={14} />
              </button>
            </div>
          </div>
        </header>

        <Cover art={a.art} section={a.section} className="mx-auto mt-8 aspect-[16/8] max-w-5xl rounded-lg" />

        <div id="article-body" className="mx-auto mt-10 max-w-3xl">
          <div className={`prose-article leading-[1.8] text-fg ${SIZES[size]}`}>
            {c.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-10 border-t border-line pt-6">
            <ShareBar title={c.title} />
          </div>
          <Link to={`/${a.section}`} className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-heading">
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
            {t.sections[a.section].title}
          </Link>
        </div>
      </article>

      <section aria-labelledby="related-title" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeading id="related-title">{t.ui.related}</SectionHeading>
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((r) => (
            <ArticleCard key={r.slug} a={r} />
          ))}
        </div>
      </section>
      <Newsletter />
    </>
  );
}

/* ── About ── */
export function AboutPage() {
  const { t } = useI18n();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err: typeof errors = {};
    if (!form.name.trim()) err.name = t.about.required;
    if (!form.email.trim()) err.email = t.about.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) err.email = t.about.invalidEmail;
    if (!form.message.trim()) err.message = t.about.required;
    setErrors(err);
    if (Object.keys(err).length) {
      document.getElementById(`f-${Object.keys(err)[0]}`)?.focus();
      return;
    }
    // TODO: connect to your backend / form service (Formspree, Netlify Forms, etc.)
    setSent(true);
  };

  const field = (k: keyof typeof form, label: string, type = 'text', textarea = false) => (
    <div className={textarea ? 'sm:col-span-2' : ''}>
      <label htmlFor={`f-${k}`} className="mb-1.5 block text-sm font-medium text-heading">
        {label}
        {k !== 'subject' && <span className="text-terracotta"> *</span>}
      </label>
      {textarea ? (
        <textarea
          id={`f-${k}`}
          rows={5}
          value={form[k]}
          onChange={(e) => setForm({ ...form, [k]: e.target.value })}
          aria-invalid={!!errors[k]}
          aria-describedby={errors[k] ? `e-${k}` : undefined}
          className={`w-full rounded-lg border bg-bg px-4 py-3 text-fg outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30 ${errors[k] ? 'border-terracotta' : 'border-line'}`}
        />
      ) : (
        <input
          id={`f-${k}`}
          type={type}
          value={form[k]}
          autoComplete={k === 'email' ? 'email' : k === 'name' ? 'name' : undefined}
          onChange={(e) => setForm({ ...form, [k]: e.target.value })}
          aria-invalid={!!errors[k]}
          aria-describedby={errors[k] ? `e-${k}` : undefined}
          className={`h-12 w-full rounded-lg border bg-bg px-4 text-fg outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30 ${errors[k] ? 'border-terracotta' : 'border-line'}`}
        />
      )}
      {errors[k] && (
        <p id={`e-${k}`} className="mt-1 text-xs font-medium text-terracotta" role="alert">
          {errors[k]}
        </p>
      )}
    </div>
  );

  return (
    <>
      <section className="relative overflow-hidden bg-navy text-paper">
        <div className="pointer-events-none absolute -end-32 -top-32 h-96 w-96 rounded-full border-[56px] border-gold/10" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="label mb-4 text-gold">{t.about.kicker}</p>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">{t.about.title}</h1>
            <span className="mt-6 block h-1 w-16 bg-gold" aria-hidden />
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/85">{t.about.mission}</p>
          </div>
          <div className="lg:col-span-5">
            <dl className="grid grid-cols-3 gap-3">
              {t.about.stats.map((s) => (
                <div key={s.l} className="rounded-lg border border-white/10 bg-white/5 p-4 text-center">
                  <dt className="sr-only">{s.l}</dt>
                  <dd>
                    <span className="block text-3xl font-bold text-gold" dir="ltr">
                      {s.n}
                    </span>
                    <span className="mt-1 block text-xs text-paper/75">{s.l}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6" aria-labelledby="values-title">
        <SectionHeading id="values-title">{t.about.valuesTitle}</SectionHeading>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.about.values.map((v, i) => (
            <div key={v.t} className="rounded-lg border border-line bg-surface p-6 transition hover:-translate-y-1 hover:border-gold hover:shadow-lg">
              <span className="text-sm font-bold text-gold" dir="ltr">
                0{i + 1}
              </span>
              <h3 className="mt-3 text-lg font-bold text-heading">{v.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface py-14" aria-labelledby="team-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading id="team-title">{t.about.teamTitle}</SectionHeading>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {(['chad', 'sahel', 'africa', 'analysis', 'video'] as const).map((d) => (
              <div key={d} className="rounded-lg border border-line bg-bg p-6">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-navy text-gold dark:bg-gold dark:text-navy">
                  <MapPin size={20} aria-hidden />
                </span>
                <h3 className="mt-4 font-bold text-heading">{t.desks[d].t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{t.desks[d].d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 sm:px-6" aria-labelledby="contact-title">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading id="contact-title">{t.about.contactTitle}</SectionHeading>
            <p className="text-muted">{t.about.contactText}</p>
            <a href={`mailto:${SITE.email}`} className="mt-6 inline-flex items-center gap-3 rounded-lg border border-line bg-surface px-4 py-3 font-medium text-heading hover:border-gold">
              <Mail size={18} className="text-gold" aria-hidden />
              <span dir="ltr">{SITE.email}</span>
            </a>
            <div className="mt-6 text-heading">
              <p className="label mb-2 text-muted">{t.footer.follow}</p>
              <SocialLinks className="-ms-1.5" />
            </div>
          </div>
          <div className="lg:col-span-8">
            {sent ? (
              <div className="fade-up flex items-center gap-3 rounded-lg bg-verified px-6 py-8 text-lg font-medium text-white" role="status">
                <Check size={24} aria-hidden /> {t.about.sent}
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="grid gap-5 rounded-xl border border-line bg-surface p-6 sm:grid-cols-2 sm:p-8">
                {field('name', t.about.name)}
                {field('email', t.about.email, 'email')}
                <div className="sm:col-span-2">{field('subject', t.about.subject)}</div>
                {field('message', t.about.message, 'text', true)}
                <div className="sm:col-span-2">
                  <button type="submit" className="inline-flex h-12 items-center gap-2 rounded-full bg-gold px-8 font-semibold text-navy transition hover:bg-navy hover:text-white dark:hover:bg-white dark:hover:text-navy">
                    <Send size={16} className="rtl:-scale-x-100" aria-hidden /> {t.about.send}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

/* ── 404 ── */
export function NotFound() {
  const { t } = useI18n();
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <p className="text-8xl font-bold text-gold" dir="ltr">
        404
      </p>
      <h1 className="mt-4 text-3xl font-bold text-heading">{t.notFound.title}</h1>
      <p className="mt-3 text-muted">{t.notFound.text}</p>
      <Link to="/" className="mt-8 rounded-full bg-gold px-7 py-3 font-semibold text-navy hover:bg-navy hover:text-white">
        {t.ui.backHome}
      </Link>
    </section>
  );
}
