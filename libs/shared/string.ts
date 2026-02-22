/**
 * Convert a string into a URL-safe slug
 * @param value - String to slugify, e.g. "Risotto Champignons"
 * @returns Slug, e.g. "risotto-champignons"
 */
export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
