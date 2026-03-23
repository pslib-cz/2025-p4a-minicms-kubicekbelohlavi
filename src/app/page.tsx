import Image from "next/image";
import Link from "next/link";
import { ArticleCard } from "@/components/public/article-card";
import { ArticleFilters } from "@/components/public/article-filters";
import { PaginationLinks } from "@/components/public/pagination-links";
import { getPublicTaxonomy, getPublishedArticles } from "@/lib/public-content";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { normalizePage } from "@/lib/utils";

export const revalidate = 60;

type SearchParams = Promise<{
  category?: string;
  page?: string;
  q?: string;
  tag?: string;
}>;

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolved = await searchParams;
  const filters = {
    category: resolved.category,
    page: normalizePage(resolved.page),
    query: resolved.q,
    tag: resolved.tag,
  };
  const [{ categories, tags }, result] = await Promise.all([
    getPublicTaxonomy(),
    getPublishedArticles(filters, siteConfig.pageSize),
  ]);
  const shouldFeature =
    result.page === 1 &&
    !filters.query &&
    !filters.category &&
    !filters.tag &&
    result.items.length > 0;
  const featured = shouldFeature ? result.items[0] : null;
  const gridItems = shouldFeature ? result.items.slice(1) : result.items;

  return (
    <div className="container page-stack">
      <section className="hero-card" data-burst="Pow!">
        <div className="hero-copy">
          <span className="eyebrow">Public section rendered on the server</span>
          <h1>Editorial publishing with fast indexing and a protected dashboard.</h1>
          <p>
            Inkspire demonstrates a full Next.js App Router CMS: public content,
            Route Handler API, Prisma data model, Auth.js sign-in, pagination,
            metadata, sitemap, robots, and analytics consent.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="/dashboard">
              Open dashboard
            </Link>
            <a className="secondary-button" href={absoluteUrl("/sitemap.xml")}>
              View sitemap
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <Image
            alt="Editorial workspace"
            fill
            priority
            sizes="(max-width: 960px) 100vw, 40vw"
            src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1200&q=80"
          />
        </div>
      </section>
      <ArticleFilters
        categories={categories}
        query={filters.query}
        selectedCategory={filters.category}
        selectedTag={filters.tag}
        tags={tags}
      />
      {featured ? (
        <section className="featured-card" data-burst="Wow!">
          <div className="featured-copy">
            <span className="eyebrow">Featured article</span>
            <h2>{featured.title}</h2>
            <p>{featured.excerpt}</p>
            <div className="tag-list">
              {featured.tags.map((tag) => (
                <Link className="tag-pill" href={`/?tag=${tag.slug}`} key={tag.id}>
                  {tag.name}
                </Link>
              ))}
            </div>
            <div className="hero-actions">
              <Link className="primary-button" href={`/articles/${featured.slug}`}>
                Read article
              </Link>
            </div>
          </div>
          <div className="featured-media">
            <Image
              alt={featured.title}
              fill
              sizes="(max-width: 960px) 100vw, 42vw"
              src={featured.coverImage || "/window.svg"}
            />
          </div>
        </section>
      ) : null}
      <section className="results-head">
        <div>
          <span className="eyebrow">Published archive</span>
          <h2>{result.total} matching article{result.total === 1 ? "" : "s"}</h2>
        </div>
        <p>
          Search by title or text, filter by category and tag, and navigate across
          paginated results.
        </p>
      </section>
      <section className="article-grid">
        {gridItems.map((article) => (
          <ArticleCard article={article} key={article.id} />
        ))}
      </section>
      {!gridItems.length ? (
        <div className="empty-state">
          <h3>No published articles matched your filters.</h3>
          <p>Try broadening the search terms or clearing the active taxonomy filter.</p>
        </div>
      ) : null}
      <PaginationLinks
        page={result.page}
        searchParams={{
          category: filters.category,
          q: filters.query,
          tag: filters.tag,
        }}
        totalPages={result.totalPages}
      />
    </div>
  );
}
