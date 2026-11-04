import { useMemo, useState } from 'react';
import { ArrowRight, Camera, Play } from 'lucide-react';
import { AFRICA_REGIONS, ANALYSIS_FORMATS, AUTHORS, MEDIA, NAV_TOPICS, sortedArticles, type Article, type Media, type MediaType, type Region, type Topic } from '../data';
import { useI18n } from '../i18n';
import { Link } from '../router';
import { Avatar, Byline, Chips, Cover, MediaCard, SectionHeader, StoryCard, StoryRow } from '../components/ui';
import { navPath } from '../components/layout';

export function ViewAll({ to, light = false, label }: { to: string; light?: boolean; label?: string }) {
  const { t } = useI18n();
  return (
    <Link to={to} className={`group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold ${light ? 'text-emerald-300 hover:text-white' : 'text-accent hover:text-heading'}`}>
      {label ?? t.ui.viewAll}
      <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
    </Link>
  );
}

const Wrap = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => <div className={`mx-auto max-w-[1320px] px-4 sm:px-6 ${className}`}>{children}</div>;

/* ── Lead story ── */
function LeadStory({ a }: { a: Article }) {
  const { lang, t } = useI18n();
  const c = a.i18n[lang];
  const au = AUTHORS[a.author];
  return (
    <article className="group fade-in">
      <Link to={`/article/${a.slug}`} tabIndex={-1} aria-hidden className="block">
        <Cover art={a.art} region={a.region} image={a.image} className="aspect-[3/2]">
          <span className="kicker absolute bottom-0 start-0 bg-emerald-700 px-3.5 py-2 text-white">
            {a.region === 'chad' ? t.regions.chad : t.nav[a.topic]} / {a.format !== 'news' ? t.formats[a.format] : a.region === 'chad' ? t.nav[a.topic] : t.regions[a.region]}
          </span>
        </Cover>
      </Link>
      <h1 className="font-display mt-5 text-[2.1rem] font-bold leading-[1.08] text-heading sm:text-[2.9rem] lg:text-[3.1rem]">
        <Link to={`/article/${a.slug}`} className="hl">
          {c.title}
        </Link>
      </h1>
      <p className="mt-4 max-w-2xl text-[1.1rem] leading-relaxed text-muted">{c.excerpt}</p>
      <div className="mt-5 flex items-center gap-3">
        <Avatar author={au} size="md" />
        <Byline a={a} />
      </div>
    </article>
  );
}

/* ── Analysis card (navy band) ── */
function AnalysisCard({ a }: { a: Article }) {
  const { t, lang } = useI18n();
  const au = AUTHORS[a.author];
  return (
    <article className="group flex flex-col border-t border-white/15 pt-5">
      <p className="kicker text-emerald-300">{t.formats[a.format]}</p>
      <h3 className="font-display mt-2 text-[1.35rem] font-semibold leading-snug text-white">
        <Link to={`/article/${a.slug}`} className="hl">
          {a.i18n[lang].title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-white/65">{a.i18n[lang].excerpt}</p>
      <div className="mt-auto flex items-center gap-3 pt-5">
        <Avatar author={au} size="md" ring />
        <div className="min-w-0 text-[13px] leading-tight">
          <Link to={`/author/${au.id}`} className="font-semibold text-white hover:underline">
            {au.name[lang]}
          </Link>
          <p className="mt-0.5 text-white/55">{au.role[lang]}</p>
          <p className="mt-0.5 text-white/45">
            {a.readMin} {t.ui.minRead}
          </p>
        </div>
      </div>
    </article>
  );
}

/* ── Special report feature ── */
export function ReportFeature({ a, flip = false }: { a: Article; flip?: boolean }) {
  const { t, lang } = useI18n();
  const au = AUTHORS[a.author];
  return (
    <article className="group grid items-center gap-6 md:grid-cols-2 md:gap-10">
      <Link to={`/article/${a.slug}`} tabIndex={-1} aria-hidden className={`block ${flip ? 'md:order-2' : ''}`}>
        <Cover art={a.art} region={a.region} image={a.image} className="aspect-[4/3]" />
      </Link>
      <div>
        <p className="kicker text-accent">
          {t.formats.report} <span className="text-muted">· {a.readMin} {t.ui.minRead}</span>
        </p>
        <h3 className="font-display mt-3 text-[1.9rem] font-bold leading-[1.12] text-heading sm:text-[2.3rem]">
          <Link to={`/article/${a.slug}`} className="hl">
            {a.i18n[lang].title}
          </Link>
        </h3>
        <p className="mt-4 text-[1.05rem] leading-relaxed text-muted">{a.i18n[lang].excerpt}</p>
        <div className="mt-5 flex items-center gap-3 text-[13px]">
          <Avatar author={au} size="md" />
          <span>
            <span className="block font-semibold text-heading">{au.name[lang]}</span>
            <span className="text-muted">{au.role[lang]}</span>
          </span>
        </div>
      </div>
    </article>
  );
}

export function Home({ onOpenMedia }: { onOpenMedia: (m: Media) => void }) {
  const { t } = useI18n();
  const all = useMemo(sortedArticles, []);
  const lead = all.find((a) => a.featured) ?? all[0];
  const secondary = all.filter((a) => a !== lead && a.format !== 'report' && a.region !== 'chad').slice(0, 2);
  const latest = all.filter((a) => a !== lead).slice(0, 6);

  // Chad Now
  const chadAll = all.filter((a) => a.region === 'chad' && a !== lead && (a.format === 'news' || a.format === 'background'));
  const chadTopics = (['politics', 'economy', 'society', 'development', 'culture', 'sports', 'technology'] as Topic[]).filter((tp) => chadAll.some((a) => a.topic === tp));
  const [chadTopic, setChadTopic] = useState<'all' | Topic>('all');
  const chad = chadAll.filter((a) => chadTopic === 'all' || a.topic === chadTopic);

  // Africa Today
  const [region, setRegion] = useState<'all' | Region>('all');
  const africa = all.filter((a) => a.region !== 'chad' && a.format !== 'report' && (region === 'all' ? !secondary.includes(a) : a.region === region));
  const mostRead = useMemo(() => [...all].sort((a, b) => b.views - a.views).slice(0, 5), [all]);

  const analyses = all.filter((a) => ANALYSIS_FORMATS.includes(a.format)).slice(0, 4);
  const reports = all.filter((a) => a.format === 'report').slice(0, 2);

  const [mType, setMType] = useState<'all' | MediaType>('all');
  const media = MEDIA.filter((m) => mType === 'all' || m.type === mType);

  return (
    <>
      {/* ═══ Top: lead · secondary · latest ═══ */}
      <Wrap className="pt-7 pb-14 lg:pt-9">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <LeadStory a={lead} />
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-1 lg:content-start">
            {secondary.map((a) => (
              <StoryCard key={a.slug} a={a} variant="compact" />
            ))}
          </div>
          <aside className="lg:col-span-3 lg:border-s lg:border-line lg:ps-8" aria-labelledby="latest-h">
            <div className="flex items-center justify-between border-t-[3px] border-navy pt-3 dark:border-emerald">
              <h2 id="latest-h" className="font-display text-2xl font-bold text-heading">
                {t.home.latest}
              </h2>
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
              </span>
            </div>
            <div className="mt-5">
              {latest.map((a, i) => (
                <StoryRow key={a.slug} a={a} n={i + 1} time />
              ))}
            </div>
          </aside>
        </div>
      </Wrap>

      {/* ═══ Chad Now ═══ */}
      <section aria-labelledby="chad-h" className="pb-16">
        <Wrap>
          <SectionHeader id="chad-h" title={t.home.chadNow} intro={t.home.chadNowIntro} action={<ViewAll to="/chad" />} />
          <div className="-mt-3 mb-7">
            <Chips label={t.home.chadNow} value={chadTopic} onChange={setChadTopic} options={[{ v: 'all' as const, l: t.ui.all }, ...chadTopics.map((tp) => ({ v: tp, l: t.nav[tp] }))]} />
          </div>
          {chad.length > 0 && (
            <div className="grid gap-8 lg:grid-cols-12" key={chadTopic}>
              <div className="lg:col-span-7">
                <StoryCard a={chad[0]} variant="feature" hideRegion />
              </div>
              <div className="lg:col-span-5">
                {chad.slice(1, 5).map((a) => (
                  <StoryRow key={a.slug} a={a} thumb time />
                ))}
              </div>
            </div>
          )}
        </Wrap>
      </section>

      {/* ═══ Analysis (navy) ═══ */}
      <section aria-labelledby="analysis-h" className="bg-navy py-16">
        <Wrap>
          <SectionHeader id="analysis-h" light title={t.home.analysis} intro={t.home.analysisIntro} action={<ViewAll to="/analysis" light />} />
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {analyses.map((a) => (
              <AnalysisCard key={a.slug} a={a} />
            ))}
          </div>
        </Wrap>
      </section>

      {/* ═══ Africa Today ═══ */}
      <section aria-labelledby="africa-h" className="py-16">
        <Wrap>
          <SectionHeader id="africa-h" title={t.home.africaToday} intro={t.home.africaTodayIntro} action={<ViewAll to="/africa" />} />
          <div className="-mt-3 mb-7">
            <Chips label={t.ui.region} value={region} onChange={setRegion} options={[{ v: 'all' as const, l: t.ui.all }, ...AFRICA_REGIONS.map((r) => ({ v: r, l: t.regions[r] }))]} />
          </div>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-9" key={region}>
              {africa.length === 0 ? (
                <p className="border border-dashed border-line p-10 text-center text-muted">{t.ui.noResults}</p>
              ) : (
                <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                  {africa.slice(0, 6).map((a) => (
                    <StoryCard key={a.slug} a={a} />
                  ))}
                </div>
              )}
            </div>
            <aside className="lg:col-span-3" aria-labelledby="mr-h">
              <div className="border-t-[3px] border-navy pt-3 lg:sticky lg:top-20 dark:border-emerald">
                <h2 id="mr-h" className="font-display mb-5 text-xl font-bold text-heading">
                  {t.ui.mostRead}
                </h2>
                {mostRead.map((a, i) => (
                  <StoryRow key={a.slug} a={a} n={i + 1} />
                ))}
              </div>
            </aside>
          </div>
        </Wrap>
      </section>

      {/* ═══ Special Reports ═══ */}
      <section aria-labelledby="reports-h" className="border-t border-line bg-surface py-16">
        <Wrap>
          <SectionHeader id="reports-h" title={t.home.specialReports} intro={t.home.specialReportsIntro} action={<ViewAll to="/in-depth" />} />
          <div className="space-y-14">
            {reports.map((a, i) => (
              <ReportFeature key={a.slug} a={a} flip={i % 2 === 1} />
            ))}
          </div>
        </Wrap>
      </section>

      {/* ═══ Multimedia ═══ */}
      <section aria-labelledby="media-h" className="bg-navy-950 py-16">
        <Wrap>
          <SectionHeader id="media-h" light title={t.home.multimedia} intro={t.home.multimediaIntro} action={<ViewAll to="/video" light />} />
          <div className="-mt-3 mb-7">
            <Chips light label={t.ui.type} value={mType} onChange={setMType} options={[{ v: 'all' as const, l: t.ui.all }, ...(['video', 'interview', 'podcast', 'photo'] as MediaType[]).map((m) => ({ v: m, l: t.media[m] }))]} />
          </div>
          {media.length > 0 && (
            <div className="grid gap-8 lg:grid-cols-12" key={mType}>
              <div className="lg:col-span-7">
                <MediaCard m={media[0]} big onOpen={onOpenMedia} />
              </div>
              <div className="grid content-start gap-6 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-2">
                {media.slice(1, 5).map((m) => (
                  <MediaCard key={m.id} m={m} onOpen={onOpenMedia} />
                ))}
              </div>
            </div>
          )}
        </Wrap>
      </section>

      {/* ═══ More sections ═══ */}
      <section aria-labelledby="more-h" className="py-16">
        <Wrap>
          <SectionHeader id="more-h" title={t.home.sections} />
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {NAV_TOPICS.map((tp) => {
              const items = all.filter((a) => a.topic === tp && a.format !== 'report').slice(0, 3);
              if (!items.length) return null;
              return (
                <div key={tp}>
                  <div className="mb-4 flex items-center justify-between border-b border-line pb-2">
                    <h3 className="kicker text-heading">
                      <Link to={navPath(tp)} className="hover:text-accent">
                        {t.nav[tp]}
                      </Link>
                    </h3>
                    <ViewAll to={navPath(tp)} />
                  </div>
                  <StoryCard a={items[0]} variant="compact" />
                  <div className="mt-5">
                    {items.slice(1).map((a) => (
                      <StoryRow key={a.slug} a={a} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Wrap>
      </section>

      {/* ═══ Social embeds (reserved) ═══ */}
      <section aria-labelledby="social-h" className="pb-16">
        <Wrap>
          <SectionHeader id="social-h" title={t.home.social} intro={t.home.socialIntro} />
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { k: 'X', icon: <span className="text-lg font-bold">𝕏</span> },
              { k: 'Instagram', icon: <Camera size={20} /> },
              { k: 'YouTube', icon: <Play size={20} /> },
            ].map((s) => (
              <div key={s.k} className="flex aspect-[4/3] flex-col items-center justify-center gap-2 border border-dashed border-line text-muted" data-embed-slot={s.k.toLowerCase()}>
                {s.icon}
                <p className="text-sm">
                  {t.home.embedSlot} · {s.k}
                </p>
              </div>
            ))}
          </div>
        </Wrap>
      </section>
    </>
  );
}

export { Wrap };
