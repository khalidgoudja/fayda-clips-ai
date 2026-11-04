import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AFRICA_REGIONS, AUTHORS, SITE, getArticle, type AuthorId, type Media, type Region, type Topic } from './data';
import { I18nContext, LANG_META, STRINGS, detectLang, type I18nValue, type Lang } from './i18n';
import { useRoute } from './router';
import { BackToTop, Footer, Masthead, MobileMenu, Newsletter, PrimaryNav, SearchOverlay, Ticker, UtilityBar, type NavKey } from './components/layout';
import { Home } from './pages/Home';
import { ArticlePage } from './pages/Article';
import { AboutPage, AfricaPage, AnalysisPage, AuthorPage, ChadPage, InDepthPage, MediaModal, NotFound, PolicyPage, TopicPage, VideoPage } from './pages/Pages';

const TOPICS: Topic[] = ['politics', 'economy', 'society', 'development', 'culture', 'sports', 'technology'];
/** Old URLs from the first version of the site keep working */
const LEGACY: Record<string, string> = { sahel: 'africa/sahel', videos: 'video' };

function setMeta(selector: string, attr: string, value: string) {
  document.querySelector(selector)?.setAttribute(attr, value);
}

export default function App() {
  const route = useRoute();
  const lang: Lang = route.lang ?? detectLang();
  const t = STRINGS[lang];
  const pathKey = route.path.join('/');

  // Normalise URLs → #/{lang}/{path}
  useEffect(() => {
    const legacy = LEGACY[pathKey];
    if (!route.lang || legacy) window.location.replace(`#/${lang}/${legacy ?? pathKey}${route.anchor ? `#${route.anchor}` : ''}`);
  }, [route.lang, lang, pathKey, route.anchor]);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = LANG_META[lang].dir;
    try {
      localStorage.setItem('afrivue-lang', lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  // Switching language keeps the reader on the same page (every story exists in all four languages)
  const setLang = useCallback(
    (l: Lang) => {
      window.location.hash = `#/${l}/${pathKey}${route.anchor ? `#${route.anchor}` : ''}`;
    },
    [pathKey, route.anchor],
  );
  const i18n: I18nValue = useMemo(() => ({ lang, t, dir: LANG_META[lang].dir, setLang }), [lang, t, setLang]);

  /* Theme */
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  const toggleTheme = () =>
    setDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle('dark', next);
      try {
        localStorage.setItem('afrivue-theme', next ? 'dark' : 'light');
      } catch {
        /* ignore */
      }
      return next;
    });

  /* Overlays */
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [media, setMedia] = useState<Media | null>(null);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeMedia = useCallback(() => setMedia(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(el?.tagName) && !el?.isContentEditable) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    if (route.anchor) window.setTimeout(() => document.getElementById(route.anchor!)?.scrollIntoView({ behavior: 'smooth' }), 80);
    else window.scrollTo({ top: 0 });
  }, [pathKey, route.anchor]);

  /* Resolve page */
  const [p0, p1] = route.path;
  let page: ReactNode;
  let active: NavKey | null = null;
  let title = '';
  const article = p0 === 'article' && p1 ? getArticle(p1) : undefined;

  if (!p0) {
    page = <Home onOpenMedia={setMedia} />;
    active = 'home';
  } else if (p0 === 'chad') {
    page = <ChadPage />;
    active = 'chad';
    title = t.nav.chad;
  } else if (p0 === 'africa') {
    const r = AFRICA_REGIONS.includes(p1 as Region) ? (p1 as Region) : undefined;
    page = <AfricaPage key={r ?? 'all'} initial={r} />;
    active = 'africa';
    title = r ? t.regions[r] : t.nav.africa;
  } else if (TOPICS.includes(p0 as Topic)) {
    page = <TopicPage key={p0} topic={p0 as Topic} />;
    active = p0 as Topic;
    title = t.nav[p0 as Topic];
  } else if (p0 === 'analysis') {
    page = <AnalysisPage />;
    active = 'analysis';
    title = t.nav.analysis;
  } else if (p0 === 'in-depth') {
    page = <InDepthPage />;
    active = 'indepth';
    title = t.nav.indepth;
  } else if (p0 === 'video') {
    page = <VideoPage onOpen={setMedia} />;
    active = 'video';
    title = t.nav.video;
  } else if (p0 === 'about') {
    page = <AboutPage />;
    active = 'about';
    title = t.about.title;
  } else if (p0 === 'author' && p1 && p1 in AUTHORS) {
    page = <AuthorPage key={p1} id={p1 as AuthorId} />;
    title = AUTHORS[p1 as AuthorId].name[lang];
  } else if (p0 === 'page' && (p1 === 'corrections' || p1 === 'privacy' || p1 === 'terms')) {
    page = <PolicyPage k={p1} />;
    title = t.policies[p1].title;
  } else if (article) {
    page = <ArticlePage key={article.slug} a={article} />;
    active = article.format === 'report' ? 'indepth' : article.format !== 'news' ? 'analysis' : article.region === 'chad' ? 'chad' : article.topic === 'development' ? 'society' : article.topic;
    title = article.i18n[lang].title;
  } else {
    page = <NotFound />;
    title = t.notFound.title;
  }

  /* SEO: title, description, Open Graph, structured data */
  useEffect(() => {
    const full = title ? `${title} | AfriVue Info` : `AfriVue Info — ${t.meta.tagline}`;
    const desc = article ? article.i18n[lang].excerpt : t.meta.description;
    document.title = full;
    setMeta('meta[name="description"]', 'content', desc);
    setMeta('meta[property="og:title"]', 'content', full);
    setMeta('meta[property="og:description"]', 'content', desc);
    setMeta('meta[property="og:type"]', 'content', article ? 'article' : 'website');
    document.getElementById('ld-json')?.remove();
    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.id = 'ld-json';
    ld.text = JSON.stringify(
      article
        ? {
            '@context': 'https://schema.org',
            '@type': article.format === 'news' ? 'NewsArticle' : 'AnalysisNewsArticle',
            headline: article.i18n[lang].title,
            description: article.i18n[lang].excerpt,
            inLanguage: lang,
            datePublished: article.date,
            dateModified: article.updated ?? article.date,
            author: { '@type': AUTHORS[article.author].desk ? 'Organization' : 'Person', name: AUTHORS[article.author].name[lang] },
            publisher: { '@type': 'NewsMediaOrganization', name: 'AfriVue Info' },
          }
        : { '@context': 'https://schema.org', '@type': 'NewsMediaOrganization', name: 'AfriVue Info', slogan: t.meta.tagline, email: SITE.email },
    );
    document.head.appendChild(ld);
  }, [title, t, article, lang]);

  return (
    <I18nContext.Provider value={i18n}>
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main')?.focus();
        }}
        className="sr-only z-[60] bg-emerald px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:start-3 focus:top-3"
      >
        {t.ui.skip}
      </a>
      <UtilityBar dark={dark} onToggleTheme={toggleTheme} />
      <Masthead onSearch={() => setSearchOpen(true)} onMenu={() => setMenuOpen(true)} />
      <PrimaryNav active={active} onSearch={() => setSearchOpen(true)} />
      <Ticker />
      <main id="main" tabIndex={-1} className="min-h-[60vh] outline-none">
        {page}
      </main>
      <Newsletter />
      <Footer />
      <BackToTop />
      <MobileMenu open={menuOpen} onClose={closeMenu} active={active} />
      <SearchOverlay open={searchOpen} onClose={closeSearch} />
      <MediaModal m={media} onClose={closeMedia} />
    </I18nContext.Provider>
  );
}
