import { Fragment, useEffect, useMemo, useState } from 'react';
import { ArrowRight, Minus, Plus } from 'lucide-react';
import { ARTICLES, AUTHORS, byDate, type Article, type Block, type ChartSpec } from '../data';
import { formatDate, useI18n } from '../i18n';
import { Link } from '../router';
import { Avatar, Cover, Kicker, ShareButtons, StoryCard, useLabels } from '../components/ui';
import { navPath } from '../components/layout';
import { ListenButton, PrintButton, SaveButton } from '../components/ArticleTools';

const SIZES = ['text-[17px]', 'text-[18.5px]', 'text-[20px]', 'text-[22px]'];
const isH = (b: Block): b is { h: string } => typeof b === 'object' && 'h' in b;

/* ── Inline bar chart (accessible: real list with values) ── */
function Chart({ c }: { c: ChartSpec }) {
  const { t } = useI18n();
  const max = Math.max(...c.data.map(([, v]) => v));
  return (
    <figure className="my-10 border-y border-line py-6">
      <figcaption className="font-display mb-5 text-lg font-semibold text-heading">{c.title}</figcaption>
      <ul className="space-y-3">
        {c.data.map(([label, v]) => (
          <li key={label} className="grid grid-cols-[minmax(0,9rem)_1fr] items-center gap-3 text-sm sm:grid-cols-[minmax(0,12rem)_1fr]">
            <span className="text-fg">{label}</span>
            <span className="flex items-center gap-2">
              <span className="h-3 bg-emerald" style={{ width: `${(v / max) * 100}%` }} aria-hidden />
              <span className="shrink-0 font-semibold tabular-nums text-heading" dir="ltr">
                {v}
                {c.unit}
              </span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted">
        {t.article.note}: {c.note}
      </p>
    </figure>
  );
}

function WhyBox({ items }: { items: string[] }) {
  const { t } = useI18n();
  return (
    <aside className="my-9 border-s-[3px] border-emerald bg-surface px-6 py-5" aria-labelledby="why-h">
      <h2 id="why-h" className="kicker text-accent">
        {t.article.why}
      </h2>
      <ul className="mt-3 space-y-2.5 font-sans text-[15.5px] leading-relaxed text-fg">
        {items.map((x) => (
          <li key={x} className="flex gap-3">
            <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 bg-emerald" aria-hidden />
            <span>{x}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function Toc({ items, active, compact = false }: { items: { id: string; label: string }[]; active: string; compact?: boolean }) {
  const { t } = useI18n();
  const list = (
    <ol className="space-y-1 text-[14px]">
      {items.map((h, i) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            aria-current={active === h.id ? 'location' : undefined}
            className={`flex gap-3 border-s-2 py-1.5 ps-3 leading-snug transition-colors ${active === h.id ? 'border-emerald font-medium text-heading' : 'border-line text-muted hover:text-heading'}`}
          >
            <span className="tabular-nums" dir="ltr">
              {i + 1}.
            </span>
            {h.label}
          </a>
        </li>
      ))}
    </ol>
  );
  if (compact)
    return (
      <details className="mb-8 border-y border-line py-3 lg:hidden">
        <summary className="kicker cursor-pointer text-heading">{t.article.toc}</summary>
        <div className="mt-3">{list}</div>
      </details>
    );
  return (
    <nav aria-label={t.article.toc}>
      <p className="kicker mb-3 text-heading">{t.article.toc}</p>
      {list}
    </nav>
  );
}

export function ArticlePage({ a }: { a: Article }) {
  const { t, lang } = useI18n();
  const L = useLabels();
  const c = a.i18n[lang];
  const au = AUTHORS[a.author];
  const headings = c.body.map((b, i) => (isH(b) ? { id: `s${i}`, label: b.h } : null)).filter(Boolean) as { id: string; label: string }[];
  const hasToc = headings.length >= 3;

  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(headings[0]?.id ?? '');
  const [size, setSize] = useState(() => {
    try {
      const v = Number(localStorage.getItem('afrivue-textsize'));
      return Number.isInteger(v) && v >= 0 && v < SIZES.length && localStorage.getItem('afrivue-textsize') !== null ? v : 1;
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
      const total = r.height - window.innerHeight * 0.5;
      setProgress(Math.min(1, Math.max(0, -r.top / Math.max(total, 1))));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [a.slug]);

  useEffect(() => {
    if (!hasToc) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((x, y) => x.boundingClientRect.top - y.boundingClientRect.top)[0];
        if (vis) setActive(vis.target.id);
      },
      { rootMargin: '-80px 0px -65% 0px' },
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a.slug, lang, hasToc]);

  const { related, next } = useMemo(() => {
    const others = ARTICLES.filter((x) => x.slug !== a.slug).sort(byDate);
    const score = (x: Article) => (x.region === a.region ? 2 : 0) + (x.topic === a.topic ? 2 : 0) + (x.format === a.format ? 1 : 0);
    const ranked = [...others].sort((x, y) => score(y) - score(x));
    const nextA = ranked.find((x) => x.format !== 'news') ?? ranked[0];
    return { next: nextA, related: ranked.filter((x) => x !== nextA).slice(0, 3) };
  }, [a]);

  const crumbs: [string, string][] = [
    [t.nav.home, '/'],
    a.region === 'chad' ? [t.nav.chad, '/chad'] : [t.nav.africa, a.region === 'continental' ? '/africa' : `/africa/${a.region}`],
    a.format === 'report' ? [t.nav.indepth, '/in-depth'] : a.format !== 'news' ? [t.nav.analysis, '/analysis'] : [t.nav[a.topic], navPath(a.topic)],
  ];

  // Render body, inserting "Why this matters" after the first paragraph
  let firstP = true;
  const blocks = c.body.map((b, i) => {
    if (typeof b === 'string') {
      const out = (
        <Fragment key={i}>
          <p>{b}</p>
          {firstP && c.why && <WhyBox items={c.why} />}
        </Fragment>
      );
      firstP = false;
      return out;
    }
    if ('h' in b)
      return (
        <h2 key={i} id={`s${i}`} className="font-display mb-4 mt-12 scroll-mt-24 text-[1.6rem] font-bold leading-snug text-heading">
          {b.h}
        </h2>
      );
    if ('quote' in b)
      return (
        <figure key={i} className="my-10 border-s-[3px] border-emerald ps-6">
          <blockquote className="font-display text-[1.6rem] font-semibold leading-snug text-heading sm:text-[1.85rem]">“{b.quote}”</blockquote>
          <figcaption className="mt-3 font-sans text-sm text-muted">— {b.cite}</figcaption>
        </figure>
      );
    if ('figure' in b)
      return (
        <figure key={i} className="my-10">
          <Cover art={b.figure} region={a.region} className="aspect-[16/9]" />
          <figcaption className="mt-2 font-sans text-[13px] leading-snug text-muted">{b.caption}</figcaption>
        </figure>
      );
    return <Chart key={i} c={b.chart} />;
  });

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[45] h-[3px]" aria-hidden data-noprint>
        <div className="h-full bg-emerald transition-[width] duration-100" style={{ width: `${progress * 100}%` }} />
      </div>

      <article className="mx-auto max-w-[1320px] px-4 pt-6 sm:px-6 sm:pt-10" lang={lang}>
        <p className="mx-auto mb-6 hidden max-w-[760px] border-b border-line pb-3 text-[10pt] text-muted print:block">
          <strong className="text-heading">AfriVue Info</strong> · {window.location.href}
        </p>
        <nav aria-label={t.article.breadcrumb} className="mx-auto max-w-[760px]" data-noprint>
          <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-muted">
            {crumbs.map(([l, to], i) => (
              <li key={to + i} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden>/</span>}
                <Link to={to} className="hover:text-heading hover:underline">
                  {l}
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <header className="mx-auto mt-6 max-w-[760px]">
          <Kicker a={a} />
          <h1 className="font-display mt-3 text-[2.1rem] font-bold leading-[1.1] text-heading sm:text-[2.9rem] lg:text-[3.2rem]">{c.title}</h1>
          <p className="font-display mt-4 text-[1.2rem] leading-relaxed text-muted sm:text-[1.35rem]">{c.excerpt}</p>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
            <div className="flex items-center gap-3">
              <Avatar author={au} size="lg" />
              <div className="text-[13px] leading-snug">
                <p>
                  <span className="text-muted">{t.ui.by} </span>
                  <Link to={`/author/${au.id}`} className="font-semibold text-heading hover:underline">
                    {au.name[lang]}
                  </Link>
                  <span className="text-muted"> · {au.role[lang]}</span>
                </p>
                <p className="mt-1 text-muted">
                  {t.ui.published} <time dateTime={a.date}>{formatDate(a.date, lang, { day: 'numeric', month: 'long', year: 'numeric' })}</time>
                  {a.updated && (
                    <>
                      {' · '}
                      {t.ui.updated} <time dateTime={a.updated}>{formatDate(a.updated, lang, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false })}</time>
                    </>
                  )}
                  {' · '}
                  {a.readMin} {t.ui.minRead}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1" role="group" aria-label={t.ui.textSize} data-noprint>
              <span className="kicker me-2 text-muted">{t.ui.textSize}</span>
              <button type="button" onClick={() => setSize((s) => Math.max(0, s - 1))} disabled={size === 0} className="grid h-8 w-8 place-items-center rounded-full border border-line text-heading hover:border-navy disabled:opacity-35" aria-label={`${t.ui.textSize} −`}>
                <Minus size={14} />
              </button>
              <button type="button" onClick={() => setSize((s) => Math.min(SIZES.length - 1, s + 1))} disabled={size === SIZES.length - 1} className="grid h-8 w-8 place-items-center rounded-full border border-line text-heading hover:border-navy disabled:opacity-35" aria-label={`${t.ui.textSize} +`}>
                <Plus size={14} />
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2" data-noprint>
            <SaveButton slug={a.slug} />
            <ListenButton a={a} />
            <PrintButton />
          </div>
          <p className="mt-3 text-[12.5px] text-muted">{t.demo.articleNote}</p>
        </header>

        <figure className="mx-auto mt-8 max-w-[1080px]">
          <Cover art={a.art} region={a.region} image={a.image} className="aspect-[16/9]" />
          <figcaption className="mt-2 flex flex-wrap justify-between gap-x-4 text-[13px] text-muted">
            <span>{`${L.primary(a)} — ${t.nav[a.topic]}`}</span>
            <span>
              {t.article.credit}: {a.image ? a.image.credit : t.article.illustration}
            </span>
          </figcaption>
        </figure>

        <div className="mx-auto mt-10 grid max-w-[1180px] gap-8 lg:grid-cols-[56px_minmax(0,1fr)_240px] lg:gap-12">
          <div className="hidden lg:block" data-noprint>
            <div className="sticky top-24">
              <ShareButtons title={c.title} vertical />
            </div>
          </div>

          <div id="article-body" className="mx-auto w-full max-w-[700px]">
            <div className="mb-8 lg:hidden" data-noprint>
              <ShareButtons title={c.title} />
            </div>
            {hasToc && <Toc items={headings} active={active} compact />}
            <div className={`article-body font-reading leading-[1.75] text-fg ${SIZES[size]}`}>{blocks}</div>

            <div className="mt-12 border-t border-line pt-6" data-noprint>
              <ShareButtons title={c.title} />
            </div>

            {/* Author bio */}
            <section aria-labelledby="bio-h" className="mt-10 flex gap-5 bg-surface p-6">
              <Avatar author={au} size="xl" />
              <div>
                <h2 id="bio-h" className="kicker text-muted">
                  {t.article.aboutAuthor}
                </h2>
                <p className="font-display mt-1 text-xl font-bold text-heading">{au.name[lang]}</p>
                <p className="text-sm text-accent">{au.role[lang]}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{au.bio[lang]}</p>
                <Link to={`/author/${au.id}`} className="group mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-heading">
                  {t.article.moreBy} {au.name[lang]}
                  <ArrowRight size={14} className="rtl:rotate-180" />
                </Link>
              </div>
            </section>
          </div>

          <aside className="hidden lg:block" data-noprint>
            <div className="sticky top-24">{hasToc && <Toc items={headings} active={active} />}</div>
          </aside>
        </div>
      </article>

      {/* Read next */}
      {next && (
        <section data-noprint aria-labelledby="next-h" className="mx-auto mt-16 max-w-[1320px] px-4 sm:px-6">
          <div className="border-t-[3px] border-navy pt-4 dark:border-emerald">
            <h2 id="next-h" className="kicker text-heading">
              {t.article.readNext}
            </h2>
          </div>
          <Link to={`/article/${next.slug}`} className="group mt-6 grid items-center gap-6 md:grid-cols-[1fr_1.2fr] md:gap-10">
            <Cover art={next.art} region={next.region} image={next.image} className="aspect-[16/9]" />
            <div>
              <Kicker a={next} />
              <p className="font-display hl mt-2 text-[1.8rem] font-bold leading-tight text-heading sm:text-[2.2rem]">{next.i18n[lang].title}</p>
              <p className="mt-3 text-muted">{next.i18n[lang].excerpt}</p>
            </div>
          </Link>
        </section>
      )}

      <section data-noprint aria-labelledby="related-h" className="mx-auto max-w-[1320px] px-4 py-16 sm:px-6">
        <div className="mb-7 border-t-[3px] border-navy pt-4 dark:border-emerald">
          <h2 id="related-h" className="font-display text-2xl font-bold text-heading">
            {t.article.related}
          </h2>
        </div>
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((r) => (
            <StoryCard key={r.slug} a={r} />
          ))}
        </div>
      </section>
    </>
  );
}
