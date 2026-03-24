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

  return (
    <div className="container page-stack">
      <section className="hero-card issue-cover" data-burst="Číslo!">
        <div className="hero-copy issue-cover-copy">
          <span className="eyebrow">Serverově kreslené vydání</span>
          <p className="issue-kicker">Vydání {issueLabel}</p>
          <h1>Český komiksový magazín, který řeže stránku jako splash panel.</h1>
          <p>
            {siteConfig.description} Veřejná část drží serverovou disciplínu,
            redakční studio běží klientsky a každá story má vlastní API stopu,
            metadata i filtrování.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="/dashboard">
              Vstoupit do studia
            </Link>
            <a className="secondary-button" href={absoluteUrl("/sitemap.xml")}>
              Projít sitemapu
            </a>
          </div>
        </div>
        <div className="issue-cover-sidebar">
          <div className="issue-stat-card">
            <span className="eyebrow">Tah čísla</span>
            <strong>{archiveLabel}</strong>
            <p>v archivu, který se dá filtrovat podle rubrik, štítků i fulltextu.</p>
          </div>
          <div className="issue-stat-grid">
            <div className="issue-stat-card">
              <span>Rubriky</span>
              <strong>{categories.length}</strong>
            </div>
            <div className="issue-stat-card">
              <span>Štítky</span>
              <strong>{tags.length}</strong>
            </div>
            <div className="issue-stat-card">
              <span>Lead story</span>
              <strong>{featured ? "Ano" : "Archiv"}</strong>
            </div>
            <div className="issue-stat-card">
              <span>SEO</span>
              <strong>Sitemap + OG</strong>
            </div>
          </div>
        </div>
        <div className="hero-visual issue-cover-visual">
          <Image
            alt="Koláž městských panelů a redakčního studia"
            fill
            priority
            sizes="(max-width: 960px) 100vw, 40vw"
            src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1200&q=80"
          />
          <div className="issue-cover-caption">
            Halftone svět, diagonály a redakční rytmus v jednom čísle.
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
        <section className="featured-card cover-story" data-burst="Cover!">
          <div className="featured-copy cover-story-copy">
            <span className="eyebrow">Hlavní story čísla</span>
            <p className="issue-kicker">
              {featured.category.name} / {formatIssueLabel(featured.publishDate)}
            </p>
            <h2>{featured.title}</h2>
            <p>{featured.excerpt}</p>
            <div className="story-meta-strip">
              <span>{featured.author.name ?? "Redakce Inkspire"}</span>
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
                Číst splash page
              </Link>
              <Link className="secondary-button" href={`/?category=${featured.category.slug}`}>
                Další z rubriky
              </Link>
            </div>
          </div>
          <div className="featured-media cover-story-media">
            <Image
              alt={featured.title}
              fill
              sizes="(max-width: 960px) 100vw, 42vw"
              src={featured.coverImage || "/window.svg"}
            />
            <div className="cover-story-badge">Titulka</div>
          </div>
        </section>
      ) : null}
      <section className="results-head">
        <div>
          <span className="eyebrow">Archiv panelů</span>
          <h2>{archiveLabel} v aktivním zorném poli</h2>
        </div>
        <p>
          Filtrujte titul, text, rubriku i štítky a přepínejte mezi stránkami jako
          mezi jednotlivými čísly magazínu.
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
          <h3>V archivu nic nezůstalo v záběru.</h3>
          <p>Zkuste rozšířit hledání nebo vypnout aktivní rubriku či štítek.</p>
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
