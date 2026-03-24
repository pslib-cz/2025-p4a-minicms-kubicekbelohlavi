import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatIssueLabel } from "@/lib/magazine";
import { getPublishedArticleBySlug } from "@/lib/public-content";
import { absoluteUrl } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    return {
      title: "Článek nenalezen",
    };
  }

  const url = absoluteUrl(`/articles/${article.slug}`);

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url,
      type: "article",
      publishedTime: new Date(article.publishDate).toISOString(),
      images: article.coverImage ? [{ url: article.coverImage }] : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="container article-page">
      <div className="article-hero splash-hero" data-burst="Splash!">
        <div className="article-hero-copy splash-copy">
          <Link className="eyebrow splash-backlink" href="/">
            Zpět na titulku
          </Link>
          <p className="issue-kicker">
            {article.category.name} / {formatIssueLabel(article.publishDate)}
          </p>
          <h1>{article.title}</h1>
          <p>{article.excerpt}</p>
          <div className="article-meta-row splash-meta-row">
            <span>{article.author.name || "Redakce Inkspire"}</span>
            <span>Vydáno {formatDate(article.publishDate)}</span>
            <span>Aktualizováno {formatDate(article.updatedAt)}</span>
          </div>
          <div className="tag-list">
            {article.tags.map((tag) => (
              <Link className="tag-pill" href={`/?tag=${tag.slug}`} key={tag.id}>
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="article-hero-media splash-media">
          <Image
            alt={article.title}
            fill
            priority
            sizes="(max-width: 960px) 100vw, 44vw"
            src={article.coverImage || "/window.svg"}
          />
          <div className="splash-caption">Plná stránka, tvrdé obrysy, čistý tah.</div>
        </div>
      </div>
      <article
        className="article-prose"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </div>
  );
}
