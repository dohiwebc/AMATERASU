/** コード固定のオプション・公開サポート（microCMSでは管理しない） */

export interface OptionItem {
  label: string;
  price: string;
}

export interface OptionGroup {
  title: string;
  items: OptionItem[];
}

export const optionGroups: OptionGroup[] = [
  {
    title: '公開・初期設定',
    items: [
      { label: '公開作業サポート', price: '5,000円〜' },
      { label: 'ドメイン設定サポート', price: '5,000円〜' },
      { label: 'サーバー・ドメイン初期設定サポート（公開作業込み）', price: '10,000円〜' },
      { label: 'Google Search Console設定', price: '5,000円〜' },
      { label: 'Google Analytics設定', price: '5,000円〜' },
    ],
  },
  {
    title: 'ページ追加',
    items: [
      { label: '追加ページ制作', price: '10,000円〜 / 1ページ' },
      { label: '簡易下層ページ追加', price: '5,000円〜' },
    ],
  },
  {
    title: 'CMS・更新機能',
    items: [
      { label: 'CMS機能追加（お知らせなど1種類）', price: '15,000円〜' },
      { label: 'ブログ機能追加', price: '20,000円〜' },
      { label: 'メニュー更新機能追加', price: '15,000円〜' },
      { label: 'CMS管理項目追加', price: '内容に応じてお見積り' },
    ],
  },
  {
    title: 'フォーム・問い合わせ',
    items: [
      { label: '予約リクエストフォーム追加', price: '5,000円〜' },
      { label: 'フォーム項目追加', price: '内容に応じてお見積り' },
    ],
  },
  {
    title: '埋め込み・外部サービス',
    items: [
      { label: 'Instagramグリッド埋め込み', price: '5,000円〜' },
      { label: 'YouTube埋め込み', price: '3,000円〜' },
      { label: 'Googleフォーム埋め込み', price: '3,000円〜' },
      { label: 'Googleマップ埋め込み', price: '無料〜（初回設置）' },
      { label: '外部予約サービスリンク設置', price: '無料〜（初回設置）' },
      { label: 'LINE導線設置', price: '無料〜（初回設置）' },
    ],
  },
  {
    title: '文章',
    items: [
      { label: '掲載文章の整理・リライト', price: '基本無料（文量が多ければ有料）' },
      { label: 'キャッチコピー作成', price: '5,000円〜' },
    ],
  },
  {
    title: 'SEO',
    items: [{ label: '基本SEO強化', price: '10,000円〜' }],
  },
  {
    title: 'デザイン・演出',
    items: [
      { label: 'スクロールアニメーション追加', price: '5,000円〜' },
      { label: 'ファーストビュー作り込み', price: '10,000円〜' },
      { label: '大幅なデザイン変更（部分的な調整）', price: '15,000円〜' },
    ],
  },
  {
    title: '保守・更新サポート',
    items: [
      { label: '単発更新', price: '3,000円〜' },
      { label: '表示崩れチェック', price: '3,000円〜' },
      { label: '月額保守（軽微な技術メンテ）', price: '5,000円〜' },
      { label: '月1回更新サポート', price: '5,000円〜' },
      { label: '月2回更新サポート', price: '8,000円〜' },
    ],
  },
];

export const optionNotes: string[] = [
  '表示価格は目安です。内容量や必要な作業によって料金が変動する場合があります。',
  '制作プランやサイトの状態によって、対応可否が変わる場合があります。',
  '「無料〜」は初回の簡単な設置が目安です。デザイン調整や仕様変更は別途ご相談となります。',
  '掲載文章の整理・リライトは、軽い調整は基本無料です。文量が多い場合は別途お見積りします。',
  '月額保守は技術的なメンテナンス、更新サポートは文言・画像などの差し替えが対象です。',
  '大幅なデザイン変更は部分的な調整が目安です。全面リデザインは別途お見積りとなります。',
  'オンライン決済、会員機能、ログイン機能、在庫管理、空き状況の自動管理などのシステム開発には対応していません。',
];
