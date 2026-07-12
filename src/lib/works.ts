import type { Plan, Work } from '@/types/cms';

export interface WorkRelatedPlan {
  slug: string;
  title: string;
}

export type WorkPlanFilterType = 'all' | string;

export function buildWorkPlansMap(plans: Plan[]): Map<string, WorkRelatedPlan[]> {
  const map = new Map<string, Map<string, WorkRelatedPlan>>();

  for (const plan of plans) {
    for (const work of plan.relatedWorks ?? []) {
      const bySlug = map.get(work.id) ?? new Map<string, WorkRelatedPlan>();
      bySlug.set(plan.slug, { slug: plan.slug, title: plan.title });
      map.set(work.id, bySlug);
    }
  }

  const result = new Map<string, WorkRelatedPlan[]>();
  const planOrder = new Map(plans.map((plan, index) => [plan.slug, index]));

  for (const [workId, bySlug] of map) {
    const relatedPlans = [...bySlug.values()].sort(
      (a, b) => (planOrder.get(a.slug) ?? 0) - (planOrder.get(b.slug) ?? 0),
    );
    result.set(workId, relatedPlans);
  }

  return result;
}

export function countWorksByPlanSlug(
  works: Work[],
  plansMap: Map<string, WorkRelatedPlan[]>,
): Record<string, number> {
  const counts: Record<string, number> = { all: works.length };

  for (const work of works) {
    for (const plan of plansMap.get(work.id) ?? []) {
      counts[plan.slug] ??= 0;
      counts[plan.slug] += 1;
    }
  }

  return counts;
}

export function isPlanSlug(value: string, planSlugs: string[]): boolean {
  return planSlugs.includes(value);
}
