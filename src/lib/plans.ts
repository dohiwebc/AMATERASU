import { parseMultilineField } from '@/lib/microcms';
import type { SiteSettings } from '@/types/cms';

/** ミニプランカードのラベル・アイコン */
export const MINI_PLAN_META: Record<string, { label: string; icon: string }> = {
  'profile-link': { label: 'SNS・リンク集', icon: 'link' },
  'web-card': { label: 'Web名刺', icon: 'card' },
  'web-meishi': { label: 'Web名刺', icon: 'card' },
  'menu-web': { label: 'メニュー掲載', icon: 'menu' },
  'team-page': { label: '団体・チーム', icon: 'team' },
  'campaign-page': { label: 'イベント告知', icon: 'event' },
};

/** 全プラン共通の注意事項（CMS未入力時のフォールバック） */
export const DEFAULT_PLAN_SYSTEM_SCOPE_NOTE =
  '空き状況の自動管理、在庫管理、オンライン決済、会員機能、ログイン機能などのシステム開発には対応していません。必要な場合は外部サービスへのリンク設置で対応します。';

export const DEFAULT_PLAN_GENERAL_NOTES = [
  '表示価格は目安です。ページ数や掲載内容、必要な機能によって料金が変動する場合があります。',
  '基本はHTML・CSS・JavaScript・画像ファイル一式で納品します。公開作業やドメイン設定をご希望の場合は、別途ご相談となります。',
  'ドメイン・サーバー費用は別途必要です。',
  '写真撮影・ロゴ制作・文章の丸投げ作成は含まれません。文章の整理や見せ方の調整は対応可能です。',
  'CMS機能は、管理項目や更新内容の量によって追加料金となる場合があります。',
  '納品後7日以内の軽微な修正は無料で対応します。大幅な内容変更や仕様変更は別途ご相談となります。',
  '制作実績への掲載は、お客様の許可をいただいた場合のみ行います。非公開での制作も可能です。',
  'まずはお気軽にご相談ください。ご予算に合わせたご提案も可能です。',
] as const;

/** ミニプラン共通の注意事項（CMS未入力時のフォールバック） */
export const DEFAULT_MINI_PLAN_SYSTEM_SCOPE_NOTE =
  'ミニ制作プランはHTML・CSS・画像ファイルの納品が基本です。サーバーへの公開作業、ドメイン設定、会員機能・決済・予約システムなどのシステム開発は含まれません。必要な場合は外部サービスへのリンク設置で対応します。';

export const DEFAULT_MINI_PLAN_GENERAL_NOTES = [
  '表示価格は目安です。ページ数や掲載内容によって料金が変動する場合があります。',
  '制作したファイルはお客様にお渡しします。公開作業・サーバー・ドメイン設定は含まれません。',
  'ドメイン・サーバー費用は別途必要です。',
  '写真撮影・ロゴ制作・文章の丸投げ作成は含まれません。文章の整理や見せ方の調整は対応可能です。',
  '納品後7日以内の軽微な修正は無料で対応します。大幅な内容変更や仕様変更は別途ご相談となります。',
  '制作実績への掲載は、お客様の許可をいただいた場合のみ行います。非公開での制作も可能です。',
  'まずはお気軽にご相談ください。ご予算に合わせたご提案も可能です。',
] as const;

export type PlanSharedNoteVariant = 'normal' | 'mini';

export function getPlanSharedContent(
  settings: SiteSettings,
  variant: PlanSharedNoteVariant = 'normal',
): {
  systemScopeNote: string;
  generalNotes: string[];
  scopeTitle: string;
} {
  if (variant === 'mini') {
    const systemScopeNote =
      settings.miniSystemScopeNote?.trim() || DEFAULT_MINI_PLAN_SYSTEM_SCOPE_NOTE;

    const parsedNotes = parseMultilineField(settings.miniGeneralNotes);
    const generalNotes =
      parsedNotes.length > 0 ? parsedNotes : [...DEFAULT_MINI_PLAN_GENERAL_NOTES];

    return {
      systemScopeNote,
      generalNotes,
      scopeTitle: '納品・公開について',
    };
  }

  const systemScopeNote =
    settings.systemScopeNote?.trim() || DEFAULT_PLAN_SYSTEM_SCOPE_NOTE;

  const parsedNotes = parseMultilineField(settings.generalNotes);
  const generalNotes =
    parsedNotes.length > 0 ? parsedNotes : [...DEFAULT_PLAN_GENERAL_NOTES];

  return {
    systemScopeNote,
    generalNotes,
    scopeTitle: 'システム開発について',
  };
}

const PRICE_NOTE_KEYWORDS = ['価格', '料金', '費用', 'ドメイン', 'サーバー', 'CMS機能'] as const;

/** ご確認事項を「料金について」とそれ以外に分類 */
export function splitGeneralNotesByTopic(notes: string[]): {
  confirmNotes: string[];
  priceNotes: string[];
} {
  const confirmNotes: string[] = [];
  const priceNotes: string[] = [];

  for (const note of notes) {
    if (PRICE_NOTE_KEYWORDS.some((keyword) => note.includes(keyword))) {
      priceNotes.push(note);
    } else {
      confirmNotes.push(note);
    }
  }

  return { confirmNotes, priceNotes };
}
