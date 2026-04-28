import { Link, useLoaderData } from "react-router";
import type { Route } from "./+types/author-articles.$slug";
import { generateMetaTags } from "~/utils/seo";
import { buildAuthorArticlesPath } from "~/lib/authorRoutes";
import { buildArticlePath } from "~/lib/articleRoutes";
import { KitabatAuthorCard } from "~/components/Post/AuthorCard";
import { cache, CacheTTL } from "~/lib/cache";
import { postsService, type Post } from "~/services/postsService";
import { writersService, type Writer } from "~/services/writersService";
import { cleanPlainText } from "~/utils/arabicTextUtils";

interface AuthorArticleListItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  categoryName: string;
  categorySlug: string;
  publishedAt: string;
}

interface AuthorArticlesData {
  author: {
    slug: string;
    name: string;
    role: string;
    bio: string;
    articleCount: number;
    image?: string;
    twitterUrl?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    linkedinUrl?: string;
    telegramUrl?: string;
    whatsAppUrl?: string;
    youtubeUrl?: string;
  };
  articles: AuthorArticleListItem[];
}

function pickFirstString(...values: Array<string | null | undefined>) {
  const value = values.find((item) => typeof item === "string" && item.trim().length > 0);
  return typeof value === "string" ? value : undefined;
}

function getWriterSocialLinks(writer: Writer | null | undefined) {
  const social = writer?.socialAccounts;

  return {
    facebookUrl: pickFirstString(writer?.facebookUrl, writer?.facebook, social?.facebook, social?.Facebook),
    twitterUrl: pickFirstString(writer?.twitterUrl, writer?.twitter, social?.twitter, social?.Twitter),
    instagramUrl: pickFirstString(writer?.instagramUrl, writer?.instagram, social?.instagram, social?.Instagram),
    linkedinUrl: pickFirstString(writer?.linkedInUrl, writer?.linkedIn, writer?.linkedin, social?.linkedin, social?.LinkedIn),
    telegramUrl: pickFirstString(writer?.telegramUrl, writer?.telegram, social?.telegram, social?.Telegram),
    whatsAppUrl: pickFirstString(writer?.whatsAppUrl, writer?.whatsApp, social?.whatsApp, social?.WhatsApp),
    youtubeUrl: pickFirstString(writer?.youtubeUrl, writer?.youtube, social?.youtube, social?.YouTube),
  };
}

function mapPostsToAuthorArticles(posts: Post[]): AuthorArticleListItem[] {
  return posts.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    summary: post.summary || post.description || "",
    categoryName: post.categoryName,
    categorySlug: post.categorySlug,
    publishedAt: post.publishedAt,
  }));
}

function formatArticleDateTime(value: string) {
  const date = new Date(value);

  return {
    dateLabel: date.toLocaleDateString("ar-EG", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
    }),
    timeLabel: date.toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  };
}

export async function loader({ params }: Route.LoaderArgs): Promise<AuthorArticlesData> {
  const slug = params.slug;

  if (!slug) {
    throw new Response("Author slug required", { status: 404 });
  }

  try {
    const [writer, postsResponse] = await Promise.all([
      cache.getOrFetch(
        `writer:${slug}`,
        () => writersService.getWriterById(slug),
        CacheTTL.MEDIUM
      ),
      cache.getOrFetch(
        "posts:kitabat:writers:90",
        () => postsService.getPosts({ hasWriter: true, pageNumber: 1, pageSize: 90 }),
        CacheTTL.SHORT
      ),
    ]);

    const articles = mapPostsToAuthorArticles(
      postsResponse.items.filter((post) => post.writerId === slug)
    );
    const writerSocialLinks = getWriterSocialLinks(writer);

    return {
      author: {
        slug,
        name: writer.name,
        role: "كاتب",
        bio: writer.bio || "",
        articleCount: articles.length,
        image: writer.imageUrl || undefined,
        ...writerSocialLinks,
      },
      articles,
    };
  } catch (error) {
    throw new Response("Author not found", { status: 404 });
  }
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) {
    return [{ title: "مقالات الكاتب | الثورة" }];
  }

  return generateMetaTags({
    title: `مقالات ${data.author.name}`,
    description: `تصفح المقالات التجريبية المنسوبة إلى ${data.author.name} ضمن صفحة الكاتب الجديدة على موقع الثورة.`,
    url: buildAuthorArticlesPath(data.author.slug) || "/",
    type: "website",
  });
}

export default function AuthorArticlesPage() {
  const { author, articles } = useLoaderData<typeof loader>();

  return (
    <main className="semafor-container min-h-screen py-5 sm:py-6 md:py-10" dir="rtl" lang="ar">
      <section className="pt-4 sm:pt-6 md:pt-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10 xl:gap-14">
          <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:w-80 xl:w-[22rem]">
            <div className="mx-auto w-full max-w-sm lg:max-w-none">
              <KitabatAuthorCard
                name={author.name}
                role={author.role}
                bio={author.bio}
                image={author.image}
                href={buildAuthorArticlesPath(author.slug, author.name)}
                twitterUrl={author.twitterUrl}
                facebookUrl={author.facebookUrl}
                instagramUrl={author.instagramUrl}
                linkedinUrl={author.linkedinUrl}
                telegramUrl={author.telegramUrl}
                whatsAppUrl={author.whatsAppUrl}
                youtubeUrl={author.youtubeUrl}
              />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="space-y-0">
              {articles.length === 0 ? (
                <div className="border-b border-dashed border-black/10 py-8 text-right text-sm leading-7 text-gray-600 sm:text-base">
                  لا توجد مقالات منشورة لهذا الكاتب حالياً.
                </div>
              ) : (
                articles.map((article) => {
                  const articleHref = buildArticlePath({
                    slug: article.slug,
                    categorySlug: article.categorySlug,
                    categoryName: article.categoryName,
                  });
                  const { dateLabel, timeLabel } = formatArticleDateTime(article.publishedAt);

                  return (
                    <article
                      key={article.id}
                      className="border-b border-dashed border-black/10"
                    >
                      <Link
                        to={articleHref}
                        className="group block rounded-sm px-1 py-5 transition-colors hover:bg-black/[0.02] sm:px-3 sm:py-6 md:px-4"
                      >
                        <h3 className="mb-3 text-right text-xl font-bold leading-8 text-gray-900 transition-colors group-hover:text-[#1a3a4a] sm:text-2xl sm:leading-10">
                          {article.title}
                        </h3>
                        <p className="mb-4 text-right text-sm leading-7 text-gray-700 sm:text-base sm:leading-8">
                          {cleanPlainText(article.summary)}
                        </p>
                        <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-xs text-gray-600 sm:text-sm">
                          <span className="font-semibold text-gray-800">{article.categoryName}</span>
                          <span>{dateLabel}</span>
                          <span>{timeLabel}</span>
                        </div>
                      </Link>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
