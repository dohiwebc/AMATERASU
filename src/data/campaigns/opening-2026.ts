/**
 * 2026年開業記念 Webサイト制作モニター
 *
 * 差し替えやすい項目：
 * - isActive … 導線の表示
 * - applicationOpensOn / applyLabel* … 受付文言
 * - slots[].status / statusLabel … 枠の受付表示（ここだけ変えればOK）
 * - plans / maintenance … 料金・内容
 */
import type { Faq } from '@/types/cms';

/**
 * upcoming: 受付前
 * open: 受付中
 * limited: 残りわずか（statusLabel に「残り1組」等を書く）
 * closed: 受付終了
 */
export type CampaignSlotStatus = 'upcoming' | 'open' | 'limited' | 'closed';

export const opening2026Campaign = {
  isActive: true,
  slug: 'opening-2026',
  path: '/campaign/opening-2026/',
  termsPath: '/campaign/opening-2026/terms/',

  applyHref: '#apply',
  applyLabel: 'モニターに申し込む',
  applyLabelBefore: '9月1日受付開始',
  /** この日付以降、フォーム送信・申込ボタンを有効化 */
  applicationOpensOn: '2026-08-01',

  seo: {
    title: '開業記念 Webサイト制作モニター',
    description:
      'AMATERASU Web Studio開業記念。Webサイト制作モニターを9組限定で募集。ライトプラン相当39,800円（税込）、スタンダードプラン相当79,800円（税込）。',
  },

  hero: {
    label: '2026年10月 開業記念',
    title: 'Webサイト制作モニター',
    subtitle: '9組限定',
    price: '39,800円（税込）〜',
    usualFrom: '70,000円〜',
    opensLabel: '受付中',
    period: '募集期間 2026年9月1日〜11月15日',
    note: '枠が埋まり次第終了',
    scheduleHint: '10月・11月・12月 制作開始',
  },

  summary: {
    totalSlots: '全体9組',
    standardCap: 'スタンダード相当は最大3組',
  },

  plans: [
    {
      id: 'light',
      name: 'ライトプラン相当',
      pages: '1〜2ページ',
      price: '39,800円（税込）',
      usualPrice: '70,000円〜',
      slots: '最大6組',
      suitedFor: 'コンパクトな公式サイトを持ちたい方に',
      usualHref: '/plans/light/',
      usualLabel: '通常のライトプランを見る',
      period: '約2〜3週間',
      revisions: '修正3回まで',
      highlights: ['スマホ・PC対応', 'お問い合わせフォーム', '基本SEO設定', '修正3回まで'],
      included: [
        '1〜2ページ程度',
        'スマホ対応',
        'PC表示対応',
        '基本デザイン',
        'お問い合わせフォーム',
        'Googleマップ設置',
        'SNSリンク設置',
        '基本SEO設定',
        '文章の軽い整理',
        '画像の簡単な調整',
        '修正3回まで',
      ],
      extraNote: '追加ページや高度な機能はオプション料金です。',
    },
    {
      id: 'standard',
      name: 'スタンダードプラン相当',
      pages: '3〜5ページ',
      price: '79,800円（税込）',
      usualPrice: '150,000円〜',
      slots: '最大3組',
      suitedFor: '事業やサービス内容をしっかり伝えたい方に',
      usualHref: '/plans/standard/',
      usualLabel: '通常のスタンダードプランを見る',
      period: '約3〜5週間',
      revisions: '修正5回まで',
      note: '5ページを超える場合は追加料金で対応可能です。',
      highlights: ['サイト構成の整理', 'デザイン・コーディング', '軽いアニメーション', '修正5回まで'],
      included: [
        '3〜5ページ程度',
        'スマホ対応',
        'PC表示対応',
        'サイト構成の整理',
        'デザイン制作',
        'コーディング',
        'お問い合わせフォーム',
        'Googleマップ設置',
        'SNSリンク設置',
        '基本SEO設定',
        '文章整理',
        '画像の簡単な調整',
        '軽いアニメーション',
        '修正5回まで',
      ],
      extraNote: '5ページ超や高度な機能は追加料金です。',
    },
  ],

  /**
   * 制作枠ステータスは各枠の status / statusLabel だけ変更すればOK。
   * status: upcoming | open | limited | closed
   * statusLabel 例: 受付前 / 受付中 / 残り2組 / 残り1組 / 受付終了
   */
  slots: [
    {
      id: 'oct',
      label: '10月枠',
      start: '10月1日',
      startFull: '2026年10月1日',
      deadline: '9月20日',
      deadlineFull: '2026年9月20日',
      capacity: '3組',
      status: 'upcoming' as CampaignSlotStatus,
      statusLabel: '受付前',
    },
    {
      id: 'nov',
      label: '11月枠',
      start: '11月1日',
      startFull: '2026年11月1日',
      deadline: '10月20日',
      deadlineFull: '2026年10月20日',
      capacity: '3組',
      status: 'upcoming' as CampaignSlotStatus,
      statusLabel: '受付前',
    },
    {
      id: 'dec',
      label: '12月枠',
      start: '12月1日',
      startFull: '2026年12月1日',
      deadline: '11月15日',
      deadlineFull: '2026年11月15日',
      capacity: '3組',
      status: 'upcoming' as CampaignSlotStatus,
      statusLabel: '受付前',
    },
  ],

  maintenance: {
    optionsHref: '/options/',
    plans: [
      {
        price: '3,000円 / 月',
        label: '月1回の軽微更新',
      },
      {
        price: '5,000円 / 月',
        label: '月2回の軽微更新',
      },
    ],
    lightUpdates: ['文章変更', '画像差し替え', '料金変更', '営業時間変更', 'リンク変更'],
    optionUpdates: ['フォーム追加', 'ページ追加', '大幅なデザイン変更', '新規機能追加'],
  },

  payment: [
    { label: '契約・制作枠確定時', value: '50％' },
    { label: '公開・納品前', value: '50％' },
    { label: '仮受付後', value: '7日以内に契約・着手金' },
    { label: '追加作業', value: '通常オプション料金' },
    { label: '他キャンペーン', value: '併用不可' },
  ],
} as const;

export function isCampaignApplicationOpen(
  opensOn: string = opening2026Campaign.applicationOpensOn,
  now: Date = new Date(),
): boolean {
  const [y, m, d] = opensOn.split('-').map(Number);
  const opensAt = new Date(y, m - 1, d, 0, 0, 0, 0);
  return now.getTime() >= opensAt.getTime();
}

export function getCampaignApplyLabel(
  campaign: typeof opening2026Campaign = opening2026Campaign,
  now: Date = new Date(),
): string {
  return isCampaignApplicationOpen(campaign.applicationOpensOn, now)
    ? campaign.applyLabel
    : campaign.applyLabelBefore;
}

/** 表示順＝優先順位。初期オープンは先頭1件のみ */
export const opening2026Faqs: Faq[] = [
  {
    id: 'camp-faq-1',
    question: '店舗がなくても申し込めますか？',
    answer:
      'はい。フリーランス、クリエイター、YouTuber、チーム・団体など、実際に活動している方も対象です。',
    category: 'other',
    sortOrder: 1,
    isVisible: true,
    isFeatured: true,
  },
  {
    id: 'camp-faq-8',
    question: '申し込めば必ず制作してもらえますか？',
    answer:
      'いいえ。依頼内容を確認し、対応可能と判断した場合に仮受付をご案内します。お申し込みのみでは制作枠は確定しません。',
    category: 'other',
    sortOrder: 2,
    isVisible: true,
    isFeatured: true,
  },
  {
    id: 'camp-faq-7',
    question: '制作開始月は選べますか？',
    answer:
      'ご希望を伺いますが、空き状況や制作内容を確認したうえでAMATERASU Web Studioが最終調整します。「10月枠＝10月中に完成」という意味ではありません。',
    category: 'other',
    sortOrder: 3,
    isVisible: true,
    isFeatured: true,
  },
  {
    id: 'camp-faq-2',
    question: '写真が少なくても大丈夫ですか？',
    answer:
      '内容を確認したうえで対応可能かご案内します。ただし、制作に必要な素材や情報がほとんど用意できない場合は対象外となる場合があります。',
    category: 'other',
    sortOrder: 4,
    isVisible: true,
    isFeatured: true,
  },
  {
    id: 'camp-faq-3',
    question: 'ドメインを持っていません。',
    answer:
      '問題ありません。依頼者名義で取得していただき、キャンペーンでは初回公開設定をAMATERASU Web Studioが対応します。ドメイン代などの実費は依頼者負担です。',
    category: 'other',
    sortOrder: 5,
    isVisible: true,
    isFeatured: true,
  },
  {
    id: 'camp-faq-6',
    question: '公開後も更新できますか？',
    answer:
      '月額保守または単発更新で対応可能です。キャンペーン料金に継続的な保守は含まれません。希望される場合は公開後にご案内します。',
    category: 'other',
    sortOrder: 6,
    isVisible: true,
    isFeatured: true,
  },
  {
    id: 'camp-faq-4',
    question: 'WordPressで制作しますか？',
    answer:
      'いいえ。HTML・CSS・JavaScript・画像ファイル一式での制作・納品が基本です。WordPress制作は行っておりません。更新機能が必要な場合はヘッドレスCMS等のオプションとしてご相談ください。',
    category: 'other',
    sortOrder: 7,
    isVisible: true,
    isFeatured: true,
  },
  {
    id: 'camp-faq-9',
    question: 'モニターですがSNS紹介は必要ですか？',
    answer:
      'SNSでの紹介は任意です。ただし、制作実績掲載やお客様の声へのご協力は必須条件です。',
    category: 'other',
    sortOrder: 8,
    isVisible: true,
    isFeatured: false,
  },
];

export const opening2026FaqOpenIds = ['camp-faq-1'] as const;
