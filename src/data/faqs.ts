import type { Faq } from '@/types/cms';

/** コード固定のFAQ（microCMSでは管理しない） */
export const staticFaqs: Faq[] = [
  {
    id: 'faq-1',
    question: '初めてホームページを作るのですが、相談だけでも大丈夫ですか？',
    answer:
      'もちろん大丈夫です。事業内容やご希望をお聞きしたうえで、必要なページ構成やプランの目安をご提案します。無理な営業は一切ありません。',
    category: 'contact',
    sortOrder: 1,
    isVisible: true,
    isFeatured: true,
  },
  {
    id: 'faq-2',
    question: '本格制作プランとミニプランの違いは何ですか？',
    answer:
      '本格制作プランはお店や事業のしっかりとしたサイト制作向けです。ミニプランは名刺代わりの1ページやメニュー掲載など、小さく始めたい方向けのコンパクトなプランです。',
    category: 'normal',
    sortOrder: 2,
    isVisible: true,
    isFeatured: true,
  },
  {
    id: 'faq-3',
    question: '表示されている料金以外にかかる費用はありますか？',
    answer:
      'ドメイン・サーバー費用は別途必要です。写真撮影や文章作成、ロゴ制作などはプランに含まれない場合がありますので、事前にご案内いたします。',
    category: 'price',
    sortOrder: 3,
    isVisible: true,
    isFeatured: true,
  },
  {
    id: 'faq-4',
    question: '制作期間はどのくらいですか？',
    answer:
      'プランや内容により異なりますが、本格制作プランはおおむね1〜2ヶ月が目安です。ミニ制作プランは、素材が揃ってから3日〜2週間程度が目安です。内容やCMS追加の有無によって前後します。',
    category: 'delivery',
    sortOrder: 4,
    isVisible: true,
    isFeatured: true,
  },
  {
    id: 'faq-5',
    question: 'ライト・スタンダード・プレミアムはどう選べばいいですか？',
    answer:
      'ページ数や掲載したい情報量で選びやすくなっています。初めての方やお店の魅力をしっかり伝えたい方には、スタンダードプランがおすすめです。',
    category: 'normal',
    sortOrder: 5,
    isVisible: true,
    isFeatured: false,
  },
  {
    id: 'faq-6',
    question: '写真や文章がなくても依頼できますか？',
    answer:
      'はい、可能です。お持ちの素材を活かしながら、必要な情報の整理や文章のたたき台づくりもお手伝いします。別途費用が発生する場合は事前にご相談ください。',
    category: 'normal',
    sortOrder: 6,
    isVisible: true,
    isFeatured: false,
  },
  {
    id: 'faq-7',
    question: 'ミニプランでもスマホ対応になりますか？',
    answer:
      'はい。ミニプランもスマホで見やすい設計を基本としています。ただし公開作業やサーバー・ドメイン設定は含まれない点にご注意ください。',
    category: 'mini',
    sortOrder: 7,
    isVisible: true,
    isFeatured: false,
  },
  {
    id: 'faq-8',
    question: 'ミニプランの納品形式を教えてください。',
    answer:
      'HTML/CSSファイル一式をお渡しする形式です。ご自身で公開される場合や、別途サポートをご依頼いただく形となります。',
    category: 'mini',
    sortOrder: 8,
    isVisible: true,
    isFeatured: false,
  },
  {
    id: 'faq-9',
    question: '見積もりは無料ですか？',
    answer:
      'はい、お見積り・ご相談は無料です。事業内容やご希望をお聞きしたうえで、プランと費用の目安をご案内します。',
    category: 'price',
    sortOrder: 9,
    isVisible: true,
    isFeatured: false,
  },
  {
    id: 'faq-10',
    question: '支払いのタイミングはいつですか？',
    answer:
      '着手前に着手金、完成・納品時に残金という形が基本です。詳細はご契約時にご案内いたします。',
    category: 'price',
    sortOrder: 10,
    isVisible: true,
    isFeatured: false,
  },
  {
    id: 'faq-11',
    question: '修正は何回まで可能ですか？',
    answer:
      'プランごとに修正回数の目安を設けています。文言の調整やレイアウトの微修正など、範囲内で対応いたします。大幅な構成変更は別途ご相談となります。',
    category: 'delivery',
    sortOrder: 11,
    isVisible: true,
    isFeatured: false,
  },
  {
    id: 'faq-12',
    question: '公開作業もお願いできますか？',
    answer:
      '本格制作プランでは公開作業のサポートが可能です。ミニプランはファイル納品が基本ですが、別途ご相談いただければ対応できる場合があります。',
    category: 'delivery',
    sortOrder: 12,
    isVisible: true,
    isFeatured: false,
  },
  {
    id: 'faq-13',
    question: '遠方でも依頼できますか？',
    answer:
      'はい。オンラインでのやりとりを基本としており、愛媛・松山以外の方からもご依頼いただいています。',
    category: 'contact',
    sortOrder: 13,
    isVisible: true,
    isFeatured: false,
  },
  {
    id: 'faq-14',
    question: '返信までどのくらいかかりますか？',
    answer:
      '通常2〜3営業日以内にご返信いたします。お急ぎの場合は、その旨をお問い合わせ内容にご記入ください。',
    category: 'contact',
    sortOrder: 14,
    isVisible: true,
    isFeatured: false,
  },
  {
    id: 'faq-15',
    question: '制作後の更新や保守はお願いできますか？',
    answer:
      'はい、更新方法のご案内や保守・更新のご依頼も承っております。内容に応じて別途お見積りいたします。',
    category: 'other',
    sortOrder: 15,
    isVisible: true,
    isFeatured: false,
  },
];
