/**
 * Sample editorial content. Replace with your CMS / API data.
 * Every article and video carries all four languages so switching language keeps the reader on the same story.
 */
import type { Lang } from './i18n';

export type Section = 'chad' | 'sahel' | 'africa';
export type ArticleType = 'news' | 'analysis';
export type Art = 'trade' | 'people' | 'river' | 'grid' | 'sahel' | 'city' | 'map';
export type Desk = 'chad' | 'sahel' | 'africa' | 'analysis' | 'video';

export interface Localized {
  title: string;
  excerpt: string;
  body: string[];
}

export interface Article {
  slug: string;
  section: Section;
  type: ArticleType;
  desk: Desk;
  date: string; // ISO
  readMin: number;
  art: Art;
  verified?: boolean;
  featured?: boolean;
  views: number; // used for "Most read"
  i18n: Record<Lang, Localized>;
}

export interface Video {
  id: string;
  section: Section;
  duration: string;
  art: Art;
  date: string;
  youtubeId?: string; // set to a YouTube video id to embed the real player
  title: Record<Lang, string>;
}

export const SECTIONS: Section[] = ['chad', 'sahel', 'africa'];

export const ARTICLES: Article[] = [
  {
    slug: 'ndjamena-trade-corridor',
    section: 'chad',
    type: 'news',
    desk: 'chad',
    date: '2026-11-04T08:30:00Z',
    readMin: 5,
    art: 'trade',
    verified: true,
    featured: true,
    views: 18400,
    i18n: {
      en: {
        title: "N'Djamena unveils new trade corridor",
        excerpt:
          'The agreement links Chadian producers to three neighbouring markets, part of a wider push for economic integration across the Sahel belt.',
        body: [
          'The agreement links Chadian producers to three neighbouring markets, part of a wider push for economic integration across the Sahel belt. Officials say the corridor will simplify customs procedures and cut transit times for livestock, sesame and gum arabic.',
          'Analysts say the corridor could reshape regional trade patterns over the next decade, provided that road maintenance and border security keep pace with ambitions.',
          "Traders interviewed in the capital's central market welcomed the announcement but stressed that informal fees at checkpoints remain their main concern.",
        ],
      },
      fr: {
        title: "N'Djamena dévoile un nouveau corridor commercial",
        excerpt:
          "L'accord relie les producteurs tchadiens à trois marchés voisins, dans le cadre d'un effort plus large d'intégration économique de la bande sahélienne.",
        body: [
          "L'accord relie les producteurs tchadiens à trois marchés voisins, dans le cadre d'un effort plus large d'intégration économique de la bande sahélienne. Selon les autorités, le corridor simplifiera les procédures douanières et réduira les délais de transit pour le bétail, le sésame et la gomme arabique.",
          "Les analystes estiment que le corridor pourrait redessiner les flux commerciaux régionaux au cours de la prochaine décennie, à condition que l'entretien des routes et la sécurité aux frontières suivent le rythme des ambitions.",
          "Les commerçants interrogés au grand marché de la capitale ont salué l'annonce, tout en soulignant que les prélèvements informels aux postes de contrôle restent leur principale préoccupation.",
        ],
      },
      tr: {
        title: "N'Djamena yeni ticaret koridorunu tanıttı",
        excerpt:
          'Anlaşma, Çadlı üreticileri üç komşu pazara bağlıyor; bu adım Sahel kuşağında ekonomik entegrasyona yönelik daha geniş bir çabanın parçası.',
        body: [
          'Anlaşma, Çadlı üreticileri üç komşu pazara bağlıyor; bu adım Sahel kuşağında ekonomik entegrasyona yönelik daha geniş bir çabanın parçası. Yetkililere göre koridor, gümrük işlemlerini sadeleştirecek ve hayvancılık, susam ve arap zamkı için transit sürelerini kısaltacak.',
          'Analistler, yol bakımı ve sınır güvenliği hedeflere ayak uydurabildiği takdirde koridorun önümüzdeki on yılda bölgesel ticaret dengelerini yeniden şekillendirebileceğini belirtiyor.',
          'Başkentin merkez pazarında görüşülen tüccarlar duyuruyu memnuniyetle karşıladı, ancak kontrol noktalarındaki gayriresmî ücretlerin hâlâ en büyük endişeleri olduğunu vurguladı.',
        ],
      },
      ar: {
        title: 'انجامينا تكشف عن ممر تجاري جديد',
        excerpt: 'يربط الاتفاق المنتجين التشاديين بثلاث أسواق مجاورة، في إطار مسعى أوسع لتعزيز التكامل الاقتصادي في منطقة الساحل.',
        body: [
          'يربط الاتفاق المنتجين التشاديين بثلاث أسواق مجاورة، في إطار مسعى أوسع لتعزيز التكامل الاقتصادي في منطقة الساحل. ويقول مسؤولون إن الممر سيبسّط الإجراءات الجمركية ويختصر مدة العبور للمواشي والسمسم والصمغ العربي.',
          'ويرى محللون أن الممر قد يعيد تشكيل أنماط التجارة الإقليمية خلال العقد المقبل، شريطة أن تواكب صيانة الطرق وأمن الحدود حجم الطموحات.',
          'ورحّب تجار في السوق المركزي بالعاصمة بالإعلان، لكنهم أكدوا أن الرسوم غير الرسمية عند نقاط التفتيش لا تزال مصدر قلقهم الأول.',
        ],
      },
    },
  },
  {
    slug: 'sahel-youth-initiative',
    section: 'sahel',
    type: 'news',
    desk: 'sahel',
    date: '2026-11-03T15:10:00Z',
    readMin: 4,
    art: 'people',
    views: 12100,
    i18n: {
      en: {
        title: 'Cross-border youth initiative aims to counter extremist recruitment',
        excerpt:
          'A network of community radios, sports clubs and vocational centres is offering young people across three Sahel countries an alternative path.',
        body: [
          'A network of community radios, sports clubs and vocational centres is offering young people across three Sahel countries an alternative path. Organisers say the programme reached several thousand participants in its first year.',
          'The initiative relies on local mentors who speak the languages of the communities they serve, an approach researchers say builds trust faster than top-down campaigns.',
          'Funding remains the main challenge: most centres operate on short grant cycles, making long-term planning difficult.',
        ],
      },
      fr: {
        title: 'Une initiative transfrontalière pour la jeunesse veut contrer le recrutement extrémiste',
        excerpt:
          'Un réseau de radios communautaires, de clubs sportifs et de centres de formation professionnelle propose aux jeunes de trois pays du Sahel une autre voie.',
        body: [
          'Un réseau de radios communautaires, de clubs sportifs et de centres de formation professionnelle propose aux jeunes de trois pays du Sahel une autre voie. Selon les organisateurs, le programme a touché plusieurs milliers de participants dès sa première année.',
          "L'initiative s'appuie sur des mentors locaux qui parlent les langues des communautés qu'ils accompagnent, une approche qui, selon les chercheurs, instaure la confiance plus rapidement que les campagnes descendantes.",
          'Le financement reste le principal défi : la plupart des centres fonctionnent avec des subventions de courte durée, ce qui complique la planification à long terme.',
        ],
      },
      tr: {
        title: 'Sınır ötesi gençlik girişimi, aşırılıkçı grupların gençleri devşirmesine karşı mücadele ediyor',
        excerpt:
          'Topluluk radyoları, spor kulüpleri ve meslek merkezlerinden oluşan bir ağ, üç Sahel ülkesindeki gençlere alternatif bir yol sunuyor.',
        body: [
          'Topluluk radyoları, spor kulüpleri ve meslek merkezlerinden oluşan bir ağ, üç Sahel ülkesindeki gençlere alternatif bir yol sunuyor. Organizatörlere göre program ilk yılında birkaç bin katılımcıya ulaştı.',
          'Girişim, hizmet verdiği toplulukların dillerini konuşan yerel mentorlara dayanıyor. Araştırmacılar bu yaklaşımın, yukarıdan aşağı kampanyalara göre güveni daha hızlı inşa ettiğini söylüyor.',
          'Finansman en büyük sorun olmaya devam ediyor: merkezlerin çoğu kısa vadeli hibelerle çalıştığı için uzun vadeli planlama yapmak zorlaşıyor.',
        ],
      },
      ar: {
        title: 'مبادرة شبابية عابرة للحدود لمواجهة التجنيد المتطرف',
        excerpt: 'تقدّم شبكة من الإذاعات المجتمعية والأندية الرياضية ومراكز التدريب المهني مساراً بديلاً للشباب في ثلاث دول من الساحل.',
        body: [
          'تقدّم شبكة من الإذاعات المجتمعية والأندية الرياضية ومراكز التدريب المهني مساراً بديلاً للشباب في ثلاث دول من الساحل. ويقول المنظمون إن البرنامج وصل إلى عدة آلاف من المشاركين في عامه الأول.',
          'وتعتمد المبادرة على مرشدين محليين يتحدثون لغات المجتمعات التي يخدمونها، وهو نهج يرى الباحثون أنه يبني الثقة أسرع من الحملات الفوقية.',
          'ويظل التمويل التحدي الأكبر، إذ تعمل معظم المراكز بمنح قصيرة الأجل، ما يصعّب التخطيط على المدى الطويل.',
        ],
      },
    },
  },
  {
    slug: 'sahel-regional-integration',
    section: 'sahel',
    type: 'analysis',
    desk: 'analysis',
    date: '2026-11-03T09:00:00Z',
    readMin: 9,
    art: 'map',
    views: 15800,
    i18n: {
      en: {
        title: "Why regional integration will define the Sahel's next decade",
        excerpt: 'Security dominates the headlines, but trade, transport and energy links may prove more decisive for long-term stability.',
        body: [
          'Security dominates the headlines, but trade, transport and energy links may prove more decisive for long-term stability. Countries that share markets also share an interest in keeping borders open and roads safe.',
          'Three factors stand out: the cost of moving goods, the reliability of power supply, and the ability of young people to find work close to home. Progress on any one of them reinforces the others.',
          "The risk is fragmentation. Without coordinated standards, each country builds its own rules, and the region's combined market of more than 100 million people remains divided into small, expensive pieces.",
          'What to watch: customs harmonisation, cross-border electricity projects, and whether regional institutions can deliver tangible results that citizens notice in daily life.',
        ],
      },
      fr: {
        title: "Pourquoi l'intégration régionale définira la prochaine décennie du Sahel",
        excerpt:
          'La sécurité domine l’actualité, mais les liaisons commerciales, routières et énergétiques pourraient s’avérer plus décisives pour la stabilité à long terme.',
        body: [
          'La sécurité domine l’actualité, mais les liaisons commerciales, routières et énergétiques pourraient s’avérer plus décisives pour la stabilité à long terme. Les pays qui partagent des marchés partagent aussi un intérêt à garder les frontières ouvertes et les routes sûres.',
          'Trois facteurs se détachent : le coût du transport des marchandises, la fiabilité de l’approvisionnement électrique et la capacité des jeunes à trouver un emploi près de chez eux. Tout progrès sur l’un renforce les autres.',
          'Le risque est la fragmentation. Sans normes coordonnées, chaque pays fixe ses propres règles, et le marché régional de plus de 100 millions d’habitants reste morcelé en petits segments coûteux.',
          'À surveiller : l’harmonisation douanière, les projets électriques transfrontaliers et la capacité des institutions régionales à produire des résultats tangibles au quotidien.',
        ],
      },
      tr: {
        title: "Bölgesel entegrasyon neden Sahel'in önümüzdeki on yılını belirleyecek?",
        excerpt: 'Manşetlere güvenlik hâkim, ancak ticaret, ulaşım ve enerji bağlantıları uzun vadeli istikrar için daha belirleyici olabilir.',
        body: [
          'Manşetlere güvenlik hâkim, ancak ticaret, ulaşım ve enerji bağlantıları uzun vadeli istikrar için daha belirleyici olabilir. Pazarlarını paylaşan ülkeler, sınırları açık ve yolları güvenli tutmakta da ortak çıkara sahip olur.',
          'Üç etken öne çıkıyor: malların taşınma maliyeti, enerji arzının güvenilirliği ve gençlerin yaşadıkları yere yakın iş bulabilmesi. Bunlardan birinde sağlanan ilerleme diğerlerini de güçlendiriyor.',
          'Asıl risk parçalanma. Ortak standartlar olmadan her ülke kendi kurallarını koyar ve 100 milyonu aşkın nüfusa sahip bölgesel pazar küçük ve pahalı parçalara bölünmüş olarak kalır.',
          'İzlenmesi gerekenler: gümrük uyumu, sınır ötesi elektrik projeleri ve bölgesel kurumların vatandaşların günlük hayatta hissedeceği somut sonuçlar üretip üretemeyeceği.',
        ],
      },
      ar: {
        title: 'لماذا سيحدد التكامل الإقليمي ملامح العقد المقبل في الساحل؟',
        excerpt: 'يتصدّر الأمن العناوين، لكن روابط التجارة والنقل والطاقة قد تكون أكثر حسماً في تحقيق الاستقرار على المدى البعيد.',
        body: [
          'يتصدّر الأمن العناوين، لكن روابط التجارة والنقل والطاقة قد تكون أكثر حسماً في تحقيق الاستقرار على المدى البعيد. فالدول التي تتشارك الأسواق تتشارك أيضاً مصلحة إبقاء الحدود مفتوحة والطرق آمنة.',
          'ثلاثة عوامل تبرز هنا: كلفة نقل البضائع، وموثوقية إمدادات الكهرباء، وقدرة الشباب على إيجاد عمل قريباً من مناطقهم. وأي تقدم في أحدها يعزز العاملين الآخرين.',
          'الخطر يكمن في التشرذم؛ فمن دون معايير منسّقة تضع كل دولة قواعدها الخاصة، ويبقى السوق الإقليمي الذي يضم أكثر من 100 مليون نسمة مقسّماً إلى أجزاء صغيرة ومكلفة.',
          'ما ينبغي متابعته: مواءمة الأنظمة الجمركية، ومشاريع الربط الكهربائي العابرة للحدود، ومدى قدرة المؤسسات الإقليمية على تحقيق نتائج ملموسة يلمسها المواطن في حياته اليومية.',
        ],
      },
    },
  },
  {
    slug: 'lake-chad-farmers',
    section: 'chad',
    type: 'news',
    desk: 'chad',
    date: '2026-11-02T11:20:00Z',
    readMin: 6,
    art: 'river',
    verified: true,
    views: 9700,
    i18n: {
      en: {
        title: 'Lake Chad basin: farmers adapt to shifting waters',
        excerpt: 'Floating gardens, drought-tolerant seeds and new irrigation cooperatives are changing how communities around the lake grow food.',
        body: [
          'Floating gardens, drought-tolerant seeds and new irrigation cooperatives are changing how communities around the lake grow food. Farmers describe seasons that are harder to predict than a generation ago.',
          'Agronomists working in the basin say small, locally managed projects have shown better results than large infrastructure schemes, largely because they adapt quickly to the water level.',
          'Access to credit and storage remains limited, meaning many harvests are sold at low prices immediately after collection.',
        ],
      },
      fr: {
        title: 'Bassin du lac Tchad : les agriculteurs s’adaptent aux eaux changeantes',
        excerpt:
          'Jardins flottants, semences résistantes à la sécheresse et nouvelles coopératives d’irrigation transforment la manière dont les communautés riveraines cultivent.',
        body: [
          'Jardins flottants, semences résistantes à la sécheresse et nouvelles coopératives d’irrigation transforment la manière dont les communautés riveraines cultivent. Les agriculteurs décrivent des saisons plus difficiles à prévoir qu’il y a une génération.',
          'Les agronomes présents dans le bassin affirment que les petits projets gérés localement donnent de meilleurs résultats que les grandes infrastructures, notamment parce qu’ils s’adaptent rapidement au niveau de l’eau.',
          'L’accès au crédit et au stockage reste limité, si bien que de nombreuses récoltes sont vendues à bas prix dès leur collecte.',
        ],
      },
      tr: {
        title: 'Çad Gölü havzası: çiftçiler değişen sulara uyum sağlıyor',
        excerpt: 'Yüzen bahçeler, kuraklığa dayanıklı tohumlar ve yeni sulama kooperatifleri, göl çevresindeki toplulukların gıda üretme biçimini değiştiriyor.',
        body: [
          'Yüzen bahçeler, kuraklığa dayanıklı tohumlar ve yeni sulama kooperatifleri, göl çevresindeki toplulukların gıda üretme biçimini değiştiriyor. Çiftçiler, mevsimlerin bir kuşak öncesine göre çok daha öngörülemez olduğunu anlatıyor.',
          'Havzada çalışan tarım uzmanları, yerel olarak yönetilen küçük projelerin büyük altyapı planlarından daha iyi sonuç verdiğini, bunun başlıca nedeninin de su seviyesine hızla uyum sağlayabilmeleri olduğunu söylüyor.',
          'Krediye ve depolama imkânlarına erişim hâlâ sınırlı; bu nedenle pek çok hasat, toplandıktan hemen sonra düşük fiyatlarla satılıyor.',
        ],
      },
      ar: {
        title: 'حوض بحيرة تشاد: المزارعون يتكيّفون مع تقلّب المياه',
        excerpt: 'تغيّر الحدائق العائمة والبذور المقاومة للجفاف وتعاونيات الري الجديدة طريقةَ إنتاج الغذاء لدى المجتمعات المحيطة بالبحيرة.',
        body: [
          'تغيّر الحدائق العائمة والبذور المقاومة للجفاف وتعاونيات الري الجديدة طريقةَ إنتاج الغذاء لدى المجتمعات المحيطة بالبحيرة. ويصف المزارعون مواسم أصعب في التنبؤ مما كانت عليه قبل جيل.',
          'ويقول خبراء زراعيون يعملون في الحوض إن المشاريع الصغيرة المُدارة محلياً حققت نتائج أفضل من مشاريع البنية التحتية الكبرى، لأنها تتكيّف بسرعة مع منسوب المياه.',
          'ولا يزال الوصول إلى التمويل ومرافق التخزين محدوداً، ما يدفع كثيرين إلى بيع محاصيلهم بأسعار منخفضة فور جنيها.',
        ],
      },
    },
  },
  {
    slug: 'africa-digital-payments',
    section: 'africa',
    type: 'news',
    desk: 'africa',
    date: '2026-11-02T07:45:00Z',
    readMin: 4,
    art: 'grid',
    views: 8800,
    i18n: {
      en: {
        title: "Cross-border payments: Africa's digital rails gather pace",
        excerpt: 'Banks and fintech firms are connecting national payment systems, promising cheaper transfers between African currencies.',
        body: [
          'Banks and fintech firms are connecting national payment systems, promising cheaper transfers between African currencies. For small exporters, the change could remove the need to convert through a third currency.',
          'Central bankers say adoption depends on trust: merchants need to see settlements arrive reliably before switching from established channels.',
          'Mobile money operators are expected to play a key role in reaching customers outside major cities.',
        ],
      },
      fr: {
        title: 'Paiements transfrontaliers : les rails numériques de l’Afrique accélèrent',
        excerpt: 'Banques et fintechs interconnectent les systèmes de paiement nationaux, promettant des transferts moins coûteux entre monnaies africaines.',
        body: [
          'Banques et fintechs interconnectent les systèmes de paiement nationaux, promettant des transferts moins coûteux entre monnaies africaines. Pour les petits exportateurs, ce changement pourrait éviter de passer par une devise tierce.',
          'Les banquiers centraux estiment que l’adoption dépendra de la confiance : les commerçants doivent constater des règlements fiables avant d’abandonner les circuits établis.',
          'Les opérateurs de mobile money devraient jouer un rôle clé pour atteindre les clients hors des grandes villes.',
        ],
      },
      tr: {
        title: "Sınır ötesi ödemeler: Afrika'nın dijital altyapısı hız kazanıyor",
        excerpt: 'Bankalar ve fintek şirketleri ulusal ödeme sistemlerini birbirine bağlayarak Afrika para birimleri arasında daha ucuz transferler vadediyor.',
        body: [
          'Bankalar ve fintek şirketleri ulusal ödeme sistemlerini birbirine bağlayarak Afrika para birimleri arasında daha ucuz transferler vadediyor. Küçük ihracatçılar için bu değişiklik, üçüncü bir para birimi üzerinden çevirme ihtiyacını ortadan kaldırabilir.',
          'Merkez bankacılarına göre yaygınlaşma güvene bağlı: tüccarların yerleşik kanalları bırakmadan önce ödemelerin güvenilir biçimde ulaştığını görmesi gerekiyor.',
          'Mobil para operatörlerinin büyük şehirlerin dışındaki müşterilere ulaşmada kilit rol oynaması bekleniyor.',
        ],
      },
      ar: {
        title: 'المدفوعات العابرة للحدود: البنية الرقمية الأفريقية تتسارع',
        excerpt: 'تعمل البنوك وشركات التكنولوجيا المالية على ربط أنظمة الدفع الوطنية، واعدةً بتحويلات أقل كلفة بين العملات الأفريقية.',
        body: [
          'تعمل البنوك وشركات التكنولوجيا المالية على ربط أنظمة الدفع الوطنية، واعدةً بتحويلات أقل كلفة بين العملات الأفريقية. وبالنسبة لصغار المصدّرين، قد يُغني هذا التحول عن المرور بعملة ثالثة.',
          'ويرى مسؤولون في البنوك المركزية أن الانتشار مرهون بالثقة، إذ يحتاج التجار إلى رؤية تسويات منتظمة قبل التخلي عن القنوات المعتادة.',
          'ومن المتوقع أن يؤدي مشغّلو خدمات الدفع عبر الهاتف المحمول دوراً محورياً في الوصول إلى العملاء خارج المدن الكبرى.',
        ],
      },
    },
  },
  {
    slug: 'chad-gum-arabic-explainer',
    section: 'chad',
    type: 'analysis',
    desk: 'analysis',
    date: '2026-11-01T10:00:00Z',
    readMin: 7,
    art: 'sahel',
    views: 11200,
    i18n: {
      en: {
        title: "Explainer: how Chad's gum arabic economy works",
        excerpt: "From acacia trees in the Sahel to soft drinks and medicines worldwide — a look at one of Chad's most important exports.",
        body: [
          "From acacia trees in the Sahel to soft drinks and medicines worldwide, gum arabic is one of Chad's most important exports. The resin is harvested by hand during the dry season, mostly by rural families.",
          'Most of the value is added abroad, where the raw gum is cleaned, processed and sold to food and pharmaceutical companies. Local processing could keep more of that value in the country.',
          'Prices depend on global demand and on harvest conditions, which makes incomes volatile for collectors.',
          'Key questions: can cooperatives negotiate better prices, and can investment in local processing plants turn a raw commodity into a value-added industry?',
        ],
      },
      fr: {
        title: 'Décryptage : comment fonctionne l’économie de la gomme arabique au Tchad',
        excerpt: 'Des acacias du Sahel aux boissons et médicaments du monde entier — regard sur l’une des principales exportations du Tchad.',
        body: [
          'Des acacias du Sahel aux boissons et médicaments du monde entier, la gomme arabique figure parmi les principales exportations du Tchad. La résine est récoltée à la main pendant la saison sèche, surtout par des familles rurales.',
          'L’essentiel de la valeur est ajouté à l’étranger, où la gomme brute est nettoyée, transformée puis vendue aux industries agroalimentaire et pharmaceutique. Une transformation locale permettrait d’en conserver davantage dans le pays.',
          'Les prix dépendent de la demande mondiale et des conditions de récolte, ce qui rend les revenus des cueilleurs très instables.',
          'Questions clés : les coopératives peuvent-elles négocier de meilleurs prix, et l’investissement dans des unités de transformation locales peut-il faire d’une matière première une industrie à valeur ajoutée ?',
        ],
      },
      tr: {
        title: "Açıklayıcı: Çad'ın arap zamkı ekonomisi nasıl işliyor?",
        excerpt: "Sahel'deki akasya ağaçlarından dünyadaki içecek ve ilaçlara — Çad'ın en önemli ihraç ürünlerinden birine yakından bakış.",
        body: [
          "Sahel'deki akasya ağaçlarından dünya genelindeki içecek ve ilaçlara uzanan arap zamkı, Çad'ın en önemli ihraç ürünlerinden biri. Reçine, kurak mevsimde çoğunlukla kırsal aileler tarafından elle toplanıyor.",
          'Katma değerin büyük kısmı yurt dışında oluşuyor; ham zamk orada temizlenip işleniyor ve gıda ile ilaç şirketlerine satılıyor. Yerel işleme, bu değerin daha fazlasının ülkede kalmasını sağlayabilir.',
          'Fiyatlar küresel talebe ve hasat koşullarına bağlı olduğundan toplayıcıların gelirleri oldukça dalgalı.',
          'Kilit sorular: Kooperatifler daha iyi fiyatlar için pazarlık edebilir mi ve yerel işleme tesislerine yapılacak yatırımlar ham bir ürünü katma değerli bir sanayiye dönüştürebilir mi?',
        ],
      },
      ar: {
        title: 'شرح مبسّط: كيف يعمل اقتصاد الصمغ العربي في تشاد؟',
        excerpt: 'من أشجار الأكاسيا في الساحل إلى المشروبات والأدوية حول العالم — نظرة على أحد أهم صادرات تشاد.',
        body: [
          'من أشجار الأكاسيا في الساحل إلى المشروبات والأدوية حول العالم، يُعدّ الصمغ العربي من أهم صادرات تشاد. ويُجمع يدوياً خلال موسم الجفاف، في الغالب على أيدي أسر ريفية.',
          'وتُضاف معظم القيمة في الخارج، حيث يُنظَّف الصمغ الخام ويُعالَج ثم يُباع لشركات الأغذية والأدوية. ومن شأن التصنيع المحلي أن يُبقي جزءاً أكبر من هذه القيمة داخل البلاد.',
          'وترتبط الأسعار بالطلب العالمي وظروف الحصاد، ما يجعل دخل الجامعين متقلباً.',
          'أسئلة جوهرية: هل تستطيع التعاونيات التفاوض على أسعار أفضل؟ وهل يمكن للاستثمار في مصانع محلية أن يحوّل سلعة خام إلى صناعة ذات قيمة مضافة؟',
        ],
      },
    },
  },
  {
    slug: 'sahel-solar-clinics',
    section: 'sahel',
    type: 'news',
    desk: 'sahel',
    date: '2026-10-31T13:30:00Z',
    readMin: 3,
    art: 'sahel',
    verified: true,
    views: 7300,
    i18n: {
      en: {
        title: 'Solar mini-grids bring evening light to rural clinics',
        excerpt: 'Health workers say reliable power is changing night-time care, from childbirth to vaccine storage.',
        body: [
          'Health workers say reliable power is changing night-time care, from childbirth to vaccine storage. Several rural clinics now run refrigerators and lighting around the clock.',
          'Project managers point to maintenance as the decisive factor: trained local technicians keep systems running far longer than equipment alone.',
          'Communities are now asking for the same grids to power schools and water pumps.',
        ],
      },
      fr: {
        title: 'Des mini-réseaux solaires éclairent les dispensaires ruraux',
        excerpt: 'Selon les soignants, une électricité fiable transforme les soins nocturnes, des accouchements à la conservation des vaccins.',
        body: [
          'Selon les soignants, une électricité fiable transforme les soins nocturnes, des accouchements à la conservation des vaccins. Plusieurs dispensaires ruraux font désormais fonctionner réfrigérateurs et éclairage jour et nuit.',
          'Les chefs de projet soulignent que la maintenance est décisive : des techniciens locaux formés prolongent bien davantage la durée de vie des installations que l’équipement seul.',
          'Les communautés demandent désormais que ces réseaux alimentent aussi les écoles et les pompes à eau.',
        ],
      },
      tr: {
        title: 'Güneş enerjili mini şebekeler kırsal kliniklere gece ışığı getiriyor',
        excerpt: 'Sağlık çalışanları, kesintisiz elektriğin doğumdan aşı saklamaya kadar gece bakımını değiştirdiğini söylüyor.',
        body: [
          'Sağlık çalışanları, kesintisiz elektriğin doğumdan aşı saklamaya kadar gece bakımını değiştirdiğini söylüyor. Birçok kırsal klinik artık buzdolaplarını ve aydınlatmayı günün her saatinde çalıştırabiliyor.',
          'Proje yöneticileri belirleyici etkenin bakım olduğuna dikkat çekiyor: eğitimli yerel teknisyenler, sistemlerin yalnızca ekipmana dayanan kurulumlardan çok daha uzun süre çalışmasını sağlıyor.',
          'Topluluklar şimdi aynı şebekelerin okullara ve su pompalarına da enerji sağlamasını talep ediyor.',
        ],
      },
      ar: {
        title: 'شبكات شمسية صغيرة تضيء العيادات الريفية ليلاً',
        excerpt: 'يقول العاملون الصحيون إن الكهرباء المستقرة تغيّر الرعاية الليلية، من الولادة إلى حفظ اللقاحات.',
        body: [
          'يقول العاملون الصحيون إن الكهرباء المستقرة تغيّر الرعاية الليلية، من الولادة إلى حفظ اللقاحات. وباتت عدة عيادات ريفية تشغّل الثلاجات والإنارة على مدار الساعة.',
          'ويؤكد مديرو المشاريع أن الصيانة هي العامل الحاسم، إذ يُطيل الفنيون المحليون المدرَّبون عمر الأنظمة أكثر بكثير من المعدات وحدها.',
          'وتطالب المجتمعات المحلية اليوم بأن تمتد هذه الشبكات لتغذية المدارس ومضخات المياه.',
        ],
      },
    },
  },
  {
    slug: 'turkey-africa-trade',
    section: 'africa',
    type: 'analysis',
    desk: 'analysis',
    date: '2026-10-30T09:15:00Z',
    readMin: 8,
    art: 'trade',
    views: 13600,
    i18n: {
      en: {
        title: 'Turkey–Africa trade: what the numbers tell us',
        excerpt: 'Expanding flight routes, construction contracts and consumer goods have deepened ties. We look at where the relationship is heading.',
        body: [
          'Expanding flight routes, construction contracts and consumer goods have deepened ties between Turkey and many African countries over the past two decades.',
          'For African importers, Turkish products often sit between European quality and Asian prices. For Turkish firms, Africa offers fast-growing markets and long-term infrastructure demand.',
          'The next phase may depend on balance: African governments increasingly ask for local production, technology transfer and training rather than imports alone.',
          'Education is a quieter but significant channel, with thousands of African students in Turkish universities building professional networks between both regions.',
        ],
      },
      fr: {
        title: 'Commerce Turquie–Afrique : ce que disent les chiffres',
        excerpt: 'Nouvelles lignes aériennes, contrats de construction et biens de consommation ont resserré les liens. Où va cette relation ?',
        body: [
          'Nouvelles lignes aériennes, contrats de construction et biens de consommation ont resserré les liens entre la Turquie et de nombreux pays africains au cours des vingt dernières années.',
          'Pour les importateurs africains, les produits turcs se situent souvent entre la qualité européenne et les prix asiatiques. Pour les entreprises turques, l’Afrique offre des marchés en forte croissance et une demande durable en infrastructures.',
          'La prochaine étape pourrait dépendre de l’équilibre : les gouvernements africains réclament de plus en plus de production locale, de transferts de technologie et de formation plutôt que de simples importations.',
          'L’éducation constitue un canal plus discret mais important : des milliers d’étudiants africains dans les universités turques tissent des réseaux professionnels entre les deux régions.',
        ],
      },
      tr: {
        title: 'Türkiye–Afrika ticareti: Rakamlar ne anlatıyor?',
        excerpt: 'Genişleyen uçuş ağları, inşaat sözleşmeleri ve tüketim ürünleri bağları derinleştirdi. İlişkinin nereye gittiğine bakıyoruz.',
        body: [
          'Genişleyen uçuş ağları, inşaat sözleşmeleri ve tüketim ürünleri, son yirmi yılda Türkiye ile pek çok Afrika ülkesi arasındaki bağları derinleştirdi.',
          'Afrikalı ithalatçılar için Türk ürünleri çoğu zaman Avrupa kalitesi ile Asya fiyatları arasında bir yerde konumlanıyor. Türk firmaları içinse Afrika, hızla büyüyen pazarlar ve uzun vadeli altyapı talebi sunuyor.',
          'Bir sonraki aşama dengeye bağlı olabilir: Afrika hükümetleri yalnızca ithalat yerine giderek daha fazla yerel üretim, teknoloji transferi ve eğitim talep ediyor.',
          'Eğitim ise daha sessiz ama önemli bir kanal: Türk üniversitelerinde okuyan binlerce Afrikalı öğrenci iki bölge arasında mesleki ağlar kuruyor.',
        ],
      },
      ar: {
        title: 'التجارة التركية الأفريقية: ماذا تقول الأرقام؟',
        excerpt: 'عمّقت خطوط الطيران المتوسعة وعقود الإنشاءات والسلع الاستهلاكية العلاقات بين الجانبين. نستعرض إلى أين تتجه هذه العلاقة.',
        body: [
          'عمّقت خطوط الطيران المتوسعة وعقود الإنشاءات والسلع الاستهلاكية العلاقات بين تركيا والعديد من الدول الأفريقية خلال العقدين الماضيين.',
          'فبالنسبة للمستوردين الأفارقة، تقع المنتجات التركية غالباً بين الجودة الأوروبية والأسعار الآسيوية. أما الشركات التركية فتجد في أفريقيا أسواقاً سريعة النمو وطلباً طويل الأمد على البنية التحتية.',
          'وقد تتوقف المرحلة المقبلة على التوازن، إذ تطالب الحكومات الأفريقية بشكل متزايد بالإنتاج المحلي ونقل التكنولوجيا والتدريب بدلاً من الاستيراد وحده.',
          'ويمثّل التعليم قناة أهدأ لكنها مؤثرة، حيث يبني آلاف الطلاب الأفارقة في الجامعات التركية شبكات مهنية بين المنطقتين.',
        ],
      },
    },
  },
  {
    slug: 'bilingual-universities',
    section: 'africa',
    type: 'news',
    desk: 'africa',
    date: '2026-10-29T16:00:00Z',
    readMin: 4,
    art: 'city',
    views: 6400,
    i18n: {
      en: {
        title: 'Universities expand Arabic–French bilingual programmes',
        excerpt: 'New degree tracks aim to prepare graduates for careers in diplomacy, trade and media across North, West and Central Africa.',
        body: [
          'New degree tracks aim to prepare graduates for careers in diplomacy, trade and media across North, West and Central Africa. Enrolment in the first intakes has exceeded expectations.',
          'Faculty members say bilingual graduates are increasingly sought by regional organisations and international companies operating in the Sahel.',
          'Students also point to growing exchange opportunities with universities in Turkey, the Gulf and Europe.',
        ],
      },
      fr: {
        title: 'Les universités développent des cursus bilingues arabe–français',
        excerpt: 'De nouvelles filières préparent les diplômés à des carrières dans la diplomatie, le commerce et les médias en Afrique du Nord, de l’Ouest et centrale.',
        body: [
          'De nouvelles filières préparent les diplômés à des carrières dans la diplomatie, le commerce et les médias en Afrique du Nord, de l’Ouest et centrale. Les inscriptions des premières promotions ont dépassé les attentes.',
          'Les enseignants observent que les diplômés bilingues sont de plus en plus recherchés par les organisations régionales et les entreprises internationales présentes au Sahel.',
          'Les étudiants évoquent aussi des possibilités d’échange croissantes avec des universités en Turquie, dans le Golfe et en Europe.',
        ],
      },
      tr: {
        title: 'Üniversiteler Arapça–Fransızca çift dilli programlarını genişletiyor',
        excerpt: "Yeni lisans programları, mezunları Kuzey, Batı ve Orta Afrika'da diplomasi, ticaret ve medya alanlarındaki kariyerlere hazırlamayı amaçlıyor.",
        body: [
          "Yeni lisans programları, mezunları Kuzey, Batı ve Orta Afrika'da diplomasi, ticaret ve medya alanlarındaki kariyerlere hazırlamayı amaçlıyor. İlk dönemlerdeki kayıtlar beklentileri aştı.",
          "Öğretim üyeleri, çift dilli mezunların bölgesel kuruluşlar ve Sahel'de faaliyet gösteren uluslararası şirketler tarafından giderek daha fazla arandığını belirtiyor.",
          "Öğrenciler ayrıca Türkiye, Körfez ve Avrupa'daki üniversitelerle artan değişim fırsatlarına dikkat çekiyor.",
        ],
      },
      ar: {
        title: 'الجامعات توسّع برامجها الثنائية باللغتين العربية والفرنسية',
        excerpt: 'تهدف مسارات دراسية جديدة إلى إعداد الخريجين لمهن في الدبلوماسية والتجارة والإعلام في شمال أفريقيا وغربها ووسطها.',
        body: [
          'تهدف مسارات دراسية جديدة إلى إعداد الخريجين لمهن في الدبلوماسية والتجارة والإعلام في شمال أفريقيا وغربها ووسطها. وقد فاق عدد المسجلين في الدفعات الأولى التوقعات.',
          'ويقول أعضاء هيئة التدريس إن المنظمات الإقليمية والشركات الدولية العاملة في الساحل تطلب الخريجين ثنائيي اللغة بشكل متزايد.',
          'ويشير الطلاب أيضاً إلى تزايد فرص التبادل مع جامعات في تركيا والخليج وأوروبا.',
        ],
      },
    },
  },
  {
    slug: 'ndjamena-tech-hub',
    section: 'chad',
    type: 'news',
    desk: 'chad',
    date: '2026-10-28T12:40:00Z',
    readMin: 3,
    art: 'city',
    views: 5900,
    i18n: {
      en: {
        title: "Young coders in N'Djamena build apps for local markets",
        excerpt: 'A new innovation hub offers training, shared workspace and mentoring for startups solving everyday problems.',
        body: [
          'A new innovation hub offers training, shared workspace and mentoring for startups solving everyday problems, from price tracking in markets to school timetables.',
          'Founders say unreliable internet and limited access to finance are their biggest obstacles, but demand for locally built tools is growing.',
          'Several teams are building their apps in both Arabic and French to reach more users.',
        ],
      },
      fr: {
        title: "À N'Djamena, de jeunes développeurs créent des applis pour les marchés locaux",
        excerpt: 'Un nouveau pôle d’innovation propose formation, espace de travail partagé et mentorat aux startups qui répondent aux problèmes du quotidien.',
        body: [
          'Un nouveau pôle d’innovation propose formation, espace de travail partagé et mentorat aux startups qui répondent aux problèmes du quotidien, du suivi des prix sur les marchés aux emplois du temps scolaires.',
          'Les fondateurs citent la connexion internet instable et l’accès limité au financement comme principaux obstacles, mais la demande d’outils conçus localement progresse.',
          'Plusieurs équipes développent leurs applications à la fois en arabe et en français pour toucher davantage d’utilisateurs.',
        ],
      },
      tr: {
        title: "N'Djamena'da genç yazılımcılar yerel pazarlar için uygulama geliştiriyor",
        excerpt: 'Yeni bir inovasyon merkezi, gündelik sorunlara çözüm üreten girişimlere eğitim, ortak çalışma alanı ve mentorluk sunuyor.',
        body: [
          'Yeni bir inovasyon merkezi, pazarlardaki fiyat takibinden okul ders programlarına kadar gündelik sorunlara çözüm üreten girişimlere eğitim, ortak çalışma alanı ve mentorluk sunuyor.',
          'Kurucular, istikrarsız internet bağlantısı ve finansmana sınırlı erişimin en büyük engelleri olduğunu söylüyor; ancak yerel olarak geliştirilen araçlara talep artıyor.',
          'Birçok ekip, daha fazla kullanıcıya ulaşmak için uygulamalarını hem Arapça hem Fransızca olarak geliştiriyor.',
        ],
      },
      ar: {
        title: 'شباب مبرمجون في انجامينا يطوّرون تطبيقات للأسواق المحلية',
        excerpt: 'يوفّر مركز ابتكار جديد التدريب ومساحات العمل المشتركة والإرشاد للشركات الناشئة التي تعالج مشكلات الحياة اليومية.',
        body: [
          'يوفّر مركز ابتكار جديد التدريب ومساحات العمل المشتركة والإرشاد للشركات الناشئة التي تعالج مشكلات الحياة اليومية، من تتبّع الأسعار في الأسواق إلى الجداول المدرسية.',
          'ويقول المؤسسون إن ضعف الإنترنت ومحدودية الوصول إلى التمويل أكبر العقبات أمامهم، غير أن الطلب على الأدوات المطوّرة محلياً في تزايد.',
          'وتعمل عدة فرق على تطوير تطبيقاتها باللغتين العربية والفرنسية للوصول إلى عدد أكبر من المستخدمين.',
        ],
      },
    },
  },
];

export const VIDEOS: Video[] = [
  {
    id: 'ndjamena-market',
    section: 'chad',
    duration: '4:12',
    art: 'city',
    date: '2026-11-03T10:00:00Z',
    title: {
      en: "Inside N'Djamena's central market",
      fr: "Au cœur du grand marché de N'Djamena",
      tr: "N'Djamena merkez pazarının içinden",
      ar: 'جولة داخل السوق المركزي في انجامينا',
    },
  },
  {
    id: 'lake-chad-waters',
    section: 'chad',
    duration: '7:45',
    art: 'river',
    date: '2026-11-01T10:00:00Z',
    title: {
      en: 'Lake Chad: living with changing waters',
      fr: 'Lac Tchad : vivre avec des eaux changeantes',
      tr: 'Çad Gölü: değişen sularla yaşamak',
      ar: 'بحيرة تشاد: العيش مع تقلّب المياه',
    },
  },
  {
    id: 'sahel-explained',
    section: 'sahel',
    duration: '3:05',
    art: 'map',
    date: '2026-10-30T10:00:00Z',
    title: {
      en: 'The Sahel in 3 minutes: key issues explained',
      fr: 'Le Sahel en 3 minutes : les enjeux expliqués',
      tr: '3 dakikada Sahel: temel meseleler',
      ar: 'الساحل في 3 دقائق: أبرز القضايا',
    },
  },
  {
    id: 'students-istanbul',
    section: 'africa',
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

/** Site-wide settings — update with real contact details and social accounts. */
export const SITE = {
  email: 'contact@afrivue.info',
  social: {
    x: '#',
    facebook: '#',
    instagram: '#',
    youtube: '#',
    telegram: '#',
  },
};

export const byDate = (a: { date: string }, b: { date: string }) => b.date.localeCompare(a.date);
export const getArticle = (slug: string) => ARTICLES.find((a) => a.slug === slug);
