/** 旧slug → 現行slug（CMS変更時の互換用） */
export const PLAN_SLUG_ALIASES: Record<string, string> = {
  'web-meishi': 'web-card',
  team: 'team-page',
};

export function resolvePlanSlug(slug: string): string {
  return PLAN_SLUG_ALIASES[slug] ?? slug;
}
