import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Check, Mail, Send } from 'lucide-react';
import { AFRICA_REGIONS, ANALYSIS_FORMATS, AUTHORS, MEDIA, SITE, sortedArticles, type Article, type AuthorId, type Format, type Media, type MediaType, type Region, type Topic } from '../data';
import { useI18n } from '../i18n';
import { Link } from '../router';
import { Avatar, Chips, Cover, Logo, MediaCard, SocialLinks, StoryCard, StoryRow } from '../components/ui';
import { useModal } from '../components/layout';
import { ReportFeature, Wrap } from './Home';

/* ── Page hero ── */
function PageHero({ kicker, title, intro, children, dark = false }: { kicker?: string; title: string; intro?: string; children?: ReactNode; dark?: boolean }) {
  return (
    <section className={dark ? 'bg-navy-950' : 'border-b border-line'}>
      <Wrap className="pb-6 pt-10 sm:pt-14">
        {kicker && <p className={`kicker ${dark ? 'text-emerald-300' : 'text-accent'}`}>{kicker}</p>}
        <h1 className={`font-display mt-2 text-[2.6rem] font-bold leading-[1.05] sm:text-[3.4rem] ${dark ? 'text-white' : 'text-heading'}`}>{title}</h1>
        {intro && <p className={`mt-4 max-w-2xl text-[1.1rem] leading-relaxed ${dark ? 'text-white/70' : 'text-muted'}`}>{intro}</p>}
        {children && <div className="mt-7">{children}</div>}
      </Wrap>
    </section>
  );
}

const Empty = () => {
  const { t } = useI18n();
  return <p className="border border-dashed border-line p-10 text-center text-muted">{t.ui.noResults}</p>;
};

/* ── Story listing: lead + side + grid + most read ── */
function Listing({ items }: { items: Article[] }) {
  const { t } = useI18n();
  const mostRead = useMemo(() => [...items].sort((a, b) => b.views - a.views).slice(0, 5), [items]);
  if (!items.length)
    return (
      <Wrap className="py-12">
        <Empty />
      </Wrap>
    );
  const [lead, ...rest] = items;
  return (
    <Wrap className="py-10">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <StoryCard a={lead} variant="feature" />
          {rest.length > 0 && (
            <div className="mt-12 grid gap-x-6 gap-y-10 border-t border-line pt-10 sm:grid-cols-2">
              {rest.map((a) => (
                <StoryCard key={a.slug} a={a} />
              ))}
            </div>
          )}
        </div>
        <aside className="lg:col-span-4">
          <div className="border-t-[3px] border-navy pt-3 lg:sticky lg:top-20 dark:border-emerald">
            <h2 className="font-display mb-5 text-xl font-bold text-heading">{t.ui.mostRead}</h2>
            {mostRead.map((a, i) => (
              <StoryRow key={a.slug} a={a} n={i + 1} thumb />
            ))}
          </div>
        </aside>
      </div>
    </Wrap>
  );
}

/* ── Chad ── */
export function ChadPage() {
  const { t } = useI18n();
  const all = useMemo(() => sortedArticles().filter((a) => a.region === 'chad'), []);
  const topics = (['politics', 'economy', 'society', 'development', 'culture', 'sports', 'technology'] as Topic[]).filter((tp) => all.some((a) => a.topic === tp));
  const [tp, setTp] = useState<'all' | Topic>('all');
  return (
    <>
      <PageHero kicker={`${all.length} ${t.ui.stories}`} title={t.nav.chad} intro={t.intros.chad}>
        <Chips label={t.nav.chad} value={tp} onChange={setTp} options={[{ v: 'all' as const, l: t.ui.all }, ...topics.map((x) => ({ v: x, l: t.nav[x] }))]} />
      </PageHero>
      <div key={tp}>
        <Listing items={all.filter((a) => tp === 'all' || a.topic === tp)} />
      </div>
    </>
  );
}

/* ── Africa (regional filter) ── */
export function AfricaPage({ initial }: { initial?: Region }) {
  const { t } = useI18n();
  const all = useMemo(() => sortedArticles().filter((a) => a.region !== 'chad'), []);
  const [r, setR] = useState<'all' | Region>(initial && AFRICA_REGIONS.includes(initial) ? initial : 'all');
  return (
    <>
      <PageHero kicker={t.home.africaToday} title={t.nav.africa} intro={t.intros.africa}>
        <Chips label={t.ui.region} value={r} onChange={setR} options={[{ v: 'all' as const, l: t.ui.all }, ...AFRICA_REGIONS.map((x) => ({ v: x, l: t.regions[x] }))]} />
      </PageHero>
      <div key={r}>
        <Listing items={all.filter((a) => r === 'all' || a.region === r)} />
      </div>
    </>
  );
}

/* ── Topic (Politics, Economy, …) ── */
export function TopicPage({ topic }: { topic: Topic }) {
  const { t } = useI18n();
  const all = useMemo(() => sortedArticles().filter((a) => a.topic === topic || (topic === 'society' && a.topic === 'development')), [topic]);
  const [scope, setScope] = useState<'all' | 'chad' | 'africa'>('all');
  return (
    <>
      <PageHero kicker={`${all.length} ${t.ui.stories}`} title={t.nav[topic]} intro={t.intros[topic]}>
        <Chips
          label={t.ui.region}
          value={scope}
          onChange={setScope}
          options={[
            { v: 'all', l: t.ui.all },
            { v: 'chad', l: t.nav.chad },
            { v: 'africa', l: t.nav.africa },
          ]}
        />
      </PageHero>
      <div key={scope}>
        <Listing items={all.filter((a) => scope === 'all' || (scope === 'chad' ? a.region === 'chad' : a.region !== 'chad'))} />
      </div>
    </>
  );
}

/* ── Analysis ── */
export function AnalysisPage() {
  const { t, lang } = useI18n();
  const all = useMemo(() => sortedArticles().filter((a) => ANALYSIS_FORMATS.includes(a.format)), []);
  const [f, setF] = useState<'all' | Format>('all');
  const contributors = [...new Set(all.map((a) => a.author))].map((id) => AUTHORS[id]).filter((a) => !a.desk);
  return (
    <>
      <PageHero dark kicker={t.home.analysis} title={t.nav.analysis} intro={t.intros.analysis}>
        <ul className="mb-8 flex flex-wrap gap-x-8 gap-y-4">
          {contributors.map((au) => (
            <li key={au.id}>
              <Link to={`/author/${au.id}`} className="group flex items-center gap-3">
                <Avatar author={au} size="md" ring />
                <span className="text-[13px] leading-tight">
                  <span className="block font-semibold text-white group-hover:underline">{au.name[lang]}</span>
                  <span className="text-white/55">{au.role[lang]}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Chips light label={t.ui.type} value={f} onChange={setF} options={[{ v: 'all' as const, l: t.ui.all }, ...ANALYSIS_FORMATS.map((x) => ({ v: x, l: t.formats[x] }))]} />
      </PageHero>
      <div key={f}>
        <Listing items={all.filter((a) => f === 'all' || a.format === f)} />
      </div>
    </>
  );
}

/* ── In Depth (special reports) ── */
export function InDepthPage() {
  const { t } = useI18n();
  const reports = useMemo(() => sortedArticles().filter((a) => a.format === 'report'), []);
  return (
    <>
      <PageHero kicker={t.home.specialReports} title={t.nav.indepth} intro={t.intros.indepth} />
      <Wrap className="space-y-16 py-14">{reports.length ? reports.map((a, i) => <ReportFeature key={a.slug} a={a} flip={i % 2 === 1} />) : <Empty />}</Wrap>
    </>
  );
}

/* ── Video / multimedia ── */
export function VideoPage({ onOpen }: { onOpen: (m: Media) => void }) {
  const { t } = useI18n();
  const [type, setType] = useState<'all' | MediaType>('all');
  const list = MEDIA.filter((m) => type === 'all' || m.type === type);
  return (
    <section className="bg-navy-950 pb-16">
      <PageHero dark kicker={t.home.multimedia} title={t.nav.video} intro={t.intros.video}>
        <Chips light label={t.ui.type} value={type} onChange={setType} options={[{ v: 'all' as const, l: t.ui.all }, ...(['video', 'interview', 'podcast', 'photo'] as MediaType[]).map((m) => ({ v: m, l: t.media[m] }))]} />
      </PageHero>
      <Wrap className="pt-6">
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3" key={type}>
          {list.map((m, i) => (
            <div key={m.id} className={`fade-in ${i === 0 ? 'sm:col-span-2 lg:row-span-2' : ''}`}>
              <MediaCard m={m} big={i === 0} onOpen={onOpen} />
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

export function MediaModal({ m, onClose }: { m: Media | null; onClose: () => void }) {
  const { t, lang } = useI18n();
  useModal(!!m, onClose);
  if (!m) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-4" role="dialog" aria-modal="true" aria-label={m.title[lang]} onClick={onClose}>
      <div className="fade-in w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <p className="kicker text-emerald-300">
              {t.media[m.type]} · <span dir="ltr">{m.type === 'photo' ? `${m.duration} ${t.media.photos}` : m.duration}</span>
            </p>
            <h2 className="font-display mt-1 text-xl font-semibold text-white sm:text-2xl">{m.title[lang]}</h2>
          </div>
          <button autoFocus type="button" onClick={onClose} className="shrink-0 border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white hover:text-navy">
            {t.ui.close}
          </button>
        </div>
        {m.youtubeId ? (
          <iframe
            className="aspect-video w-full bg-black"
            src={`https://www.youtube-nocookie.com/embed/${m.youtubeId}?autoplay=1&hl=${lang}`}
            title={m.title[lang]}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <Cover art={m.art} region={m.region} className="aspect-video">
            <div className="absolute inset-0 grid place-items-center bg-navy/50 p-6 text-center">
              <div className="max-w-sm">
                <Logo size="sm" reversed />
                <p className="mt-4 text-sm text-white/85">{t.demo.notice}</p>
              </div>
            </div>
          </Cover>
        )}
      </div>
    </div>
  );
}

/* ── Author ── */
export function AuthorPage({ id }: { id: AuthorId }) {
  const { t, lang } = useI18n();
  const au = AUTHORS[id];
  const items = useMemo(() => sortedArticles().filter((a) => a.author === id), [id]);
  return (
    <>
      <section className="border-b border-line">
        <Wrap className="flex flex-col gap-6 py-12 sm:flex-row sm:items-center">
          <Avatar author={au} size="xl" />
          <div>
            <p className="kicker text-accent">{au.desk ? t.author.desk : t.author.contributor}</p>
            <h1 className="font-display mt-1 text-4xl font-bold text-heading">{au.name[lang]}</h1>
            <p className="mt-1 text-muted">{au.role[lang]}</p>
            <p className="mt-3 max-w-2xl leading-relaxed text-fg">{au.bio[lang]}</p>
          </div>
        </Wrap>
      </section>
      <Wrap className="py-12">
        <h2 className="kicker mb-6 text-heading">
          {t.author.articles} ({items.length})
        </h2>
        {items.length ? (
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((a) => (
              <StoryCard key={a.slug} a={a} />
            ))}
          </div>
        ) : (
          <Empty />
        )}
      </Wrap>
    </>
  );
}

/* ── Policy pages ── */
export function PolicyPage({ k }: { k: 'corrections' | 'privacy' | 'terms' }) {
  const { t } = useI18n();
  const p = t.policies[k];
  return (
    <>
      <PageHero kicker="AfriVue Info" title={p.title} />
      <Wrap className="py-12">
        <div className="font-reading max-w-[700px] space-y-5 text-[18px] leading-relaxed text-fg">
          {p.body.map((x) => (
            <p key={x}>{x}</p>
          ))}
        </div>
      </Wrap>
    </>
  );
}

/* ── About ── */
export function AboutPage() {
  const { t, lang } = useI18n();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [sent, setSent] = useState(false);
  const team = Object.values(AUTHORS);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err: typeof errors = {};
    if (!form.name.trim()) err.name = t.about.required;
    if (!form.email.trim()) err.email = t.about.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) err.email = t.newsletter.invalid;
    if (!form.message.trim()) err.message = t.about.required;
    setErrors(err);
    if (Object.keys(err).length) return document.getElementById(`f-${Object.keys(err)[0]}`)?.focus();
    // TODO: connect to a backend or form service (Formspree, Netlify Forms…)
    setSent(true);
  };

  const field = (k: keyof typeof form, label: string, type = 'text', area = false) => {
    const cls = `w-full border bg-bg px-4 text-fg outline-none transition-colors focus:border-navy dark:focus:border-emerald ${errors[k] ? 'border-terracotta' : 'border-line'}`;
    const common = {
      id: `f-${k}`,
      value: form[k],
      'aria-invalid': !!errors[k],
      'aria-describedby': errors[k] ? `e-${k}` : undefined,
    };
    return (
      <div className={area || k === 'subject' ? 'sm:col-span-2' : ''}>
        <label htmlFor={`f-${k}`} className="mb-1.5 block text-sm font-medium text-heading">
          {label}
          {k !== 'subject' && <span className="text-terracotta"> *</span>}
        </label>
        {area ? (
          <textarea {...common} rows={5} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className={`${cls} py-3`} />
        ) : (
          <input {...common} type={type} autoComplete={k === 'email' ? 'email' : k === 'name' ? 'name' : undefined} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className={`${cls} h-12`} />
        )}
        {errors[k] && (
          <p id={`e-${k}`} className="mt-1 text-xs font-medium text-terracotta" role="alert">
            {errors[k]}
          </p>
        )}
      </div>
    );
  };

  return (
    <>
      <section className="bg-navy">
        <Wrap className="grid gap-10 py-16 sm:py-20 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="kicker text-emerald-300">{t.about.kicker}</p>
            <h1 className="font-display mt-3 text-[2.6rem] font-bold leading-[1.06] text-white sm:text-[3.4rem]">{t.about.title}</h1>
            <p className="font-display mt-6 max-w-2xl text-[1.3rem] leading-relaxed text-white/80">{t.about.mission}</p>
          </div>
          <div className="flex items-end lg:col-span-4 lg:justify-end">
            <p className="font-display text-2xl italic text-emerald-300">{t.meta.tagline}</p>
          </div>
        </Wrap>
      </section>

      <Wrap className="py-16">
        <h2 className="font-display border-t-[3px] border-navy pt-4 text-[2rem] font-bold text-heading dark:border-emerald">{t.about.valuesTitle}</h2>
        <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {t.about.values.map((v, i) => (
            <div key={v.t}>
              <span className="text-sm font-semibold tabular-nums text-accent" dir="ltr">
                0{i + 1}
              </span>
              <h3 className="font-display mt-2 text-xl font-bold text-heading">{v.t}</h3>
              <p className="mt-2 leading-relaxed text-muted">{v.d}</p>
            </div>
          ))}
        </div>
      </Wrap>

      <section id="team" className="scroll-mt-20 border-y border-line bg-surface">
        <Wrap className="py-16">
          <h2 className="font-display border-t-[3px] border-navy pt-4 text-[2rem] font-bold text-heading dark:border-emerald">{t.about.teamTitle}</h2>
          <p className="mt-2 text-sm text-muted">{t.about.teamNote}</p>
          <ul className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((au) => (
              <li key={au.id}>
                <Link to={`/author/${au.id}`} className="group flex items-start gap-4">
                  <Avatar author={au} size="lg" />
                  <span>
                    <span className="font-display block text-lg font-bold text-heading group-hover:underline">{au.name[lang]}</span>
                    <span className="block text-sm text-accent">{au.role[lang]}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Wrap>
      </section>

      <section id="contact" className="scroll-mt-20">
        <Wrap className="grid gap-12 py-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="font-display border-t-[3px] border-navy pt-4 text-[2rem] font-bold text-heading dark:border-emerald">{t.about.contactTitle}</h2>
            <p className="mt-3 text-muted">{t.about.contactText}</p>
            <a href={`mailto:${SITE.email}`} className="mt-6 inline-flex items-center gap-3 font-medium text-heading hover:text-accent">
              <Mail size={18} className="text-emerald" aria-hidden />
              <span dir="ltr">{SITE.email}</span>
            </a>
            <div className="mt-8">
              <p className="kicker mb-2 text-muted">{t.ui.followUs}</p>
              <SocialLinks className="-ms-2 text-heading" itemClass="h-9 w-9 opacity-75 hover:opacity-100" size={16} />
            </div>
          </div>
          <div className="lg:col-span-8">
            {sent ? (
              <p className="fade-in flex items-center gap-3 border-s-[3px] border-emerald bg-surface px-6 py-8 text-lg font-medium text-heading" role="status">
                <Check size={22} className="text-emerald" aria-hidden /> {t.about.sent}
              </p>
            ) : (
              <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
                {field('name', t.about.name)}
                {field('email', t.about.email, 'email')}
                {field('subject', t.about.subject)}
                {field('message', t.about.message, 'text', true)}
                <div className="sm:col-span-2">
                  <button type="submit" className="inline-flex h-12 items-center gap-2 bg-navy px-8 font-semibold text-white transition-colors hover:bg-emerald-700 dark:bg-emerald dark:text-navy">
                    <Send size={16} className="rtl:-scale-x-100" aria-hidden /> {t.about.send}
                  </button>
                </div>
              </form>
            )}
          </div>
        </Wrap>
      </section>
    </>
  );
}

/* ── 404 ── */
export function NotFound() {
  const { t } = useI18n();
  return (
    <Wrap className="flex flex-col items-center py-24 text-center">
      <p className="font-display text-8xl font-bold text-emerald" dir="ltr">
        404
      </p>
      <h1 className="font-display mt-4 text-3xl font-bold text-heading">{t.notFound.title}</h1>
      <p className="mt-3 text-muted">{t.notFound.text}</p>
      <Link to="/" className="mt-8 bg-navy px-7 py-3 font-semibold text-white hover:bg-emerald-700">
        {t.ui.backHome}
      </Link>
    </Wrap>
  );
}
