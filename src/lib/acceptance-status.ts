import type { ParsedContactSettings, SiteSettings } from '@/types/cms';

const DEFAULT_CLOSED_NOTE =
  '現在、新規のご相談の受付を一時休止しております。\n再開までいましばらくお待ちください。';
const DEFAULT_CLOSED_REPLY = '受付再開の時期は、お知らせページにてご案内いたします。';

export function getAcceptanceStatus(
  settings: SiteSettings,
  contact: ParsedContactSettings,
): {
  isAccepting: boolean;
  leadText: string;
  replyText: string;
} {
  const isAccepting = settings.isAcceptingOrders !== false;

  return {
    isAccepting,
    leadText: isAccepting
      ? contact.studioNoteLead
      : contact.closedNoteLead?.trim() || DEFAULT_CLOSED_NOTE,
    replyText: isAccepting
      ? contact.replyTime
      : contact.closedReplyTime?.trim() || DEFAULT_CLOSED_REPLY,
  };
}
