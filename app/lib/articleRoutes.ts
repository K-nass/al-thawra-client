interface ArticleRouteTarget {
  slug: string;
  categorySlug: string;
  categoryName?: string | null;
}

const KITABAT_CATEGORY_NAME = "كتابات";

export function isKitabatArticle(target: Pick<ArticleRouteTarget, "categoryName">) {
  return target.categoryName?.trim() === KITABAT_CATEGORY_NAME;
}

export function buildArticlePath(target: ArticleRouteTarget) {
  if (isKitabatArticle(target)) {
    return `/kitabat/${target.categorySlug}/articles/${target.slug}`;
  }

  return `/posts/categories/${target.categorySlug}/articles/${target.slug}`;
}
