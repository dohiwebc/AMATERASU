import type { AcceptanceStatus, ParsedContactSettings, SiteSettings } from '@/types/cms';
import { ACCEPTANCE_STATUS, ACCEPTANCE_STATUS_VALUES } from '@/types/cms';

const DEFAULT_HARD_CLOSED_NOTE =
  '現在、新規のご相談の受付を一時休止しております。\n再開までいましばらくお待ちください。';
const DEFAULT_HARD_CLOSED_REPLY = '受付再開の時期は、お知らせページにてご案内いたします。';

const DEFAULT_SOFT_CLOSED_NOTE =
  '現在、新規案件の着手は通常よりお時間をいただく場合があります。\nお見積りやご相談は受け付けておりますので、お気軽にお問い合わせください。';
const DEFAULT_SOFT_CLOSED_REPLY =
  '通常 2〜3営業日以内 にご返信いたします。\n着手可能時期の目安はお問い合わせ時にご案内します。';

const DEFAULT_NOTIFY_ONLY_NOTE =
  '現在、新規のご相談は受け付けておりません。\n再開のお知らせ希望のみ受け付けています。';
const DEFAULT_NOTIFY_ONLY_REPLY =
  '受付再開の時期は、お知らせページにてご案内いたします。\nご登録内容は再開時のご案内にのみ使用します。';

const DEFAULT_SOFT_CLOSED_FORM_DESCRIPTION =
  'ご相談・お見積りは受け付けています。\n着手までお時間をいただく場合がありますので、詳しくはお問い合わせ時にご案内します。';

const DEFAULT_OPEN_FORM_DESCRIPTION =
  '下記フォームよりお送りください。\n事業内容やご希望が分かると、より具体的なご提案ができます。';

export type AcceptanceFormMode = 'full' | 'notify' | 'none';

export type AcceptanceUi = {
  status: AcceptanceStatus;
  /** ヘッダー・バッジ用の表示名 */
  label: string;
  /** ヘッダー2行目用の短い表記 */
  shortLabel: string;
  /** お問い合わせページのステータス見出し */
  pageTitle: string;
  badgeTone: 'open' | 'limited' | 'closed';
  formMode: AcceptanceFormMode;
  leadText: string;
  replyText: string;
  formDescription?: string;
};

function isAcceptanceStatus(value: string): value is AcceptanceStatus {
  return (ACCEPTANCE_STATUS_VALUES as readonly string[]).includes(value);
}

/** microCMSセレクトは配列で返るため、文字列に正規化する */
export function normalizeAcceptanceStatus(
  value: unknown,
): AcceptanceStatus | undefined {
  if (Array.isArray(value)) {
    const first = value.find((item) => typeof item === 'string' && item.trim());
    return typeof first === 'string' && isAcceptanceStatus(first.trim())
      ? first.trim()
      : undefined;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return isAcceptanceStatus(trimmed) ? trimmed : undefined;
  }

  return undefined;
}

/** CMSの受付状況を解決（旧 isAcceptingOrders もフォールバック） */
export function resolveAcceptanceStatus(settings: SiteSettings): AcceptanceStatus {
  const fromStatus = normalizeAcceptanceStatus(settings.acceptanceStatus);
  if (fromStatus) return fromStatus;

  if (settings.isAcceptingOrders === false) {
    return ACCEPTANCE_STATUS.HARD_CLOSED;
  }

  return ACCEPTANCE_STATUS.OPEN;
}

/** ヘッダー等：ラベルだけ必要なとき用 */
export function getAcceptanceBadge(settings: SiteSettings): Pick<
  AcceptanceUi,
  'status' | 'label' | 'shortLabel' | 'badgeTone'
> {
  const status = resolveAcceptanceStatus(settings);

  switch (status) {
    case ACCEPTANCE_STATUS.SOFT_CLOSED:
      return {
        status,
        label: ACCEPTANCE_STATUS.SOFT_CLOSED,
        shortLabel: '着手にお時間',
        badgeTone: 'limited',
      };
    case ACCEPTANCE_STATUS.NOTIFY_ONLY:
      return {
        status,
        label: ACCEPTANCE_STATUS.NOTIFY_ONLY,
        shortLabel: '再開案内のみ',
        badgeTone: 'closed',
      };
    case ACCEPTANCE_STATUS.HARD_CLOSED:
      return {
        status,
        label: 'ご相談一時休止',
        shortLabel: '一時休止',
        badgeTone: 'closed',
      };
    case ACCEPTANCE_STATUS.OPEN:
    default:
      return {
        status: ACCEPTANCE_STATUS.OPEN,
        label: ACCEPTANCE_STATUS.OPEN,
        shortLabel: '受付中',
        badgeTone: 'open',
      };
  }
}

export function getAcceptanceStatus(
  settings: SiteSettings,
  contact: ParsedContactSettings,
): AcceptanceUi {
  const status = resolveAcceptanceStatus(settings);

  switch (status) {
    case ACCEPTANCE_STATUS.SOFT_CLOSED:
      return {
        status,
        label: ACCEPTANCE_STATUS.SOFT_CLOSED,
        shortLabel: '着手にお時間',
        pageTitle: '着手一時休止中',
        badgeTone: 'limited',
        formMode: 'full',
        leadText: contact.softClosedNoteLead?.trim() || DEFAULT_SOFT_CLOSED_NOTE,
        replyText: (contact.softClosedReplyTime?.trim() || DEFAULT_SOFT_CLOSED_REPLY).includes('\n')
          ? contact.softClosedReplyTime?.trim() || DEFAULT_SOFT_CLOSED_REPLY
          : (contact.softClosedReplyTime?.trim() || DEFAULT_SOFT_CLOSED_REPLY).replace(
              '通常 2〜3営業日以内 にご返信いたします。',
              '通常 2〜3営業日以内 にご返信いたします。\n',
            ),
        formDescription: DEFAULT_SOFT_CLOSED_FORM_DESCRIPTION,
      };

    case ACCEPTANCE_STATUS.NOTIFY_ONLY:
      return {
        status,
        label: ACCEPTANCE_STATUS.NOTIFY_ONLY,
        shortLabel: '再開案内のみ',
        pageTitle: '再開お知らせのみ受付中',
        badgeTone: 'closed',
        formMode: 'notify',
        leadText: contact.notifyOnlyNoteLead?.trim() || DEFAULT_NOTIFY_ONLY_NOTE,
        replyText: (contact.notifyOnlyReplyTime?.trim() || DEFAULT_NOTIFY_ONLY_REPLY).includes('\n')
          ? contact.notifyOnlyReplyTime?.trim() || DEFAULT_NOTIFY_ONLY_REPLY
          : (contact.notifyOnlyReplyTime?.trim() || DEFAULT_NOTIFY_ONLY_REPLY).replace(
              '受付再開の時期は、お知らせページにてご案内いたします。',
              '受付再開の時期は、お知らせページにてご案内いたします。\n',
            ),
        formDescription: '再開のお知らせをご希望の方は、下記よりご登録ください。',
      };

    case ACCEPTANCE_STATUS.HARD_CLOSED:
      return {
        status,
        label: 'ご相談一時休止',
        shortLabel: '一時休止',
        pageTitle: 'ご相談一時休止中',
        badgeTone: 'closed',
        formMode: 'none',
        leadText: contact.closedNoteLead?.trim() || DEFAULT_HARD_CLOSED_NOTE,
        replyText: contact.closedReplyTime?.trim() || DEFAULT_HARD_CLOSED_REPLY,
      };

    case ACCEPTANCE_STATUS.OPEN:
    default:
      return {
        status: ACCEPTANCE_STATUS.OPEN,
        label: ACCEPTANCE_STATUS.OPEN,
        shortLabel: '受付中',
        pageTitle: ACCEPTANCE_STATUS.OPEN,
        badgeTone: 'open',
        formMode: 'full',
        leadText: contact.studioNoteLead,
        replyText: contact.replyTime,
        formDescription: contact.formDescription?.includes('\n')
          ? contact.formDescription
          : contact.formDescription?.replace(
              '下記フォームよりお送りください。',
              '下記フォームよりお送りください。\n',
            ) || DEFAULT_OPEN_FORM_DESCRIPTION,
      };
  }
}
