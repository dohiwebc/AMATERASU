/** 外部リンク・メール等かどうか */
export function isExternalHref(href: string): boolean {
  return /^(https?:|mailto:|tel:|#)/.test(href);
}

/** base 配下のパスに変換（例: /plans/ → /AMATERASU/plans/） */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL;
  if (!path || path === '/') return base;
  const normalized = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${normalized}`;
}

/** 内部リンク用に href を解決 */
export function resolveHref(href: string): string {
  return isExternalHref(href) ? href : withBase(href);
}
