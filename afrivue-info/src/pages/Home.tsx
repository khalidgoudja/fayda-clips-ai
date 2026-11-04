import { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ARTICLES, SECTIONS, VIDEOS, byDate, type Section, type Video } from '../data';
import { useI18n } from '../i18n';
import { Link } from '../router';
import { ArticleCard, ArticleRow, Cover, MetaLine, PlayBadge, SectionHeading, SectionTag, VerifiedBadge } from '../components/ui';
import { Newsletter } from '../components/layout';

export function ViewAll({ to, light = false }: { to: string; light?: boolean }) {
  const { t } = useI18n();
  return (
    <Link to={to} className={`group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold ${light ? 'text-gold hover:text-white' : 'text-accent hover:text-heading'}`}>
      {t.ui.viewAll}
      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
    </Link>
  );
}

export function VideoCard({ v, big = false, row = false, onPlay }: { v: Video; big?: boolean; row?: boolean; onPlay: (v: Video) => void }) {
  const { lang, t } = useI18n();
  return (
    <button
      type="button"
      onClick={() => onPlay(v)}
      className={`group block w-full text-start ${row ? 'lg:grid lg:grid-cols-[180px_1fr] lg:items-center lg:gap-4' : ''}`}
      aria-label={`${t.ui.play}: ${v.title[lang]}`}
    >
      <Cover art={v.art} section={v.section} className={`rounded-md ${big ? 'aspect-video' : 'aspect-[16/10]'}`}>
        <span className="absolute inset-0 grid place-items-center">
          <PlayBadge big={big} />
        </span>
        <span className="absolute bottom-2 end-2 rounded bg-black/70 px-2 py-0.5 text-xs font-medium text-white" dir="ltr">
          {v.duration}
        </span>
      </Cover>
      <span className={`block ${row ? 'lg:mt-0' : ''}`}>
        <span className={`label mt-3 block text-gold ${row ? 'lg:mt-0' : ''}`}>{t.nav[v.section]}</span>
        <span className={`mt-1 block font-semibold leading-snug text-white group-hover:text-gold ${big ? 'text-xl sm:text-2xl' : 'text-base'}`}>{v.title[lang]}</span>
      </span>
    </button>
  );
}

export function Home({ onPlay }: { onPlay: (v: Video) => void }) {
  const { t, lang } = useI18n();
  const sorted = useMemo(() => [...ARTICLES].sort(byDate), []);
  const lead = sorted.find((a) => a.featured) ?? sorted[0];
  const top = sorted.filter((a) => a !== lead).slice(0, 4);
  const mostRead = useMemo(() => [...ARTICLES].sort((a, b) => b.views - a.views).slice(0, 5), []);
  const analyses = sorted.filter((a) => a.type === 'analysis').slice(0, 3);
  const [filter, setFilter] = useState<'all' | Section>('all');
  const latest = sorted.filter((a) => a !== lead && (filter === 'all' || a.section === filter)).slice(0, 6);
  const c = lead.i18n[lang];

  return (
    <>
      {/* ── Lead story + top stories ── */}
      <section aria-labelledby="lead-title" className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:pt-10">
        <div className="grid gap-8 lg:grid-cols-12">
          <article className="group fade-up lg:col-span-8">
            <Link to={`/article/${lead.slug}`} tabIndex={-1} aria-hidden className="block overflow-hidden rounded-lg">
              <Cover art={lead.art} section={lead.section} className="aspect-[16/9]">
                <span className="label absolute start-4 top-4 rounded-sm bg-gold px-2.5 py-1 text-navy">{t.home.lead}</span>
              </Cover>
            </Link>
            <div className="pt-5">
              <div className="mb-3 flex items-center gap-2">
                <SectionTag section={lead.section} />
                {lead.verified && <VerifiedBadge />}
              </div>
              <h1 id="lead-title" className="text-[1.9rem] font-bold leading-[1.15] tracking-tight text-heading sm:text-[2.5rem]">
                <Link to={`/article/${lead.slug}`} className="headline-link">
                  {c.title}
                </Link>
              </h1>
              <p className="mt-3 max-w-3xl text-lg leading-relaxed text-muted">{c.excerpt}</p>
              <MetaLine a={lead} className="mt-4" />
            </div>
          </article>

          <aside className="lg:col-span-4" aria-labelledby="top-title">
            <h2 id="top-title" className="label mb-2 border-b-2 border-navy pb-2 text-heading dark:border-line">
              {t.home.topStories}
            </h2>
            <div>
              {top.map((a) => (
                <ArticleRow key={a.slug} a={a} />
              ))}
            </div>
          </aside>
        </div>
      </section>

      {/* ── Latest from Africa grid with region filter ── */}
      <section aria-labelledby="latest-title" className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-9">
            <SectionHeading id="latest-title">{t.home.latestFromAfrica}</SectionHeading>
            <div role="tablist" aria-label={t.home.latestFromAfrica} className="no-scrollbar -mt-1 mb-6 flex gap-2 overflow-x-auto">
              {(['all', ...SECTIONS] as const).map((f) => (
                <button
                  key={f}
                  role="tab"
                  aria-selected={filter === f}
                  onClick={() => setFilter(f)}
                  className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    filter === f ? 'border-navy bg-navy text-white dark:border-gold dark:bg-gold dark:text-navy' : 'border-line text-muted hover:border-navy hover:text-heading'
                  }`}
                >
                  {f === 'all' ? t.ui.all : t.nav[f]}
                </button>
              ))}
            </div>
            <div key={filter} className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((a) => (
                <ArticleCard key={a.slug} a={a} />
              ))}
            </div>
          </div>
          <aside className="lg:col-span-3" aria-labelledby="mostread-title">
            <div className="rounded-lg border border-line bg-surface p-5 lg:sticky lg:top-20">
              <h2 id="mostread-title" className="label mb-1 text-heading">
                {t.ui.trending}
              </h2>
              {mostRead.map((a, i) => (
                <ArticleRow key={a.slug} a={a} index={i} />
              ))}
            </div>
          </aside>
        </div>
      </section>

      {/* ── Analysis band ── */}
      <section aria-labelledby="analysis-title" className="bg-navy py-14 text-paper">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading id="analysis-title" light action={<ViewAll to="/analysis" light />}>
            {t.home.analysisBand}
          </SectionHeading>
          <p className="-mt-2 mb-8 max-w-2xl text-paper/75">{t.home.analysisBandText}</p>
          <div className="grid gap-8 md:grid-cols-3">
            {analyses.map((a) => (
              <article key={a.slug} className="group">
                <Link to={`/article/${a.slug}`} className="block">
                  <Cover art={a.art} section={a.section} className="aspect-[16/10] rounded-md" />
                  <p className="label mt-4 text-gold">
                    {t.nav[a.section]} · {a.readMin} {t.ui.minRead}
                  </p>
                  <h3 className="mt-2 text-xl font-bold leading-snug text-white">
                    <span className="headline-link">{a.i18n[lang].title}</span>
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-paper/70">{a.i18n[lang].excerpt}</p>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Regional sections ── */}
      <section aria-labelledby="regions-title" className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionHeading id="regions-title">{t.home.regions}</SectionHeading>
        <div className="grid gap-10 md:grid-cols-3">
          {SECTIONS.map((s) => {
            const items = sorted.filter((a) => a.section === s).slice(0, 3);
            return (
              <div key={s}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-heading">
                    <Link to={`/${s}`} className="hover:text-accent">
                      {t.sections[s].title}
                    </Link>
                  </h3>
                  <ViewAll to={`/${s}`} />
                </div>
                <ArticleCard a={items[0]} size="sm" />
                <div className="mt-2">
                  {items.slice(1).map((a) => (
                    <ArticleRow key={a.slug} a={a} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Videos ── */}
      <section aria-labelledby="videos-title" className="bg-[#081c35] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading id="videos-title" light action={<ViewAll to="/videos" light />}>
            {t.home.videosBand}
          </SectionHeading>
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <VideoCard v={VIDEOS[0]} big onPlay={onPlay} />
            </div>
            <div className="grid gap-6 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1">
              {VIDEOS.slice(1).map((v) => (
                <VideoCard key={v.id} v={v} row onPlay={onPlay} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
