/**
 * Content model + sample (demo) content.
 * ⚠ Everything here is SAMPLE content for the demonstration edition — not published reporting.
 * Replace with your CMS / API data before going live.
 */
import type { Lang } from './i18n';
import { ARTICLES } from './articles';

export type L10n<T = string> = Record<Lang, T>;

export type Region = 'chad' | 'north' | 'west' | 'sahel' | 'central' | 'east' | 'southern' | 'continental';
export type Topic = 'politics' | 'economy' | 'society' | 'development' | 'culture' | 'sports' | 'technology';
export type Format = 'news' | 'analysis' | 'opinion' | 'explainer' | 'background' | 'report';
export type Art = 'trade' | 'people' | 'river' | 'grid' | 'sahel' | 'city' | 'map' | 'field' | 'stadium' | 'music';

export const AFRICA_REGIONS: Region[] = ['north', 'west', 'sahel', 'central', 'east', 'southern'];
export const NAV_TOPICS: Topic[] = ['politics', 'economy', 'society', 'culture', 'sports', 'technology'];
export const ANALYSIS_FORMATS: Format[] = ['analysis', 'opinion', 'explainer', 'background'];

export interface ChartSpec {
  title: string;
  unit: string;
  data: [string, number][];
  note: string;
}

/** Article body blocks. A plain string is a paragraph. */
export type Block = string | { h: string } | { quote: string; cite: string } | { figure: Art; caption: string } | { chart: ChartSpec };

export interface Localized {
  title: string;
  excerpt: string; // used as the sub-headline
  body: Block[];
  why?: string[]; // "Why this matters" bullets (analysis formats)
}

export interface Article {
  slug: string;
  region: Region;
  topic: Topic;
  format: Format;
  author: AuthorId;
  date: string; // ISO publish date
  updated?: string; // ISO update date
  readMin: number;
  art: Art;
  /** Optional real photo; when absent a brand illustration is shown */
  image?: { src: string; credit: string };
  featured?: boolean;
  breaking?: boolean;
  views: number;
  i18n: L10n<Localized>;
}

/* ── Contributors (sample profiles) ── */
export type AuthorId = 'chad-desk' | 'africa-desk' | 'video-desk' | 'amina' | 'moussa' | 'claire' | 'selin' | 'ibrahim';

export interface Author {
  id: AuthorId;
  desk?: boolean;
  initials: string;
  tone: string; // portrait background
  name: L10n;
  role: L10n;
  bio: L10n;
}

export const AUTHORS: Record<AuthorId, Author> = {
  'chad-desk': {
    id: 'chad-desk',
    desk: true,
    initials: 'TD',
    tone: '#0B2545',
    name: { en: 'Chad Desk', fr: 'Rédaction Tchad', tr: 'Çad Masası', ar: 'قسم تشاد' },
    role: { en: "AfriVue Info, N'Djamena", fr: "AfriVue Info, N'Djamena", tr: "AfriVue Info, N'Djamena", ar: 'أفري ڤيو إنفو، انجامينا' },
    bio: {
      en: 'The Chad Desk covers politics, the economy, society and development across all of Chad’s provinces.',
      fr: 'La rédaction Tchad couvre la politique, l’économie, la société et le développement dans toutes les provinces du pays.',
      tr: "Çad Masası, ülkenin tüm vilayetlerinde siyaset, ekonomi, toplum ve kalkınmayı takip eder.",
      ar: 'يغطي قسم تشاد السياسة والاقتصاد والمجتمع والتنمية في جميع أقاليم البلاد.',
    },
  },
  'africa-desk': {
    id: 'africa-desk',
    desk: true,
    initials: 'AD',
    tone: '#13355f',
    name: { en: 'Africa Desk', fr: 'Rédaction Afrique', tr: 'Afrika Masası', ar: 'قسم أفريقيا' },
    role: { en: 'AfriVue Info', fr: 'AfriVue Info', tr: 'AfriVue Info', ar: 'أفري ڤيو إنفو' },
    bio: {
      en: 'The Africa Desk follows continental affairs, from North Africa to the Southern African region.',
      fr: 'La rédaction Afrique suit l’actualité continentale, de l’Afrique du Nord à l’Afrique australe.',
      tr: 'Afrika Masası, Kuzey Afrika’dan Güney Afrika’ya kıta gündemini takip eder.',
      ar: 'يتابع قسم أفريقيا شؤون القارة من شمالها إلى جنوبها.',
    },
  },
  'video-desk': {
    id: 'video-desk',
    desk: true,
    initials: 'VD',
    tone: '#027A57',
    name: { en: 'Video Desk', fr: 'Pôle Vidéo', tr: 'Video Masası', ar: 'قسم الفيديو' },
    role: { en: 'AfriVue Info', fr: 'AfriVue Info', tr: 'AfriVue Info', ar: 'أفري ڤيو إنفو' },
    bio: {
      en: 'Field reporting, interviews, podcasts and photo stories.',
      fr: 'Reportages de terrain, entretiens, podcasts et récits photo.',
      tr: 'Saha haberleri, röportajlar, podcastler ve foto hikâyeler.',
      ar: 'تقارير ميدانية ومقابلات وبودكاست وقصص مصوّرة.',
    },
  },
  amina: {
    id: 'amina',
    initials: 'AH',
    tone: '#027A57',
    name: { en: 'Amina Haroun', fr: 'Amina Haroun', tr: 'Amina Haroun', ar: 'أمينة هارون' },
    role: { en: 'Sahel analyst', fr: 'Analyste Sahel', tr: 'Sahel analisti', ar: 'محللة شؤون الساحل' },
    bio: {
      en: 'Amina writes on regional integration, security and development in the Sahel. (Sample contributor profile.)',
      fr: 'Amina écrit sur l’intégration régionale, la sécurité et le développement au Sahel. (Profil de démonstration.)',
      tr: 'Amina, Sahel’de bölgesel entegrasyon, güvenlik ve kalkınma üzerine yazıyor. (Örnek yazar profili.)',
      ar: 'تكتب أمينة عن التكامل الإقليمي والأمن والتنمية في الساحل. (ملف تعريفي تجريبي.)',
    },
  },
  moussa: {
    id: 'moussa',
    initials: 'MA',
    tone: '#0B2545',
    name: { en: 'Moussa Abakar', fr: 'Moussa Abakar', tr: 'Moussa Abakar', ar: 'موسى أبكر' },
    role: { en: 'Economics correspondent', fr: 'Correspondant économie', tr: 'Ekonomi muhabiri', ar: 'مراسل الشؤون الاقتصادية' },
    bio: {
      en: 'Moussa covers trade, agriculture and public finance from N’Djamena. (Sample contributor profile.)',
      fr: 'Moussa couvre le commerce, l’agriculture et les finances publiques depuis N’Djamena. (Profil de démonstration.)',
      tr: 'Moussa, N’Djamena’dan ticaret, tarım ve kamu maliyesini takip ediyor. (Örnek yazar profili.)',
      ar: 'يغطي موسى التجارة والزراعة والمالية العامة من انجامينا. (ملف تعريفي تجريبي.)',
    },
  },
  claire: {
    id: 'claire',
    initials: 'CN',
    tone: '#7a3b25',
    name: { en: 'Claire Ndiaye', fr: 'Claire Ndiaye', tr: 'Claire Ndiaye', ar: 'كلير ندياي' },
    role: { en: 'Special reports editor', fr: 'Responsable des grands formats', tr: 'Özel dosyalar editörü', ar: 'محررة التقارير الخاصة' },
    bio: {
      en: 'Claire leads AfriVue’s long-form and investigative projects. (Sample contributor profile.)',
      fr: 'Claire dirige les grands formats et enquêtes d’AfriVue. (Profil de démonstration.)',
      tr: 'Claire, AfriVue’nun uzun soluklu ve araştırmacı projelerini yönetiyor. (Örnek yazar profili.)',
      ar: 'تقود كلير مشاريع أفري ڤيو المطوّلة والاستقصائية. (ملف تعريفي تجريبي.)',
    },
  },
  selin: {
    id: 'selin',
    initials: 'SK',
    tone: '#13355f',
    name: { en: 'Selin Kaya', fr: 'Selin Kaya', tr: 'Selin Kaya', ar: 'سيلين كايا' },
    role: { en: 'Turkey–Africa contributor', fr: 'Contributrice Turquie–Afrique', tr: 'Türkiye–Afrika yazarı', ar: 'كاتبة في العلاقات التركية الأفريقية' },
    bio: {
      en: 'Selin writes on trade, education and diplomatic ties between Turkey and Africa. (Sample contributor profile.)',
      fr: 'Selin écrit sur le commerce, l’éducation et les liens diplomatiques entre la Turquie et l’Afrique. (Profil de démonstration.)',
      tr: 'Selin, Türkiye ile Afrika arasındaki ticaret, eğitim ve diplomatik ilişkiler üzerine yazıyor. (Örnek yazar profili.)',
      ar: 'تكتب سيلين عن التجارة والتعليم والعلاقات الدبلوماسية بين تركيا وأفريقيا. (ملف تعريفي تجريبي.)',
    },
  },
  ibrahim: {
    id: 'ibrahim',
    initials: 'IM',
    tone: '#027A57',
    name: { en: 'Ibrahim Mahamat', fr: 'Ibrahim Mahamat', tr: 'Ibrahim Mahamat', ar: 'إبراهيم محمد' },
    role: { en: 'Politics & governance writer', fr: 'Politique et gouvernance', tr: 'Siyaset ve yönetişim yazarı', ar: 'كاتب في السياسة والحوكمة' },
    bio: {
      en: 'Ibrahim explains institutions, governance and public policy across Africa. (Sample contributor profile.)',
      fr: 'Ibrahim décrypte les institutions, la gouvernance et les politiques publiques en Afrique. (Profil de démonstration.)',
      tr: 'Ibrahim, Afrika genelinde kurumları, yönetişimi ve kamu politikalarını açıklıyor. (Örnek yazar profili.)',
      ar: 'يشرح إبراهيم المؤسسات والحوكمة والسياسات العامة في أفريقيا. (ملف تعريفي تجريبي.)',
    },
  },
};

/* ── Multimedia ── */
export type MediaType = 'video' | 'interview' | 'podcast' | 'photo';

export interface Media {
  id: string;
  type: MediaType;
  region: Region;
  duration: string; // "4:12" or "12 photos"
  art: Art;
  date: string;
  youtubeId?: string; // set to embed a real YouTube video
  title: L10n;
}

export const MEDIA: Media[] = [
  {
    id: 'ndjamena-market',
    type: 'video',
    region: 'chad',
    duration: '4:12',
    art: 'city',
    date: '2026-11-03T10:00:00Z',
    title: { en: "Inside N'Djamena's central market", fr: "Au cœur du grand marché de N'Djamena", tr: "N'Djamena merkez pazarının içinden", ar: 'جولة داخل السوق المركزي في انجامينا' },
  },
  {
    id: 'sahel-trade-conversation',
    type: 'interview',
    region: 'sahel',
    duration: '18:40',
    art: 'people',
    date: '2026-11-02T10:00:00Z',
    title: {
      en: 'In conversation: what open borders mean for Sahel traders',
      fr: 'Entretien : ce que l’ouverture des frontières change pour les commerçants du Sahel',
      tr: 'Söyleşi: Açık sınırlar Sahel tüccarları için ne anlama geliyor?',
      ar: 'حوار: ماذا تعني الحدود المفتوحة لتجار الساحل؟',
    },
  },
  {
    id: 'brief-podcast-1',
    type: 'podcast',
    region: 'continental',
    duration: '24:05',
    art: 'grid',
    date: '2026-11-01T10:00:00Z',
    title: {
      en: 'The AfriVue Brief podcast — Episode 1: the week in Africa',
      fr: 'Le podcast Brief AfriVue — Épisode 1 : la semaine en Afrique',
      tr: 'AfriVue Bülten podcast — 1. Bölüm: Afrika’da bu hafta',
      ar: 'بودكاست نشرة أفري ڤيو — الحلقة 1: أسبوع في أفريقيا',
    },
  },
  {
    id: 'lake-chad-waters',
    type: 'video',
    region: 'chad',
    duration: '7:45',
    art: 'river',
    date: '2026-11-01T09:00:00Z',
    title: { en: 'Lake Chad: living with changing waters', fr: 'Lac Tchad : vivre avec des eaux changeantes', tr: 'Çad Gölü: değişen sularla yaşamak', ar: 'بحيرة تشاد: العيش مع تقلّب المياه' },
  },
  {
    id: 'ndjamena-dusk',
    type: 'photo',
    region: 'chad',
    duration: '12',
    art: 'sahel',
    date: '2026-10-31T10:00:00Z',
    title: { en: "N'Djamena at dusk: a photo story", fr: "N'Djamena au crépuscule : un récit photo", tr: "Alacakaranlıkta N'Djamena: foto hikâye", ar: 'انجامينا عند الغروب: قصة مصوّرة' },
  },
  {
    id: 'sahel-explained',
    type: 'video',
    region: 'sahel',
    duration: '3:05',
    art: 'map',
    date: '2026-10-30T10:00:00Z',
    title: { en: 'The Sahel in 3 minutes: key issues explained', fr: 'Le Sahel en 3 minutes : les enjeux expliqués', tr: '3 dakikada Sahel: temel meseleler', ar: 'الساحل في 3 دقائق: أبرز القضايا' },
  },
  {
    id: 'students-istanbul',
    type: 'video',
    region: 'continental',
    duration: '5:30',
    art: 'people',
    date: '2026-10-27T10:00:00Z',
    title: {
      en: 'African students in Istanbul: building bridges',
      fr: 'Étudiants africains à Istanbul : bâtir des ponts',
      tr: "İstanbul'daki Afrikalı öğrenciler: köprüler kurmak",
      ar: 'طلاب أفارقة في إسطنبول: بناء الجسور',
    },
  },
];

/** Site-wide settings — replace placeholders with real accounts before launch. */
export const SITE = {
  demo: true, // shows the "Demonstration edition" notice
  email: 'contact@afrivue.info',
  social: {
    x: '#',
    facebook: '#',
    instagram: '#',
    youtube: '#',
    linkedin: '#',
  },
};

export { ARTICLES };
export const byDate = (a: { date: string }, b: { date: string }) => b.date.localeCompare(a.date);
export const getArticle = (slug: string) => ARTICLES.find((a) => a.slug === slug);
export const isAnalysis = (a: Article) => ANALYSIS_FORMATS.includes(a.format);
export const sortedArticles = () => [...ARTICLES].sort(byDate);
