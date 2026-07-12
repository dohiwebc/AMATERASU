import type { NewsItem } from '@/types/cms';

export interface NewsFilterOptions {
  featuredOnly?: boolean;
  limit?: number;
}

export function sortNewsItems(items: NewsItem[]): NewsItem[] {
  return [...items]
    .filter((item) => item.isVisible)
    .sort((a, b) => {
      const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateDiff !== 0) return dateDiff;
      return a.sortOrder - b.sortOrder;
    });
}

export function filterNews(items: NewsItem[], options: NewsFilterOptions = {}): NewsItem[] {
  const { featuredOnly = false, limit } = options;
  let result = sortNewsItems(items);

  if (featuredOnly) {
    result = result.filter((item) => item.isFeatured);
  }

  if (limit && limit > 0) {
    result = result.slice(0, limit);
  }

  return result;
}

export function formatNewsDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}
