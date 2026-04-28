export function getAuthorRouteSlug(slug?: string | null, fallbackName?: string | null) {
  const value = slug?.trim() || fallbackName?.trim() || "";
  return value;
}

export function buildAuthorArticlesPath(slug?: string | null, fallbackName?: string | null) {
  const value = getAuthorRouteSlug(slug, fallbackName);

  if (!value) {
    return undefined;
  }

  return `/author/${encodeURIComponent(value)}/articles`;
}

export function formatAuthorDisplayName(slug: string) {
  return decodeURIComponent(slug)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
