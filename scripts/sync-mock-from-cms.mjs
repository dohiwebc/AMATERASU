/**
 * microCMS の内容を src/data/mock.ts に同期する
 * 実行: node --env-file=.env scripts/sync-mock-from-cms.mjs
 */
import { createClient } from 'microcms-js-sdk';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;

if (!serviceDomain || !apiKey) {
  console.error('MICROCMS_SERVICE_DOMAIN と MICROCMS_API_KEY を .env に設定してください。');
  process.exit(1);
}

const client = createClient({ serviceDomain, apiKey });

const LEGACY_WORK_TYPE_MAP = {
  client: '実案件',
  self: '自主制作',
  fictional: '架空案件',
  sample: 'サンプル',
};

const LEGACY_SITE_TYPE_MAP = {
  normal: '通常サイト',
  mini: 'ミニ制作',
  通常サイト: '通常サイト',
  ミニ制作: 'ミニ制作',
  本格制作: '通常サイト',
  LP: 'LP',
  Webアプリ: 'Webアプリ',
  その他: 'その他',
};

const VALID_WORK_TYPES = new Set(['実案件', '自主制作', '架空案件', '非公開案件', 'サンプル']);
const VALID_SITE_TYPES = new Set(['通常サイト', 'ミニ制作', 'Webアプリ', 'LP', 'その他']);

const DEFAULT_CONTACT_SETTINGS = {
  emailDescription: 'フォーム以外でもメールでお問い合わせいただけます。',
  formDescription:
    '下記フォームよりお送りください。事業内容やご希望が分かると、より具体的なご提案ができます。',
  submitButtonText: '送信する',
  studioNoteLead:
    '新規のご相談を受け付けております。\nスケジュールの詳細は、お問い合わせ時にご案内します。',
  closedNoteLead:
    '現在、新規のご相談の受付を一時休止しております。\n再開までいましばらくお待ちください。',
  closedReplyTime: '受付再開の時期は、お知らせページにてご案内いたします。',
  tips: [
    '事業内容・お店のジャンル',
    'ホームページで実現したいこと',
    'ご予算の目安',
    '希望のスケジュール',
    '参考にしたいサイトがあればURL',
  ].join('\n'),
};

function pickSelectValue(value, legacyMap) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return undefined;
  const mapped = legacyMap?.[raw] ?? raw;
  return mapped;
}

function toMultilineText(value) {
  if (!value) return '';
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean).join('\n');
  return String(value);
}

function normalizeSiteSettings(raw) {
  const brandName = raw.tradeName ?? raw.brandName ?? '天照';
  const brandDisplay = raw.brandName ?? 'AMATERASU Web Studio';
  const catchCopy = raw.tagline ?? raw.heroCopy ?? raw.catchCopy ?? '';
  const location = String(raw.baseArea ?? raw.location ?? '')
    .trim()
    .replace(/\s+/g, '・')
    .replace(/・+/g, '・');

  return {
    brandName,
    brandDisplay,
    logoText: raw.logoText ?? 'AMATERASU',
    catchCopy,
    heroTitle: raw.heroTitle ?? catchCopy,
    heroSubtitle: raw.heroSubtitle ?? catchCopy,
    heroDescription: raw.heroDescription ?? '',
    location,
    serviceDescription: raw.serviceDescription ?? '',
    email: raw.email ?? '',
    instagramUrl: raw.instagramUrl ?? '',
    xUrl: raw.xUrl || undefined,
    footerText: raw.footerText ?? catchCopy,
    seoTitle: raw.seoTitle ?? `${brandDisplay} | ${location || '愛媛・松山'}のWeb制作`,
    seoDescription: raw.seoDescription ?? raw.heroDescription ?? '',
    systemScopeNote: raw.planSystemScopeNote ?? raw.systemScopeNote,
    generalNotes: raw.planGeneralNotes ?? raw.generalNotes,
    miniSystemScopeNote: raw.miniSystemScopeNote,
    miniGeneralNotes: raw.miniGeneralNotes,
    isAcceptingOrders: raw.isAcceptingOrders ?? true,
    acceptanceStatus: raw.acceptanceStatus,
  };
}

function normalizeContactSettings(raw) {
  return {
    title: raw.title ?? 'お問い合わせ',
    description: raw.description ?? '',
    emailDescription: raw.emailDescription ?? DEFAULT_CONTACT_SETTINGS.emailDescription,
    xDescription: raw.xDescription || undefined,
    formDescription: raw.formDescription ?? DEFAULT_CONTACT_SETTINGS.formDescription,
    formspreeEndpoint: raw.formspreeEndpoint ?? '',
    categoryOptions: toMultilineText(raw.categoryOptions),
    planOptions: toMultilineText(raw.planOptions),
    budgetOptions: toMultilineText(raw.budgetOptions),
    submitButtonText: raw.submitButtonText ?? DEFAULT_CONTACT_SETTINGS.submitButtonText,
    replyTime: raw.replyTime ?? '',
    studioNoteLead: raw.studioNoteLead ?? DEFAULT_CONTACT_SETTINGS.studioNoteLead,
    closedNoteLead: raw.closedNoteLead ?? DEFAULT_CONTACT_SETTINGS.closedNoteLead,
    closedReplyTime: raw.closedReplyTime ?? DEFAULT_CONTACT_SETTINGS.closedReplyTime,
    softClosedNoteLead: raw.softClosedNoteLead || undefined,
    softClosedReplyTime: raw.softClosedReplyTime || undefined,
    notifyOnlyNoteLead: raw.notifyOnlyNoteLead || undefined,
    notifyOnlyReplyTime: raw.notifyOnlyReplyTime || undefined,
    tips: toMultilineText(raw.tips) || DEFAULT_CONTACT_SETTINGS.tips,
    ctaTitle: raw.ctaTitle || undefined,
    ctaDescription: raw.ctaDescription || undefined,
  };
}

function normalizeThumbnail(thumbnail) {
  if (!thumbnail) return undefined;
  if (typeof thumbnail === 'string') return thumbnail;
  return thumbnail.url;
}

function parseMultilineField(text) {
  if (!text) return [];
  if (Array.isArray(text)) return text.map((item) => String(item).trim()).filter(Boolean);
  return String(text)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function normalizeWork(raw) {
  const workTypeRaw = pickSelectValue(raw.workType, LEGACY_WORK_TYPE_MAP) ?? 'サンプル';
  const workType = VALID_WORK_TYPES.has(workTypeRaw) ? workTypeRaw : 'サンプル';
  const siteTypeRaw = pickSelectValue(raw.siteType, LEGACY_SITE_TYPE_MAP);
  const siteType = siteTypeRaw && VALID_SITE_TYPES.has(siteTypeRaw) ? siteTypeRaw : undefined;

  return {
    id: raw.id ?? '',
    title: raw.title ?? '',
    slug: raw.slug ?? '',
    workType,
    siteType,
    category: raw.category ?? '',
    shortDescription: raw.shortDescription,
    description: raw.description ?? '',
    purpose: raw.purpose,
    pages: raw.pages,
    technologies: raw.technologies,
    highlights: raw.highlights,
    thumbnail: normalizeThumbnail(raw.thumbnail),
    url: raw.siteUrl ?? raw.url,
    isVisible: raw.isVisible ?? true,
    isFeatured: Boolean(raw.isFeatured),
    sortOrder: raw.sortOrder ?? raw.order ?? 0,
    year: raw.year,
  };
}

function normalizePlan(raw) {
  const siteType = pickSelectValue(raw.siteType ?? raw.category, LEGACY_SITE_TYPE_MAP) ?? 'その他';

  return {
    id: raw.id ?? '',
    title: raw.title ?? '',
    slug: raw.slug ?? '',
    siteType,
    price: raw.price ?? '',
    priceNote: raw.priceNote,
    shortDescription: raw.shortDescription ?? '',
    description: raw.description ?? '',
    recommendedFor: parseMultilineField(raw.recommendedFor),
    publishableContent: parseMultilineField(raw.publishableContent ?? raw.contents),
    pageCount: raw.pageCount ?? '',
    clientProvides: parseMultilineField(raw.clientProvides ?? raw.requiredItems),
    included: parseMultilineField(raw.included),
    notIncluded: parseMultilineField(raw.notIncluded),
    deliveryFormat: raw.deliveryFormat ?? '',
    productionPeriod: raw.productionPeriod ?? raw.deliveryTime ?? '',
    revisionCount: raw.revisionCount ?? '',
    notes: parseMultilineField(raw.notes),
    order: raw.sortOrder ?? raw.order ?? 0,
    isFeatured: raw.isFeatured,
    relatedWorkSlugs: (raw.relatedWorks ?? [])
      .map((ref) => ref.slug ?? ref.id)
      .filter(Boolean),
  };
}

function normalizeNews(raw) {
  const category = pickSelectValue(raw.category) ?? 'info';
  const date = typeof raw.date === 'string' ? raw.date.slice(0, 10) : raw.date;

  return {
    id: raw.id ?? '',
    title: raw.title ?? '',
    slug: raw.slug ?? '',
    body: raw.body ?? '',
    date: date ?? '',
    category,
    isFeatured: Boolean(raw.isFeatured),
    isVisible: raw.isVisible !== false,
    sortOrder: typeof raw.sortOrder === 'number' ? raw.sortOrder : 0,
  };
}

function serializeString(value) {
  if (value === undefined) return undefined;
  return JSON.stringify(value);
}

function serializeObject(obj, indent = 2) {
  const lines = [];
  const pad = ' '.repeat(indent);

  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;

    if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(`${pad}${key}: [],`);
        continue;
      }
      if (typeof value[0] === 'string') {
        lines.push(`${pad}${key}: [`);
        for (const item of value) {
          lines.push(`${pad}  ${serializeString(item)},`);
        }
        lines.push(`${pad}],`);
        continue;
      }
    }

    if (typeof value === 'boolean' || typeof value === 'number') {
      lines.push(`${pad}${key}: ${value},`);
      continue;
    }

    if (typeof value === 'string') {
      if (value.includes('\n')) {
        lines.push(`${pad}${key}:`);
        lines.push(`${pad}  ${serializeString(value)},`);
      } else {
        lines.push(`${pad}${key}: ${serializeString(value)},`);
      }
      continue;
    }

    lines.push(`${pad}${key}: ${JSON.stringify(value)},`);
  }

  return lines.join('\n');
}

function serializeWorks(works) {
  return works
    .map((work) => {
      const fields = serializeObject(work, 4);
      return `  {\n${fields}\n  }`;
    })
    .join(',\n');
}

function serializePlans(plans, workIndexBySlug) {
  return plans
    .map((plan) => {
      const { relatedWorkSlugs, ...rest } = plan;
      const relatedRefs = relatedWorkSlugs
        .map((slug) => workIndexBySlug.get(slug))
        .filter((index) => index !== undefined)
        .map((index) => `mockWorks[${index}]`);

      const lines = [serializeObject(rest, 4)];
      if (relatedRefs.length > 0) {
        lines.push(`    relatedWorks: [${relatedRefs.join(', ')}],`);
      } else {
        lines.push('    relatedWorks: [],');
      }
      return `  {\n${lines.join('\n')}\n  }`;
    })
    .join(',\n');
}

function serializeNews(news) {
  return news
    .map((item) => {
      const fields = serializeObject(item, 4);
      return `  {\n${fields}\n  }`;
    })
    .join(',\n');
}

async function fetchAll() {
  const [siteSettings, contactSettings, plansData, worksData, newsData] = await Promise.all([
    client.get({ endpoint: 'site-settings' }),
    client.get({ endpoint: 'contact-settings' }),
    client.getList({
      endpoint: 'plans',
      queries: { orders: 'sortOrder', depth: 2, limit: 100, filters: 'isVisible[equals]true' },
    }),
    client.getList({
      endpoint: 'works',
      queries: { depth: 2, orders: 'sortOrder', limit: 100, filters: 'isVisible[equals]true' },
    }),
    client.getList({
      endpoint: 'news',
      queries: { orders: '-date', limit: 100, filters: 'isVisible[equals]true' },
    }),
  ]);

  const works = worksData.contents
    .map(normalizeWork)
    .filter((work) => work.isVisible)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const workIndexBySlug = new Map(works.map((work, index) => [work.slug, index]));

  const plans = plansData.contents
    .map(normalizePlan)
    .sort((a, b) => a.order - b.order);

  const news = newsData.contents.map(normalizeNews).sort((a, b) => a.sortOrder - b.sortOrder);

  return { siteSettings, contactSettings, works, plans, news, workIndexBySlug };
}

function buildMockFile({ siteSettings, contactSettings, works, plans, news, workIndexBySlug }) {
  const siteFields = normalizeSiteSettings(siteSettings);
  const contactFields = normalizeContactSettings(contactSettings);

  return `import type { ContactSettings, NewsItem, Plan, SiteSettings, Work } from '@/types/cms';

/** microCMS から同期（${new Date().toISOString().slice(0, 10)}） */
export const mockSiteSettings: SiteSettings = {
${serializeObject(siteFields, 2)}
};

export const mockContactSettings: ContactSettings = {
${serializeObject(contactFields, 2)}
};

export const mockNews: NewsItem[] = [
${serializeNews(news)}
];

export const mockWorks: Work[] = [
${serializeWorks(works)}
];

export const mockPlans: Plan[] = [
${serializePlans(plans, workIndexBySlug)}
];
`;
}

async function main() {
  console.log('microCMS からデータを取得しています...');
  const data = await fetchAll();
  const content = buildMockFile(data);
  const outPath = join(root, 'src/data/mock.ts');
  writeFileSync(outPath, content, 'utf8');
  console.log(`✓ ${outPath} を更新しました`);
  console.log(`  - plans: ${data.plans.length}件`);
  console.log(`  - works: ${data.works.length}件`);
  console.log(`  - news: ${data.news.length}件`);
}

main().catch((error) => {
  console.error('同期に失敗しました:', error);
  process.exit(1);
});
