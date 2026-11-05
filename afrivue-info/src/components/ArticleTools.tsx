import { useEffect, useRef, useState } from 'react';
import { Bookmark, BookmarkCheck, Headphones, Pause, Play, Printer, Square } from 'lucide-react';
import type { Article, Block } from '../data';
import { LANG_META, useI18n, type Lang } from '../i18n';
import { useSaved } from '../saved';

const pill =
  'inline-flex h-8 items-center gap-1.5 rounded-full border border-line px-3 text-[12.5px] font-medium text-heading transition-colors hover:border-navy dark:hover:border-emerald disabled:opacity-40';

export function SaveButton({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const { t } = useI18n();
  const { isSaved, toggle } = useSaved();
  const on = isSaved(slug);
  const Icon = on ? BookmarkCheck : Bookmark;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-pressed={on}
      aria-label={on ? `${t.tools.saved} — ${t.tools.remove}` : t.tools.save}
      title={on ? t.tools.saved : t.tools.save}
      className={compact ? `grid h-8 w-8 place-items-center rounded-full border transition-colors ${on ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-line bg-surface/90 text-heading hover:border-navy'}` : `${pill} ${on ? 'border-emerald-700 bg-emerald-700 text-white hover:border-emerald-700 dark:border-emerald dark:bg-emerald dark:text-navy' : ''}`}
    >
      <Icon size={15} aria-hidden />
      {!compact && <span>{on ? t.tools.saved : t.tools.save}</span>}
    </button>
  );
}

/* ── Listen: reads the article aloud with the browser's own voices ── */
function blockText(b: Block): string {
  if (typeof b === 'string') return b;
  if ('h' in b) return b.h;
  if ('quote' in b) return `${b.quote} — ${b.cite}`;
  if ('figure' in b) return '';
  return b.chart.title;
}

function pickVoice(lang: Lang): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  return voices.find((v) => v.lang.toLowerCase().startsWith(lang) && v.localService) ?? voices.find((v) => v.lang.toLowerCase().startsWith(lang));
}

export function ListenButton({ a }: { a: Article }) {
  const { t, lang } = useI18n();
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [voice, setVoice] = useState<SpeechSynthesisVoice | undefined>();
  const [state, setState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const left = useRef(0);

  useEffect(() => {
    if (!supported) return;
    const update = () => setVoice(pickVoice(lang));
    update();
    window.speechSynthesis.addEventListener('voiceschanged', update);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', update);
  }, [supported, lang]);

  // Stop when leaving the story or switching language
  useEffect(() => {
    if (!supported) return;
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [supported, a.slug, lang]);
  useEffect(() => setState('idle'), [a.slug, lang]);

  if (!supported || !voice) return null;

  const start = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const c = a.i18n[lang];
    const parts = [c.title, c.excerpt, ...c.body.map(blockText)].filter(Boolean);
    left.current = parts.length;
    parts.forEach((text) => {
      const u = new SpeechSynthesisUtterance(text);
      u.voice = voice;
      u.lang = LANG_META[lang].locale.split('-u-')[0];
      u.rate = 1;
      u.onend = () => {
        left.current -= 1;
        if (left.current <= 0) setState('idle');
      };
      u.onerror = () => setState('idle');
      synth.speak(u);
    });
    setState('playing');
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setState('idle');
  };

  if (state === 'idle')
    return (
      <button type="button" onClick={start} className={pill}>
        <Headphones size={15} aria-hidden />
        {t.tools.listen}
      </button>
    );

  return (
    <span className="inline-flex items-center gap-1.5" role="group" aria-label={t.tools.listening}>
      <span className="me-1 inline-flex items-center gap-1.5 text-[12px] font-medium text-accent">
        <span className={`h-1.5 w-1.5 rounded-full bg-emerald ${state === 'playing' ? 'animate-pulse' : ''}`} aria-hidden />
        {t.tools.listening}
      </span>
      {state === 'playing' ? (
        <button
          type="button"
          onClick={() => {
            window.speechSynthesis.pause();
            setState('paused');
          }}
          className={pill}
        >
          <Pause size={14} aria-hidden />
          {t.tools.pauseAudio}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            window.speechSynthesis.resume();
            setState('playing');
          }}
          className={pill}
        >
          <Play size={14} aria-hidden />
          {t.tools.resumeAudio}
        </button>
      )}
      <button type="button" onClick={stop} className={pill} aria-label={t.tools.stopAudio}>
        <Square size={12} aria-hidden />
      </button>
    </span>
  );
}

export function PrintButton() {
  const { t } = useI18n();
  return (
    <button type="button" onClick={() => window.print()} className={pill}>
      <Printer size={15} aria-hidden />
      {t.tools.print}
    </button>
  );
}
