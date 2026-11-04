import { useCallback, useEffect, useMemo, useState } from 'react';
import { getArticle, type Video } from './data';
import { I18nContext, LANG_META, STRINGS, detectLang, type I18nValue, type Lang } from './i18n';
import { useRoute } from './router';
import { BackToTop, Footer, Header, MobileMenu, SearchOverlay, Ticker, TopBar, type NavKey } from './components/layout';
import { Home } from './pages/Home';
import { AboutPage, AnalysisPage, ArticlePage, NotFound, SectionPage, VideoModal, VideosPage } from './pages/Pages';

export default function App() {
  const route = useRoute();
  const lang: Lang = route.lang ?? detectLang();
  const t = STRINGS[lang];
  const pathKey = route.path.join('/');

  // Normalise URLs without a language prefix → #/{lang}/...
  useEffect(() => {
    if (!route.lang) window.location.replace(`#/${lang}/${pathKey}${route.anchor ? `#${route.anchor}` : ''}`);
  }, [route.lang, lang, pathKey, route.anchor]);

  // <html lang/dir>, persisted preference
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

  const setLang = useCallback(
    (l: Lang) => {
      window.location.hash = `#/${l}/${pathKey}${route.anchor ? `#${route.anchor}` : ''}`;
    },
    [pathKey, route.anchor],
  );

  const i18n: I18nValue = useMemo(() => ({ lang, t, dir: LANG_META[lang].dir, setLang }), [lang, t, setLang]);

  /* Theme */
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  const toggleTheme = () => {
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
  };

  /* Overlays */
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [video, setVideo] = useState<Video | null>(null);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeVideo = useCallback(() => setVideo(null), []);

  // "/" opens search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Scroll to top (or to #anchor) on page change
  useEffect(() => {
    setMenuOpen(false);
    if (route.anchor) {
      window.setTimeout(() => document.getElementById(route.anchor!)?.scrollIntoView({ behavior: 'smooth' }), 60);
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [pathKey, route.anchor]);

  /* Resolve page */
  const [p0, p1] = route.path;
  let page: React.ReactNode;
  let active: NavKey | null = null;
  let title = '';
  const article = p0 === 'article' && p1 ? getArticle(p1) : undefined;

  if (!p0) {
    page = <Home onPlay={setVideo} />;
    active = 'home';
  } else if (p0 === 'chad' || p0 === 'sahel' || p0 === 'africa') {
    page = <SectionPage key={p0} section={p0} />;
    active = p0;
    title = t.sections[p0].title;
  } else if (p0 === 'analysis') {
    page = <AnalysisPage />;
    active = 'analysis';
    title = t.analysisPage.title;
  } else if (p0 === 'videos') {
    page = <VideosPage onPlay={setVideo} />;
    active = 'videos';
    title = t.videosPage.title;
  } else if (p0 === 'about') {
    page = <AboutPage />;
    active = 'about';
    title = t.about.title;
  } else if (article) {
    page = <ArticlePage key={article.slug} a={article} />;
    active = article.type === 'analysis' ? 'analysis' : article.section;
    title = article.i18n[lang].title;
  } else {
    page = <NotFound />;
    title = t.notFound.title;
  }

  // Document title + meta description per page/language
  useEffect(() => {
    document.title = title ? `${title} | AfriVue Info` : `AfriVue Info — ${t.meta.tagline}`;
    const desc = article ? article.i18n[lang].excerpt : t.meta.description;
    document.querySelector('meta[name="description"]')?.setAttribute('content', desc);
  }, [title, t, article, lang]);

  return (
    <I18nContext.Provider value={i18n}>
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main')?.focus();
        }}
        className="sr-only z-[60] rounded bg-gold px-4 py-2 font-semibold text-navy focus:not-sr-only focus:fixed focus:start-3 focus:top-3"
      >
        {t.ui.skip}
      </a>
      <TopBar dark={dark} onToggleTheme={toggleTheme} />
      <Header active={active} onSearch={() => setSearchOpen(true)} onMenu={() => setMenuOpen(true)} />
      <Ticker />
      <main id="main" tabIndex={-1} className="min-h-[60vh] outline-none">
        {page}
      </main>
      <Footer />
      <BackToTop />
      <MobileMenu open={menuOpen} onClose={closeMenu} active={active} />
      <SearchOverlay open={searchOpen} onClose={closeSearch} />
      <VideoModal video={video} onClose={closeVideo} />
    </I18nContext.Provider>
  );
}
