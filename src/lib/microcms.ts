import { createClient } from 'microcms-js-sdk';
import { mockContactSettings, mockNews, mockPlans, mockSiteSettings, mockWorks } from '@/data/mock';
import { sortNewsItems } from '@/lib/news';
import { sortWorks } from '@/lib/works';
import { resolvePlanSlug, PLAN_SLUG_ALIASES } from '@/lib/plan-slugs';
import type { ContactSettings, NewsItem, ParsedContactSettings, Plan, SiteSettings, SiteType, Work, WorkType } from '@/types/cms';

const LEGACY_WORK_TYPE_MAP: Record<string, WorkType> = {
  client: '実案件',
  self: '自主制作',
  fictional: '架空案件',
  sample: 'サンプル',
};

const LEGACY_SITE_TYPE_MAP: Record<string, SiteType> = {
  normal: '通常サイト',
  mini: 'ミニ制作',
  通常サイト: '通常サイト',
  ミニ制作: 'ミニ制作',
};

type RawPlan = Partial<Plan> & {
  category?: SiteType | SiteType[] | string | string[];
  siteType?: SiteType | SiteType[] | string | string[];
  order?: number;
  sortOrder?: number;
  publishableContent?: string | string[];
  contents?: string | string[];
  pageCount?: string;
  clientProvides?: string | string[];
  requiredItems?: string | string[];
  productionPeriod?: string;
  deliveryTime?: string;
  recommendedFor?: string | string[];
  included?: string | string[];
  notIncluded?: string | string[];
  notes?: string | string[];
  relatedWorks?: RawWork[];
  isVisible?: boolean;
};

type RawWork = Partial<Work> & {
  type?: string;
  workType?: WorkType | WorkType[] | string | string[];
  siteType?: SiteType | SiteType[] | string | string[];
  siteUrl?: string;
  thumbnail?: string | { url?: string };
  relatedPlans?: Array<{ id?: string; slug?: string }>;
  order?: number;
};

function pickSelectValue<T extends string>(
  value: T | T[] | string | string[] | undefined,
  legacyMap?: Record<string, T>,
): T | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return undefined;
  return (legacyMap?.[raw] ?? raw) as T;
}

function normalizeThumbnail(thumbnail?: string | { url?: string }): string | undefined {
  if (!thumbnail) return undefined;
  if (typeof thumbnail === 'string') return thumbnail;
  return thumbnail.url;
}

function normalizeWork(raw: RawWork): Work {
  const workType = pickSelectValue(raw.workType, LEGACY_WORK_TYPE_MAP) ?? 'サンプル';
  const siteType = pickSelectValue(raw.siteType, LEGACY_SITE_TYPE_MAP);

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

function normalizeListField(value?: string | string[]): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((item) => item.trim()).filter(Boolean);
  return parseMultilineField(value);
}

function normalizePlan(raw: RawPlan): Plan {
  const siteType = pickSelectValue(raw.siteType ?? raw.category, LEGACY_SITE_TYPE_MAP) ?? 'その他';

  if (siteType === 'その他' && raw.slug) {
    console.warn(
      `[microCMS] plans/${raw.slug}: category が未設定または不明です。通常は normal / mini を設定してください。`,
    );
  }

  return {
    id: raw.id ?? '',
    title: raw.title ?? '',
    slug: raw.slug ?? '',
    siteType,
    price: raw.price ?? '',
    priceNote: raw.priceNote,
    shortDescription: raw.shortDescription ?? '',
    description: raw.description ?? '',
    recommendedFor: normalizeListField(raw.recommendedFor),
    publishableContent: normalizeListField(raw.publishableContent ?? raw.contents),
    pageCount: raw.pageCount ?? '',
    clientProvides: normalizeListField(raw.clientProvides ?? raw.requiredItems),
    included: normalizeListField(raw.included),
    notIncluded: normalizeListField(raw.notIncluded),
    deliveryFormat: raw.deliveryFormat ?? '',
    productionPeriod: raw.productionPeriod ?? raw.deliveryTime ?? '',
    revisionCount: raw.revisionCount ?? '',
    notes: normalizeListField(raw.notes),
    relatedWorks: [],
    order: raw.sortOrder ?? raw.order ?? 0,
    isFeatured: raw.isFeatured,
  };
}

function normalizePlanRelatedWorks(
  references: RawWork[] | undefined,
  allWorks: RawWork[],
): Work[] {
  return (references ?? [])
    .map((reference) => {
      const source =
        reference.title || reference.slug
          ? reference
          : allWorks.find((work) => work.id === reference.id);
      if (!source?.title && !source?.slug) return null;
      return normalizeWork(source);
    })
    .filter((work): work is Work => Boolean(work && work.isVisible && work.slug))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

function attachRelatedWorks(plans: Plan[], rawPlans: RawPlan[], allWorks: RawWork[]): Plan[] {
  return plans.map((plan, index) => {
    // 制作プランの「複数コンテンツ参照（制作実績）」に登録したものだけを表示
    const relatedWorks = normalizePlanRelatedWorks(rawPlans[index]?.relatedWorks, allWorks);
    return { ...plan, relatedWorks };
  });
}

function filterPlansBySiteType(plans: Plan[], siteType?: SiteType): Plan[] {
  const filtered = siteType ? plans.filter((plan) => plan.siteType === siteType) : plans;
  return filtered.sort((a, b) => a.order - b.order);
}

async function fetchVisiblePlansFromCMS(): Promise<{
  rawPlans: RawPlan[];
  rawWorks: RawWork[];
} | null> {
  const client = getClient();
  if (!client) return null;

  try {
    const [plansData, worksData] = await Promise.all([
      client.getList<RawPlan>({
        endpoint: 'plans',
        queries: {
          orders: 'sortOrder',
          depth: '2',
          filters: 'isVisible[equals]true',
          limit: 100,
        },
      }),
      client.getList<RawWork>({
        endpoint: 'works',
        queries: {
          depth: '2',
          filters: 'isVisible[equals]true',
          orders: 'sortOrder',
          limit: 100,
        },
      }),
    ]);

    return {
      rawPlans: plansData.contents,
      rawWorks: worksData.contents,
    };
  } catch (error) {
    console.warn('[microCMS] plans の取得に失敗しました。モックデータを使用します。', error);
    return null;
  }
}

function buildPlans(rawPlans: RawPlan[], rawWorks: RawWork[]): Plan[] {
  return attachRelatedWorks(
    rawPlans.map((plan) => normalizePlan(plan)),
    rawPlans,
    rawWorks,
  );
}

const serviceDomain = import.meta.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = import.meta.env.MICROCMS_API_KEY;

const isMicroCMSConfigured = Boolean(serviceDomain && apiKey);

function getClient() {
  if (!isMicroCMSConfigured) return null;
  return createClient({ serviceDomain: serviceDomain!, apiKey: apiKey! });
}

export function parseMultilineField(text?: string): string[] {
  if (!text) return [];
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function normalizeFormspreeEndpoint(endpoint?: string): string {
  const trimmed = endpoint?.trim() ?? '';
  if (!trimmed) return '';
  if (trimmed.startsWith('http')) return trimmed;
  return `https://formspree.io/f/${trimmed}`;
}

function parseContactSettings(raw: ContactSettings): ParsedContactSettings {
  return {
    title: raw.title,
    description: raw.description,
    emailDescription: raw.emailDescription,
    xDescription: raw.xDescription,
    formDescription: raw.formDescription,
    formspreeEndpoint: normalizeFormspreeEndpoint(raw.formspreeEndpoint),
    categoryOptions: parseMultilineField(raw.categoryOptions),
    planOptions: parseMultilineField(raw.planOptions),
    budgetOptions: parseMultilineField(raw.budgetOptions),
    submitButtonText: raw.submitButtonText,
    replyTime: raw.replyTime,
    studioNoteLead: raw.studioNoteLead,
    closedNoteLead: raw.closedNoteLead,
    closedReplyTime: raw.closedReplyTime,
    softClosedNoteLead: raw.softClosedNoteLead,
    softClosedReplyTime: raw.softClosedReplyTime,
    notifyOnlyNoteLead: raw.notifyOnlyNoteLead,
    notifyOnlyReplyTime: raw.notifyOnlyReplyTime,
    tips: parseMultilineField(raw.tips),
    ctaTitle: raw.ctaTitle,
    ctaDescription: raw.ctaDescription,
  };
}

export async function getContactSettings(): Promise<ParsedContactSettings> {
  const client = getClient();
  if (!client) return parseContactSettings(mockContactSettings);

  try {
    const data = await client.get<ContactSettings>({ endpoint: 'contact-settings' });
    return parseContactSettings({ ...mockContactSettings, ...data });
  } catch {
    console.warn('[microCMS] contact-settings の取得に失敗しました。モックデータを使用します。');
    return parseContactSettings(mockContactSettings);
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const client = getClient();
  if (!client) return mockSiteSettings;

  try {
    const data = await client.get({ endpoint: 'site-settings' });
    return { ...mockSiteSettings, ...data } as SiteSettings;
  } catch {
    console.warn('[microCMS] site-settings の取得に失敗しました。モックデータを使用します。');
    return mockSiteSettings;
  }
}

export async function getPlans(siteType?: SiteType): Promise<Plan[]> {
  const data = await fetchVisiblePlansFromCMS();
  if (!data) {
    return filterPlansBySiteType(mockPlans, siteType);
  }

  return filterPlansBySiteType(buildPlans(data.rawPlans, data.rawWorks), siteType);
}

/** getStaticPaths 用：CMS + モックの slug を統合（開発中のCMS追加にも対応） */
export async function getPlanSlugsForStaticPaths(siteType?: SiteType): Promise<string[]> {
  const cmsPlans = await getPlans(siteType);
  const mockPlansForType = filterPlansBySiteType(mockPlans, siteType);
  const slugs = new Set<string>([
    ...cmsPlans.map((plan) => plan.slug),
    ...mockPlansForType.map((plan) => plan.slug),
  ]);

  for (const [alias, canonical] of Object.entries(PLAN_SLUG_ALIASES)) {
    if (slugs.has(canonical)) {
      slugs.add(alias);
    }
  }

  return [...slugs];
}

export async function getPlanBySlug(slug: string): Promise<Plan | undefined> {
  const resolvedSlug = resolvePlanSlug(slug);
  const data = await fetchVisiblePlansFromCMS();
  if (!data) {
    return mockPlans.find((plan) => plan.slug === resolvedSlug || plan.slug === slug);
  }

  const rawPlan = data.rawPlans.find((plan) => plan.slug === resolvedSlug);
  if (!rawPlan) return undefined;

  return buildPlans([rawPlan], data.rawWorks)[0];
}

export async function getWorks(): Promise<Work[]> {
  const client = getClient();
  if (!client) return sortWorks(mockWorks.filter((w) => w.isVisible));

  try {
    const data = await client.getList<RawWork>({
      endpoint: 'works',
      queries: {
        filters: 'isVisible[equals]true',
        orders: 'sortOrder',
        limit: 100,
      },
    });
    return sortWorks(data.contents.map((work) => normalizeWork(work)));
  } catch {
    console.warn('[microCMS] works の取得に失敗しました。モックデータを使用します。');
    return sortWorks(mockWorks.filter((w) => w.isVisible));
  }
}

export async function getNews(): Promise<NewsItem[]> {
  const client = getClient();
  if (!client) return sortNewsItems(mockNews);

  try {
    const data = await client.getList<NewsItem>({
      endpoint: 'news',
      queries: {
        filters: 'isVisible[equals]true',
        orders: '-date',
        limit: 100,
      },
    });
    return sortNewsItems(data.contents.map(normalizeNewsItem));
  } catch {
    console.warn('[microCMS] news の取得に失敗しました。モックデータを使用します。');
    return sortNewsItems(mockNews);
  }
}

function normalizeNewsItem(raw: NewsItem): NewsItem {
  return {
    ...raw,
    // API フィルタ後でも isVisible が欠けることがあるため明示的に正規化
    isVisible: raw.isVisible !== false,
    isFeatured: Boolean(raw.isFeatured),
    sortOrder: typeof raw.sortOrder === 'number' ? raw.sortOrder : 0,
    category: raw.category ?? 'info',
  };
}

export function isUsingMockData(): boolean {
  return !isMicroCMSConfigured;
}
