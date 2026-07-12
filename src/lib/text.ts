/** メタディスクリプション用にテキストを整形する */
export function toMetaDescription(
  shortDescription?: string,
  description?: string,
  maxLength = 120,
): string {
  const short = shortDescription?.trim();
  if (short) return short;

  const firstParagraph =
    description
      ?.split('\n')
      .map((line) => line.trim())
      .find(Boolean) ?? '';

  if (!firstParagraph) return '';

  if (firstParagraph.length <= maxLength) return firstParagraph;

  return `${firstParagraph.slice(0, maxLength).trimEnd()}…`;
}

/** Instagram URL から @ハンドル名を取得 */
export function getInstagramHandle(url?: string): string | undefined {
  if (!url?.trim()) return undefined;

  const trimmed = url.trim();
  if (trimmed.startsWith('@')) return trimmed;

  try {
    const pathname = new URL(
      trimmed.startsWith('http') ? trimmed : `https://instagram.com/${trimmed}`,
    ).pathname;
    const handle = pathname.split('/').filter(Boolean)[0];
    return handle ? `@${handle.replace(/^@/, '')}` : undefined;
  } catch {
    const handle = trimmed.replace(/^@/, '').split('/').filter(Boolean).pop();
    return handle ? `@${handle}` : undefined;
  }
}

/** X（Twitter）URL から @ハンドル名を取得 */
export function getXHandle(url?: string): string | undefined {
  if (!url?.trim()) return undefined;

  const trimmed = url.trim();
  if (trimmed.startsWith('@')) return trimmed;

  try {
    const pathname = new URL(
      trimmed.startsWith('http') ? trimmed : `https://x.com/${trimmed}`,
    ).pathname;
    const handle = pathname.split('/').filter(Boolean)[0];
    return handle ? `@${handle.replace(/^@/, '')}` : undefined;
  } catch {
    const handle = trimmed.replace(/^@/, '').split('/').filter(Boolean).pop();
    return handle ? `@${handle}` : undefined;
  }
}
