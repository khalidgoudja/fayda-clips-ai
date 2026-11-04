import { useId, type ReactNode } from 'react';
import { BadgeCheck, Clock, Play } from 'lucide-react';
import type { Art, Article, Section } from '../data';
import { formatDate, useI18n } from '../i18n';
import { Link } from '../router';

/* ── Logo: interlocking "AV" mark (navy A + emerald V) + "AfriVue" wordmark + spaced "INFO" ── */
const V_PATH = 'M58 2H84L104 50L124 2H150L112 90H96Z';

export function LogoMark({ reversed = false, className = '' }: { reversed?: boolean; className?: string }) {
  const id = `av${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <svg viewBox="-1 0 152 92" className={`${reversed ? 'text-white' : 'text-navy dark:text-white'} ${className}`} aria-hidden="true">
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x="-10" y="-10" width="180" height="120">
          <rect x="-10" y="-10" width="180" height="120" fill="#fff" />
          <path d={V_PATH} fill="#000" stroke="#000" strokeWidth="8" strokeLinejoin="round" />
        </mask>
      </defs>
      <g mask={`url(#${id})`} fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
        <path d="M1 89L37 6Q39 2 43 2H64L27 89Z" />
        <path d="M74 30C52 38 46 70 63 89H96Z" />
      </g>
      <path d={V_PATH} fill="#03A677" stroke="#03A677" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ size = 'md', reversed = false, tag = true }: { size?: 'sm' | 'md' | 'lg'; reversed?: boolean; tag?: boolean }) {
  const s = {
    sm: { mark: 'h-7', word: 'text-[1.4rem]', tag: 'text-[0.45rem]', gap: 'gap-1.5' },
    md: { mark: 'h-11 sm:h-[3.4rem]', word: 'text-[1.9rem] sm:text-[2.35rem]', tag: 'text-[0.55rem] sm:text-[0.62rem]', gap: 'gap-2 sm:gap-2.5' },
    lg: { mark: 'h-16', word: 'text-[2.8rem]', tag: 'text-[0.75rem]', gap: 'gap-3' },
  }[size];
  const color = reversed ? 'text-white' : 'text-navy dark:text-white';
  return (
    <span dir="ltr" className={`inline-flex items-center leading-none select-none ${s.gap}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
      <LogoMark reversed={reversed} className={`${s.mark} w-auto shrink-0`} />
      <span className={`inline-flex flex-col items-center ${color}`}>
        <span className={`${s.word} font-bold tracking-[-0.02em]`}>AfriVue</span>
        {tag && <span className={`${s.tag} mt-[0.2em] ps-[0.9em] font-semibold tracking-[0.9em]`}>INFO</span>}
      </span>
    </span>
  );
}

/* ── Generative editorial cover art in brand colours (replace with photos when available) ── */
const SECTION_TONES: Record<Section, { bg1: string; bg2: string; a: string; b: string }> = {
  chad: { bg1: '#0B2545', bg2: '#163d6b', a: '#C89B3C', b: '#B5502D' },
  sahel: { bg1: '#7d3a20', bg2: '#B5502D', a: '#C89B3C', b: '#0B2545' },
  africa: { bg1: '#123a2c', bg2: '#2F6D4F', a: '#C89B3C', b: '#F7F4EF' },
};

export function Cover({ art, section, className = '', children }: { art: Art; section: Section; className?: string; children?: ReactNode }) {
  const id = useId().replace(/:/g, '');
  const c = SECTION_TONES[section];
  return (
    <div className={`relative overflow-hidden bg-navy ${className}`}>
      <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-[1.04]" aria-hidden="true">
        <defs>
          <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={c.bg1} />
            <stop offset="1" stopColor={c.bg2} />
          </linearGradient>
          <pattern id={`p${id}`} width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.1" fill="#fff" opacity="0.13" />
          </pattern>
        </defs>
        <rect width="400" height="250" fill={`url(#g${id})`} />
        {art === 'sahel' && (
          <>
            <circle cx="290" cy="95" r="46" fill={c.a} opacity="0.95" />
            <path d="M0 180 Q 90 140 180 175 T 400 160 V250 H0Z" fill={c.b} opacity="0.55" />
            <path d="M0 205 Q 120 170 230 205 T 400 195 V250 H0Z" fill="#000" opacity="0.25" />
            <path d="M60 205 v-38 M60 175 q-14 -10 -26 -6 M60 172 q14 -12 28 -6" stroke={c.a} strokeWidth="3" fill="none" opacity="0.8" />
          </>
        )}
        {art === 'river' && (
          <>
            <rect width="400" height="250" fill={`url(#p${id})`} />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <path key={i} d={`M-10 ${120 + i * 22} Q 50 ${105 + i * 22} 110 ${120 + i * 22} T 230 ${120 + i * 22} T 350 ${120 + i * 22} T 470 ${120 + i * 22}`} stroke={i % 2 ? c.a : '#F7F4EF'} strokeWidth="3" fill="none" opacity={0.25 + i * 0.1} />
            ))}
            <circle cx="80" cy="65" r="26" fill={c.a} opacity="0.9" />
          </>
        )}
        {art === 'city' && (
          <>
            <circle cx="320" cy="70" r="34" fill={c.a} opacity="0.85" />
            {[20, 60, 95, 140, 185, 220, 265, 300, 340].map((x, i) => {
              const h = [70, 110, 85, 140, 95, 120, 75, 105, 90][i];
              return <rect key={x} x={x} y={250 - h} width="34" height={h} fill={i % 3 === 0 ? c.b : '#000'} opacity={i % 3 === 0 ? 0.55 : 0.28} />;
            })}
            <rect y="230" width="400" height="20" fill="#000" opacity="0.3" />
          </>
        )}
        {art === 'grid' && (
          <>
            <rect width="400" height="250" fill={`url(#p${id})`} />
            {[50, 90, 130, 170].map((r) => (
              <circle key={r} cx="300" cy="190" r={r} stroke={c.a} strokeWidth="2" fill="none" opacity={0.7 - r / 300} />
            ))}
            <polyline points="20,200 80,170 130,180 190,120 250,135 310,70 380,55" stroke="#F7F4EF" strokeWidth="4" fill="none" strokeLinejoin="round" opacity="0.9" />
            <circle cx="310" cy="70" r="7" fill={c.a} />
          </>
        )}
        {art === 'trade' && (
          <>
            <rect width="400" height="250" fill={`url(#p${id})`} />
            {[
              [70, 170, 200, 70],
              [70, 170, 330, 150],
              [200, 70, 330, 150],
              [70, 170, 250, 215],
            ].map(([x1, y1, x2, y2], i) => (
              <path key={i} d={`M${x1} ${y1} Q ${(x1 + x2) / 2} ${Math.min(y1, y2) - 60} ${x2} ${y2}`} stroke={c.a} strokeWidth="2.5" strokeDasharray="6 6" fill="none" opacity="0.85" />
            ))}
            {[
              [70, 170, 12],
              [200, 70, 8],
              [330, 150, 9],
              [250, 215, 7],
            ].map(([x, y, r]) => (
              <g key={`${x}${y}`}>
                <circle cx={x} cy={y} r={r * 2.2} fill={c.a} opacity="0.18" />
                <circle cx={x} cy={y} r={r} fill={c.a} />
              </g>
            ))}
          </>
        )}
        {art === 'map' && (
          <>
            <rect width="400" height="250" fill={`url(#p${id})`} />
            <path d="M0 95 H400 M0 155 H400" stroke={c.a} strokeWidth="1" opacity="0.4" strokeDasharray="3 5" />
            <path d="M0 105 Q 100 95 200 110 T 400 100 V150 Q 300 160 200 145 T 0 150Z" fill={c.a} opacity="0.35" />
            {[60, 140, 220, 300, 360].map((x, i) => (
              <circle key={x} cx={x} cy={125 + (i % 2 ? -8 : 8)} r="5" fill="#F7F4EF" />
            ))}
          </>
        )}
        {art === 'people' && (
          <>
            {[
              [90, 150, 46, c.a],
              [170, 130, 56, '#F7F4EF'],
              [255, 155, 44, c.b],
              [325, 135, 52, c.a],
            ].map(([x, y, r, f], i) => (
              <g key={i} opacity="0.85">
                <circle cx={x as number} cy={(y as number) - (r as number) - 8} r={(r as number) * 0.45} fill={f as string} />
                <path d={`M${(x as number) - (r as number)} 260 Q ${x} ${(y as number) - 20} ${(x as number) + (r as number)} 260Z`} fill={f as string} />
              </g>
            ))}
          </>
        )}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
      {children}
    </div>
  );
}

/* ── Small pieces ── */
export function SectionTag({ section, className = '' }: { section: Section; className?: string }) {
  const { t } = useI18n();
  return (
    <Link to={`/${section}`} className={`label inline-block rounded-sm bg-terracotta px-2 py-1 text-white hover:bg-navy ${className}`}>
      {t.nav[section]}
    </Link>
  );
}

export function MetaLine({ a, withDate = true, className = '' }: { a: Article; withDate?: boolean; className?: string }) {
  const { t, lang } = useI18n();
  return (
    <p className={`label flex flex-wrap items-center gap-x-2 gap-y-1 text-muted ${className}`}>
      <span>{t.nav[a.section]}</span>
      <span aria-hidden>·</span>
      <span>{a.type === 'analysis' ? t.ui.analysis : t.ui.news}</span>
      <span aria-hidden>·</span>
      <span className="inline-flex items-center gap-1">
        <Clock size={11} aria-hidden /> {a.readMin} {t.ui.minRead}
      </span>
      {withDate && (
        <>
          <span aria-hidden>·</span>
          <time dateTime={a.date}>{formatDate(a.date, lang, { day: 'numeric', month: 'short' })}</time>
        </>
      )}
    </p>
  );
}

export function VerifiedBadge() {
  const { t } = useI18n();
  return (
    <span className="label inline-flex items-center gap-1 rounded-sm bg-verified/10 px-2 py-1 text-verified dark:bg-verified/30 dark:text-emerald-200">
      <BadgeCheck size={13} aria-hidden /> {t.ui.verified}
    </span>
  );
}

export function SectionHeading({ children, action, light = false, id }: { children: ReactNode; action?: ReactNode; light?: boolean; id?: string }) {
  return (
    <div className={`mb-6 flex items-end justify-between gap-4 border-b-2 pb-3 ${light ? 'border-white/20' : 'border-navy dark:border-line'}`}>
      <h2 id={id} className={`relative text-xl font-bold sm:text-2xl ${light ? 'text-white' : 'text-heading'}`}>
        <span className="absolute -bottom-[14px] start-0 h-[3px] w-14 bg-gold" aria-hidden />
        {children}
      </h2>
      {action}
    </div>
  );
}

/* ── Article cards ── */
export function ArticleCard({ a, size = 'md' }: { a: Article; size?: 'sm' | 'md' | 'lg' }) {
  const { lang } = useI18n();
  const c = a.i18n[lang];
  return (
    <article className={`group fade-up flex flex-col ${size === 'sm' ? '' : 'h-full'}`}>
      <Link to={`/article/${a.slug}`} className="block overflow-hidden rounded-md" tabIndex={-1} aria-hidden>
        <Cover art={a.art} section={a.section} className={size === 'lg' ? 'aspect-[16/9]' : 'aspect-[16/10]'} />
      </Link>
      <div className="flex flex-1 flex-col pt-4">
        <div className="mb-2 flex items-center gap-2">
          <SectionTag section={a.section} />
          {a.verified && <VerifiedBadge />}
        </div>
        <h3 className={`font-bold leading-snug text-heading ${size === 'lg' ? 'text-2xl sm:text-3xl' : size === 'sm' ? 'text-base' : 'text-lg'}`}>
          <Link to={`/article/${a.slug}`} className="headline-link">
            {c.title}
          </Link>
        </h3>
        {size !== 'sm' && <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-muted">{c.excerpt}</p>}
        <MetaLine a={a} className="mt-auto pt-3" />
      </div>
    </article>
  );
}

export function ArticleRow({ a, index }: { a: Article; index?: number }) {
  const { lang, t } = useI18n();
  const c = a.i18n[lang];
  return (
    <article className="group flex gap-4 border-b border-line py-4 last:border-0">
      {index !== undefined ? (
        <span className="w-8 shrink-0 text-3xl font-bold leading-none text-gold/80">{index + 1}</span>
      ) : (
        <Link to={`/article/${a.slug}`} tabIndex={-1} aria-hidden className="block w-24 shrink-0 overflow-hidden rounded sm:w-28">
          <Cover art={a.art} section={a.section} className="aspect-square" />
        </Link>
      )}
      <div className="min-w-0">
        <p className="label mb-1 text-terracotta dark:text-gold-300">{t.nav[a.section]}</p>
        <h3 className="text-[15px] font-semibold leading-snug text-heading">
          <Link to={`/article/${a.slug}`} className="headline-link">
            {c.title}
          </Link>
        </h3>
      </div>
    </article>
  );
}

export function PlayBadge({ big = false }: { big?: boolean }) {
  return (
    <span
      className={`grid place-items-center rounded-full bg-gold text-navy shadow-lg ring-4 ring-white/25 transition-transform group-hover:scale-110 ${big ? 'h-16 w-16' : 'h-11 w-11'}`}
      aria-hidden
    >
      <Play size={big ? 26 : 18} className="ms-0.5 fill-navy" />
    </span>
  );
}
