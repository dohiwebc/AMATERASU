import type { Faq, FaqCategory } from '@/types/cms';

export interface FaqFilterOptions {
  categories?: FaqCategory[];
  featuredOnly?: boolean;
  limit?: number;
}

export function filterFaqs(faqs: Faq[], options: FaqFilterOptions = {}): Faq[] {
  const { categories, featuredOnly = false, limit } = options;

  let result = faqs.filter((faq) => faq.isVisible);

  if (featuredOnly) {
    result = result.filter((faq) => faq.isFeatured);
  }

  if (categories?.length) {
    result = result.filter((faq) => categories.includes(faq.category));
    result.sort((a, b) => {
      const categoryDiff = categories.indexOf(a.category) - categories.indexOf(b.category);
      if (categoryDiff !== 0) return categoryDiff;
      return a.sortOrder - b.sortOrder;
    });
  } else {
    result.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  if (limit && limit > 0) {
    result = result.slice(0, limit);
  }

  return result;
}

export function groupFaqsByCategory(
  faqs: Faq[],
  categories: FaqCategory[],
): { category: FaqCategory; items: Faq[] }[] {
  return categories
    .map((category) => ({
      category,
      items: faqs
        .filter((faq) => faq.isVisible && faq.category === category)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    }))
    .filter((group) => group.items.length > 0);
}
