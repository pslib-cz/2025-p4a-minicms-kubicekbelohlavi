import Image from "next/image";
import Link from "next/link";
import { ArticleCard } from "@/components/public/article-card";
import { ArticleFilters } from "@/components/public/article-filters";
import { PaginationLinks } from "@/components/public/pagination-links";
import { formatArticleCount, formatIssueLabel } from "@/lib/magazine";
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
  const leadPublishDate = featured?.publishDate ?? result.items[0]?.publishDate ?? new Date();
  const issueLabel = formatIssueLabel(leadPublishDate);
  const archiveLabel = formatArticleCount(result.total);
  const featuredImageIsRemote = Boolean(featured?.coverImage?.startsWith("http"));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: absoluteUrl("/"),
  };

  // JSON-LD uses trusted static siteConfig values, not user input
  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <div className="container page-stack">
      <section className="hero-card hero-stacked" data-burst="THWIP!">
        <div className="hero-banner">
          <Image
            alt="Spider-Verse inspired visual"
            fill
            priority
            sizes="100vw"
            src="https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=1600&q=80"
            unoptimized
          />
          <div className="hero-banner-overlay" />
        </div>
        <div className="hero-content">
          <div className="hero-copy">
            <span className="eyebrow">Spider-Verse vydání {issueLabel}</span>
            <h1 data-text="Komiksový magazín z paralelních světů">
              Komiksový magazín z paralelních světů
            </h1>
            <p>
              Redakční studio, serverová logika a vlastní CMS v Next.js.
              Každý článek má vlastní API, metadata i filtrování.
            </p>
            <div className="hero-actions">
              <Link className="primary-button" href="/dashboard">
                Vstoupit do studia
              </Link>
              <a className="secondary-button" href={absoluteUrl("/sitemap.xml")}>
                Sitemap
              </a>
            </div>
          </div>
          <div className="hero-stats">
            <div className="issue-stat-card">
              <span>Články</span>
              <strong>{archiveLabel}</strong>
            </div>
            <div className="issue-stat-card">
              <span>Kategorie</span>
              <strong>{categories.length}</strong>
            </div>
            <div className="issue-stat-card">
              <span>Štítky</span>
              <strong>{tags.length}</strong>
            </div>
            <div className="issue-stat-card">
              <span>SEO</span>
              <strong>Sitemap + OG</strong>
            </div>
          </div>
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
        <section className="featured-card cover-story" data-burst="POW!">
          <div className="featured-copy cover-story-copy">
            <span className="eyebrow">Hlavní článek čísla</span>
            <p className="issue-kicker">
              {featured.category.name} / {formatIssueLabel(featured.publishDate)}
            </p>
            <h2>{featured.title}</h2>
            <p>{featured.excerpt}</p>
            <div className="story-meta-strip">
              <span>{featured.author.name ?? "Redakce Spider-Verse"}</span>
              <span>
                Publikováno{" "}
                {new Intl.DateTimeFormat("cs-CZ", {
                  dateStyle: "medium",
                }).format(new Date(featured.publishDate))}
              </span>
            </div>
            <div className="tag-list">
              {featured.tags.map((tag) => (
                <Link className="tag-pill" href={`/?tag=${tag.slug}`} key={tag.id}>
                  {tag.name}
                </Link>
              ))}
            </div>
            <div className="hero-actions">
              <Link className="primary-button" href={`/articles/${featured.slug}`}>
                Číst článek
              </Link>
              <Link className="secondary-button" href={`/?category=${featured.category.slug}`}>
                Další z kategorie
              </Link>
            </div>
          </div>
          <div className="featured-media cover-story-media">
            <Image
              alt={featured.title}
              fill
              sizes="(max-width: 960px) 100vw, 42vw"
              src={featured.coverImage || "/window.svg"}
              unoptimized={featuredImageIsRemote}
            />
            <div className="cover-story-badge">Titulní panel</div>
          </div>
        </section>
      ) : null}
      <section className="results-head">
        <div>
          <span className="eyebrow">Archiv článků</span>
          <h2>{archiveLabel} v archivu</h2>
        </div>
        <p>
          Prohledávejte články — filtrujte podle textu,
          kategorií i štítků.
        </p>
      </section>
      {gridItems.length ? (
        <section className="article-grid">
          {gridItems.map((article, index) => (
            <ArticleCard article={article} index={index} key={article.id} />
          ))}
        </section>
      ) : null}
      {!result.items.length ? (
        <div className="empty-state">
          <h3>Žádné články neodpovídají vašemu hledání.</h3>
          <p>Zkuste rozšířit hledání nebo změnit filtr.</p>
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
    </>
  );
}
