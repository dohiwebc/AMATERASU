export type SiteType = '通常サイト' | 'ミニ制作' | 'Webアプリ' | 'LP' | 'その他';

export type WorkType = '実案件' | '自主制作' | '架空案件' | '非公開案件' | 'サンプル';

/** ページ絞り込み用のサイト種別 */
export const SITE_TYPE = {
  NORMAL: '通常サイト',
  MINI: 'ミニ制作',
} as const satisfies Record<string, SiteType>;

export interface SiteSettings {
  brandName: string;
  brandDisplay: string;
  logoText: string;
  catchCopy: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  location: string;
  serviceDescription: string;
  email: string;
  instagramUrl: string;
  xUrl?: string;
  footerText: string;
  seoTitle: string;
  seoDescription: string;
  ogImage?: string;
  /** 本格制作プラン共通：システム開発の対応範囲（テキストエリア） */
  systemScopeNote?: string;
  /** 本格制作プラン共通：ご確認ください（1行1項目のテキストエリア） */
  generalNotes?: string;
  /** ミニプラン共通：納品・公開について（テキストエリア） */
  miniSystemScopeNote?: string;
  /** ミニプラン共通：ご確認ください（1行1項目のテキストエリア） */
  miniGeneralNotes?: string;
  /** 新規受付の可否（false のとき受付停止中と表示） */
  isAcceptingOrders?: boolean;
}

export interface Work {
  id: string;
  title: string;
  slug: string;
  workType: WorkType;
  siteType?: SiteType;
  /** 業種・ジャンル（飲食店、美容室 など） */
  category: string;
  shortDescription?: string;
  description: string;
  purpose?: string;
  pages?: string;
  technologies?: string;
  highlights?: string;
  thumbnail?: string;
  url?: string;
  isVisible: boolean;
  /** 制作（完了）年 */
  year?: string;
}

export interface Plan {
  id: string;
  title: string;
  slug: string;
  siteType: SiteType;
  price: string;
  priceNote?: string;
  shortDescription: string;
  description: string;
  recommendedFor: string[];
  publishableContent: string[];
  pageCount?: string;
  clientProvides: string[];
  included: string[];
  notIncluded: string[];
  deliveryFormat: string;
  productionPeriod: string;
  revisionCount: string;
  notes?: string[];
  relatedWorks: Work[];
  order: number;
  isFeatured?: boolean;
}

export interface PlanModalData {
  id: string;
  title: string;
  price: string;
  priceNote?: string;
  shortDescription: string;
  description: string;
  recommendedFor: string[];
  publishableContent: string[];
  pageCount?: string;
  clientProvides: string[];
  included: string[];
  notIncluded: string[];
  deliveryFormat: string;
  productionPeriod: string;
  revisionCount: string;
  notes?: string[];
  relatedWorks: Work[];
}

export interface ContactSettings {
  title: string;
  description: string;
  emailDescription: string;
  xDescription?: string;
  formDescription: string;
  formspreeEndpoint: string;
  categoryOptions: string;
  planOptions: string;
  budgetOptions: string;
  submitButtonText: string;
  replyTime: string;
  studioNoteLead: string;
  /** 受付停止中の説明文（テキストエリア） */
  closedNoteLead?: string;
  /** 受付停止中の返信目安（テキストエリア） */
  closedReplyTime?: string;
  tips: string;
  /** CTAセクション：見出し（テキストエリア） */
  ctaTitle?: string;
  /** CTAセクション：説明文（テキストエリア） */
  ctaDescription?: string;
}

export interface ParsedContactSettings {
  title: string;
  description: string;
  emailDescription: string;
  xDescription?: string;
  formDescription: string;
  formspreeEndpoint: string;
  categoryOptions: string[];
  planOptions: string[];
  budgetOptions: string[];
  submitButtonText: string;
  replyTime: string;
  studioNoteLead: string;
  closedNoteLead?: string;
  closedReplyTime?: string;
  tips: string[];
  ctaTitle?: string;
  ctaDescription?: string;
}

export type FaqCategory = 'normal' | 'mini' | 'price' | 'delivery' | 'contact' | 'other';

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  sortOrder: number;
  isVisible: boolean;
  isFeatured: boolean;
}

export const FAQ_CATEGORY_LABELS: Record<FaqCategory, string> = {
  normal: '本格制作プラン',
  mini: 'ミニプラン',
  price: '料金について',
  delivery: '納期・納品について',
  contact: 'お問い合わせ',
  other: 'その他',
};

export const FAQ_CATEGORY_ORDER: FaqCategory[] = [
  'normal',
  'mini',
  'price',
  'delivery',
  'contact',
  'other',
];

export type NewsCategory = 'info' | 'works' | 'plans' | 'notice' | 'other';

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  body: string;
  date: string;
  category: NewsCategory;
  isFeatured: boolean;
  isVisible: boolean;
  sortOrder: number;
}

export const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  info: 'お知らせ',
  works: '実績',
  plans: 'プラン',
  notice: '重要',
  other: 'その他',
};

export const WORK_TYPE_LABELS: Record<WorkType, string> = {
  実案件: '実案件',
  自主制作: '自主制作',
  架空案件: '架空案件',
  非公開案件: '非公開案件',
  サンプル: 'サンプル',
};

export function getWorkTypeLabel(workType?: WorkType | string | null): string {
  if (!workType) return '';
  return WORK_TYPE_LABELS[workType as WorkType] ?? workType;
}

export function getSiteTypeLabel(siteType?: SiteType | string | null): string {
  return siteType ?? '';
}
