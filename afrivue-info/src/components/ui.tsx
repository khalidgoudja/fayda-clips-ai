import { useId, useState, type ReactNode } from 'react';
import { Camera, Check, Headphones, Link2, Mic, Play, Share2 } from 'lucide-react';
import { AUTHORS, SITE, type Art, type Article, type Author, type Media, type Region } from '../data';
import { formatDate, useI18n } from '../i18n';
import { Link } from '../router';
import { useSaved } from '../saved';
import { SaveButton } from './ArticleTools';

/* ═════════════ Logo ═════════════ */
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
    sm: { mark: 'h-6', word: 'text-[1.25rem]', tag: 'text-[0.42rem]', gap: 'gap-1.5' },
    md: { mark: 'h-10 sm:h-[3.25rem]', word: 'text-[1.75rem] sm:text-[2.3rem]', tag: 'text-[0.5rem] sm:text-[0.6rem]', gap: 'gap-2 sm:gap-2.5' },
    lg: { mark: 'h-14', word: 'text-[2.4rem]', tag: 'text-[0.68rem]', gap: 'gap-3' },
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

/* ═════════════ Cover art (brand illustration; replaced by a photo when `image` is set) ═════════════ */
const TONES: Record<string, { bg1: string; bg2: string; a: string; b: string }> = {
  chad: { bg1: '#0B2545', bg2: '#123a64', a: '#03A677', b: '#D9CBB0' },
  sahel: { bg1: '#6b4a32', bg2: '#a3734c', a: '#E9D9B8', b: '#0B2545' },
  green: { bg1: '#073b2e', bg2: '#0c5a44', a: '#5fd3ad', b: '#F8F6F1' },
  slate: { bg1: '#1d2b3a', bg2: '#34495e', a: '#03A677', b: '#E9E4DA' },
};
const toneFor = (r: Region) => (r === 'chad' ? 'chad' : r === 'sahel' || r === 'north' ? 'sahel' : r === 'central' || r === 'east' ? 'green' : 'slate');

export function Cover({ art, region, image, className = '', children }: { art: Art; region: Region; image?: { src: string }; className?: string; children?: ReactNode }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const c = TONES[toneFor(region)];
  return (
    <div className={`zoom relative overflow-hidden bg-navy ${className}`}>
      {image ? (
        <img src={image.src} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={c.bg1} />
              <stop offset="1" stopColor={c.bg2} />
            </linearGradient>
            <pattern id={`p${id}`} width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#fff" opacity="0.1" />
            </pattern>
          </defs>
          <rect width="400" height="250" fill={`url(#g${id})`} />
          <ArtShapes art={art} c={c} pid={`p${id}`} />
        </svg>
      )}
      {children}
    </div>
  );
}

function ArtShapes({ art, c, pid }: { art: Art; c: (typeof TONES)['chad']; pid: string }) {
  switch (art) {
    case 'sahel':
      return (
        <>
          <circle cx="292" cy="92" r="42" fill={c.a} opacity="0.9" />
          <path d="M0 182 Q 90 146 180 176 T 400 162 V250 H0Z" fill={c.b} opacity="0.35" />
          <path d="M0 206 Q 120 174 230 206 T 400 196 V250 H0Z" fill="#000" opacity="0.22" />
          <path d="M64 206 v-36 M64 176 q-14 -10 -26 -6 M64 173 q14 -12 28 -6" stroke={c.a} strokeWidth="3" fill="none" opacity="0.75" />
        </>
      );
    case 'river':
      return (
        <>
          <rect width="400" height="250" fill={`url(#${pid})`} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={`M-10 ${122 + i * 21} Q 50 ${108 + i * 21} 110 ${122 + i * 21} T 230 ${122 + i * 21} T 350 ${122 + i * 21} T 470 ${122 + i * 21}`} stroke={i % 2 ? c.a : c.b} strokeWidth="2.5" fill="none" opacity={0.25 + i * 0.1} />
          ))}
          <circle cx="82" cy="64" r="24" fill={c.a} opacity="0.85" />
        </>
      );
    case 'city':
      return (
        <>
          <circle cx="320" cy="70" r="30" fill={c.a} opacity="0.8" />
          {[20, 60, 95, 140, 185, 220, 265, 300, 340].map((x, i) => {
            const h = [70, 110, 85, 140, 95, 120, 75, 105, 90][i];
            return <rect key={x} x={x} y={250 - h} width="34" height={h} fill={i % 3 === 0 ? c.b : '#000'} opacity={i % 3 === 0 ? 0.3 : 0.25} />;
          })}
        </>
      );
    case 'grid':
      return (
        <>
          <rect width="400" height="250" fill={`url(#${pid})`} />
          {[50, 90, 130, 170].map((r) => (
            <circle key={r} cx="300" cy="190" r={r} stroke={c.a} strokeWidth="1.5" fill="none" opacity={0.6 - r / 340} />
          ))}
          <polyline points="20,200 80,170 130,180 190,120 250,135 310,70 380,55" stroke={c.b} strokeWidth="3.5" fill="none" strokeLinejoin="round" opacity="0.85" />
          <circle cx="310" cy="70" r="6" fill={c.a} />
        </>
      );
    case 'trade':
      return (
        <>
          <rect width="400" height="250" fill={`url(#${pid})`} />
          {[
            [70, 170, 200, 70],
            [70, 170, 330, 150],
            [200, 70, 330, 150],
            [70, 170, 250, 215],
          ].map(([x1, y1, x2, y2], i) => (
            <path key={i} d={`M${x1} ${y1} Q ${(x1 + x2) / 2} ${Math.min(y1, y2) - 60} ${x2} ${y2}`} stroke={c.a} strokeWidth="2" strokeDasharray="5 6" fill="none" opacity="0.8" />
          ))}
          {[
            [70, 170, 10],
            [200, 70, 7],
            [330, 150, 8],
            [250, 215, 6],
          ].map(([x, y, r]) => (
            <g key={`${x}${y}`}>
              <circle cx={x} cy={y} r={r * 2.2} fill={c.a} opacity="0.15" />
              <circle cx={x} cy={y} r={r} fill={c.a} />
            </g>
          ))}
        </>
      );
    case 'map':
      return (
        <>
          <rect width="400" height="250" fill={`url(#${pid})`} />
          <path d="M0 95 H400 M0 155 H400" stroke={c.a} strokeWidth="1" opacity="0.35" strokeDasharray="3 5" />
          <path d="M0 105 Q 100 95 200 110 T 400 100 V150 Q 300 160 200 145 T 0 150Z" fill={c.a} opacity="0.28" />
          {[60, 140, 220, 300, 360].map((x, i) => (
            <circle key={x} cx={x} cy={125 + (i % 2 ? -8 : 8)} r="4.5" fill={c.b} />
          ))}
        </>
      );
    case 'people':
      return (
        <>
          {[
            [90, 150, 46, c.a],
            [170, 130, 56, c.b],
            [255, 155, 44, c.a],
            [325, 135, 52, c.b],
          ].map(([x, y, r, f], i) => (
            <g key={i} opacity={i % 2 ? 0.55 : 0.8}>
              <circle cx={x as number} cy={(y as number) - (r as number) - 8} r={(r as number) * 0.45} fill={f as string} />
              <path d={`M${(x as number) - (r as number)} 260 Q ${x} ${(y as number) - 20} ${(x as number) + (r as number)} 260Z`} fill={f as string} />
            </g>
          ))}
        </>
      );
    case 'field':
      return (
        <>
          <circle cx="80" cy="70" r="28" fill={c.a} opacity="0.85" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <path key={i} d={`M-20 ${250 - i * 18} Q 200 ${150 - i * 4} 420 ${250 - i * 18}`} stroke={i % 2 ? c.a : c.b} strokeWidth="2" fill="none" opacity={0.18 + i * 0.07} />
          ))}
        </>
      );
    case 'stadium':
      return (
        <>
          <rect width="400" height="250" fill={`url(#${pid})`} />
          <rect x="60" y="70" width="280" height="150" rx="4" stroke={c.b} strokeWidth="2" fill="none" opacity="0.5" />
          <line x1="200" y1="70" x2="200" y2="220" stroke={c.b} strokeWidth="2" opacity="0.5" />
          <circle cx="200" cy="145" r="28" stroke={c.b} strokeWidth="2" fill="none" opacity="0.5" />
          <circle cx="248" cy="120" r="9" fill={c.a} />
        </>
      );
    case 'music':
      return (
        <>
          {Array.from({ length: 26 }, (_, i) => {
            const h = 20 + Math.abs(Math.sin(i * 0.7)) * 110;
            return <rect key={i} x={18 + i * 14.5} y={140 - h / 2} width="7" height={h} rx="3.5" fill={i % 4 === 0 ? c.a : c.b} opacity={i % 4 === 0 ? 0.9 : 0.35} />;
          })}
        </>
      );
  }
}

/* ═════════════ Labels & meta ═════════════ */
export function useLabels() {
  const { t } = useI18n();
  return {
    primary: (a: Article) => (a.region === 'chad' ? t.regions.chad : a.region === 'continental' ? t.nav[a.topic] : t.regions[a.region]),
    topic: (a: Article) => t.nav[a.topic],
    format: (a: Article) => t.formats[a.format],
  };
}

/** e.g.  ECONOMY / ANALYSIS  or  SPORTS / CHAD — emerald topic, muted qualifier */
export function Kicker({ a, light = false, hideRegion = false, className = '' }: { a: Article; light?: boolean; hideRegion?: boolean; className?: string }) {
  const L = useLabels();
  const second = a.format !== 'news' ? L.format(a) : !hideRegion && a.region !== 'continental' ? L.primary(a) : null;
  return (
    <p className={`kicker ${className}`}>
      <span className={light ? 'text-emerald-300' : 'text-accent'}>{L.topic(a)}</span>
      {second && <span className={light ? 'text-white/60' : 'text-muted'}> / {second}</span>}
    </p>
  );
}

export function Avatar({ author, size = 'md', ring = false }: { author: Author; size?: 'sm' | 'md' | 'lg' | 'xl'; ring?: boolean }) {
  const { lang } = useI18n();
  const cls = { sm: 'h-7 w-7 text-[0.6rem]', md: 'h-10 w-10 text-xs', lg: 'h-14 w-14 text-sm', xl: 'h-20 w-20 text-lg' }[size];
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full font-semibold text-white ${cls} ${ring ? 'ring-2 ring-white/20' : ''}`}
      style={{ background: author.tone, fontFamily: 'Poppins, sans-serif' }}
      role="img"
      aria-label={author.name[lang]}
      dir="ltr"
    >
      {author.desk ? <LogoMark reversed className="h-[42%] w-auto" /> : author.initials}
    </span>
  );
}

export function Byline({ a, light = false, avatar = false, className = '' }: { a: Article; light?: boolean; avatar?: boolean; className?: string }) {
  const { t, lang } = useI18n();
  const au = AUTHORS[a.author];
  return (
    <div className={`flex items-center gap-2.5 text-[13px] ${light ? 'text-white/70' : 'text-muted'} ${className}`}>
      {avatar && <Avatar author={au} size="sm" />}
      <span>
        <Link to={`/author/${au.id}`} className={`font-medium hover:underline ${light ? 'text-white' : 'text-heading'}`}>
          {au.name[lang]}
        </Link>
        <span aria-hidden> · </span>
        <time dateTime={a.date}>{formatDate(a.date, lang, { day: 'numeric', month: 'short' })}</time>
        <span aria-hidden> · </span>
        {a.readMin} {t.ui.minRead}
      </span>
    </div>
  );
}

export function SectionHeader({ title, intro, action, light = false, id }: { title: string; intro?: string; action?: ReactNode; light?: boolean; id?: string }) {
  return (
    <header className={`mb-7 border-t-[3px] pt-4 ${light ? 'border-emerald' : 'border-navy dark:border-emerald'}`}>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <h2 id={id} className={`font-display text-[1.75rem] font-bold leading-tight sm:text-[2rem] ${light ? 'text-white' : 'text-heading'}`}>
            {title}
          </h2>
          {intro && <p className={`mt-1 text-sm ${light ? 'text-white/65' : 'text-muted'}`}>{intro}</p>}
        </div>
        {action}
      </div>
    </header>
  );
}

export function Chips<T extends string>({ value, options, onChange, label, light = false }: { value: T; options: { v: T; l: string }[]; onChange: (v: T) => void; label: string; light?: boolean }) {
  return (
    <div role="group" aria-label={label} className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1">
      {options.map((o) => {
        const on = value === o.v;
        return (
          <button
            key={o.v}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.v)}
            className={`relative whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors ${
              on ? (light ? 'text-white' : 'text-heading') : light ? 'text-white/55 hover:text-white' : 'text-muted hover:text-heading'
            }`}
          >
            {o.l}
            <span className={`absolute inset-x-3 bottom-0 h-[2px] bg-emerald transition-transform duration-300 ${on ? 'scale-x-100' : 'scale-x-0'}`} aria-hidden />
          </button>
        );
      })}
    </div>
  );
}

/* ═════════════ Story cards ═════════════ */
type CardVariant = 'standard' | 'compact' | 'feature';

/** Bookmark in the corner of a card image: always shown once saved, otherwise on hover or keyboard focus */
function SaveOverlay({ slug }: { slug: string }) {
  const { isSaved } = useSaved();
  return (
    <div className={`absolute end-2.5 top-2.5 transition-opacity ${isSaved(slug) ? 'opacity-100' : 'opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100'}`} data-noprint>
      <SaveButton slug={slug} compact />
    </div>
  );
}

export function StoryCard({ a, variant = 'standard', excerpt = true, light = false, hideRegion = false }: { a: Article; variant?: CardVariant; excerpt?: boolean; light?: boolean; hideRegion?: boolean }) {
  const { lang } = useI18n();
  const c = a.i18n[lang];
  const ratio = variant === 'feature' ? 'aspect-[3/2]' : 'aspect-[16/10]';
  const title = {
    standard: 'text-[1.2rem] leading-snug',
    compact: 'text-[1.05rem] leading-snug',
    feature: 'text-[1.6rem] leading-[1.18] sm:text-[1.85rem]',
  }[variant];
  return (
    <article className="group fade-in flex flex-col">
      <div className="relative">
        <Link to={`/article/${a.slug}`} tabIndex={-1} aria-hidden className="block">
          <Cover art={a.art} region={a.region} image={a.image} className={ratio} />
        </Link>
        <SaveOverlay slug={a.slug} />
      </div>
      <div className="pt-3.5">
        <Kicker a={a} light={light} hideRegion={hideRegion} />
        <h3 className={`font-display mt-1.5 font-semibold ${title} ${light ? 'text-white' : 'text-heading'}`}>
          <Link to={`/article/${a.slug}`} className="hl">
            {c.title}
          </Link>
        </h3>
        {excerpt && variant !== 'compact' && <p className={`mt-2 line-clamp-3 text-[15px] leading-relaxed ${light ? 'text-white/70' : 'text-muted'}`}>{c.excerpt}</p>}
        <Byline a={a} light={light} className="mt-3" />
      </div>
    </article>
  );
}

/** Text-only row with optional number, timestamp and thumbnail */
export function StoryRow({ a, n, thumb = false, time = false }: { a: Article; n?: number; thumb?: boolean; time?: boolean }) {
  const { lang } = useI18n();
  const L = useLabels();
  return (
    <article className="group flex gap-4 border-b border-line py-4 first:pt-0 last:border-0 last:pb-0">
      {n !== undefined && (
        <span className="w-6 shrink-0 pt-0.5 text-sm font-semibold tabular-nums text-muted" dir="ltr">
          {String(n).padStart(2, '0')}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="kicker flex flex-wrap items-center gap-x-2">
          <span className="text-accent">{L.topic(a)}</span>
          {time && (
            <time dateTime={a.date} className="font-normal normal-case tracking-normal text-muted">
              {formatDate(a.date, lang, { hour: '2-digit', minute: '2-digit', hour12: false, day: 'numeric', month: 'short' })}
            </time>
          )}
        </p>
        <h3 className="font-display mt-1 text-[1.05rem] font-semibold leading-snug text-heading">
          <Link to={`/article/${a.slug}`} className="hl">
            {a.i18n[lang].title}
          </Link>
        </h3>
      </div>
      {thumb && (
        <Link to={`/article/${a.slug}`} tabIndex={-1} aria-hidden className="block w-24 shrink-0 sm:w-28">
          <Cover art={a.art} region={a.region} image={a.image} className="aspect-[4/3]" />
        </Link>
      )}
    </article>
  );
}

/* ═════════════ Multimedia ═════════════ */
const MEDIA_ICON = { video: Play, interview: Mic, podcast: Headphones, photo: Camera } as const;

export function MediaCard({ m, onOpen, big = false, light = true }: { m: Media; onOpen: (m: Media) => void; big?: boolean; light?: boolean }) {
  const { t, lang } = useI18n();
  const Icon = MEDIA_ICON[m.type];
  const dur = m.type === 'photo' ? `${m.duration} ${t.media.photos}` : m.duration;
  return (
    <button type="button" onClick={() => onOpen(m)} className="group block w-full text-start" aria-label={`${t.media[m.type]}: ${m.title[lang]}`}>
      <Cover art={m.art} region={m.region} className={big ? 'aspect-video' : 'aspect-[16/10]'}>
        <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <span className="absolute bottom-3 start-3 flex items-center gap-2 text-white">
          <span className={`grid place-items-center rounded-full bg-white/95 text-navy transition-transform duration-300 group-hover:scale-105 ${big ? 'h-12 w-12' : 'h-9 w-9'}`}>
            <Icon size={big ? 20 : 15} className={m.type === 'video' ? 'ms-0.5 fill-navy' : ''} aria-hidden />
          </span>
          <span className="text-xs font-medium" dir="ltr">
            {dur}
          </span>
        </span>
      </Cover>
      <p className={`kicker mt-3 ${light ? 'text-emerald-300' : 'text-accent'}`}>{t.media[m.type]}</p>
      <h3 className={`font-display mt-1 font-semibold leading-snug ${light ? 'text-white' : 'text-heading'} ${big ? 'text-2xl' : 'text-[1.05rem]'}`}>
        <span className="hl">{m.title[lang]}</span>
      </h3>
    </button>
  );
}

/* ═════════════ Social & share ═════════════ */
const IconX = ({ s = 15 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.36 5.77L17.75 3Zm-1.08 16.17h1.7L7.4 4.74H5.58l11.09 14.43Z" />
  </svg>
);
const IconFacebook = ({ s = 15 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9Z" />
  </svg>
);
const IconInstagram = ({ s = 15 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const IconYouTube = ({ s = 15 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
  </svg>
);
const IconLinkedIn = ({ s = 15 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M6.9 8.8H3.8V20h3.1V8.8ZM5.3 3.5a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6ZM20.2 13.6c0-3-1.6-4.9-4.3-4.9-1.4 0-2.4.8-2.8 1.5V8.8h-3V20h3.1v-5.8c0-1.5.6-2.6 2-2.6s1.9 1.1 1.9 2.6V20h3.1v-6.4Z" />
  </svg>
);
const IconWhatsApp = ({ s = 15 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
  </svg>
);

export function SocialLinks({ size = 15, className = '', itemClass = '' }: { size?: number; className?: string; itemClass?: string }) {
  const items = [
    { href: SITE.social.x, label: 'X', Icon: IconX },
    { href: SITE.social.facebook, label: 'Facebook', Icon: IconFacebook },
    { href: SITE.social.instagram, label: 'Instagram', Icon: IconInstagram },
    { href: SITE.social.youtube, label: 'YouTube', Icon: IconYouTube },
    { href: SITE.social.linkedin, label: 'LinkedIn', Icon: IconLinkedIn },
  ];
  return (
    <ul className={`flex items-center ${className}`}>
      {items.map(({ href, label, Icon }) => (
        <li key={label}>
          <a href={href} aria-label={`AfriVue Info — ${label}`} title={label} target="_blank" rel="noopener noreferrer" className={`grid h-8 w-8 place-items-center transition-opacity ${itemClass}`}>
            <Icon s={size} />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function ShareButtons({ title, vertical = false }: { title: string; vertical?: boolean }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const url = window.location.href;
  const e = encodeURIComponent;
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };
  const btn = 'grid h-9 w-9 place-items-center rounded-full border border-line text-heading transition-colors hover:border-navy hover:bg-navy hover:text-white dark:hover:border-emerald dark:hover:bg-emerald dark:hover:text-navy';
  const links = [
    { label: 'X', href: `https://x.com/intent/post?text=${e(title)}&url=${e(url)}`, Icon: IconX },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${e(url)}`, Icon: IconFacebook },
    { label: 'WhatsApp', href: `https://wa.me/?text=${e(`${title} ${url}`)}`, Icon: IconWhatsApp },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${e(url)}`, Icon: IconLinkedIn },
  ];
  return (
    <div className={`flex items-center gap-2 ${vertical ? 'flex-col' : 'flex-wrap'}`} role="group" aria-label={t.ui.share}>
      <span className={`kicker text-muted ${vertical ? 'mb-1' : 'me-1'}`}>{t.ui.share}</span>
      {links.map(({ label, href, Icon }) => (
        <a key={label} className={btn} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${t.ui.share}: ${label}`} title={label}>
          <Icon s={14} />
        </a>
      ))}
      {canNativeShare && (
        <button type="button" className={`${btn} sm:hidden`} onClick={() => navigator.share({ title, url }).catch(() => undefined)} aria-label={t.tools.moreShare} title={t.tools.moreShare}>
          <Share2 size={15} />
        </button>
      )}
      <button type="button" className={btn} onClick={copy} aria-label={t.ui.copyLink} title={t.ui.copyLink}>
        {copied ? <Check size={15} className="text-emerald" /> : <Link2 size={15} />}
      </button>
      <span role="status" className={`text-xs font-medium text-accent ${copied ? '' : 'sr-only'}`}>
        {copied ? t.ui.copied : ''}
      </span>
    </div>
  );
}
