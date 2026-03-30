import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatIssueLabel } from "@/lib/magazine";
import { getPublishedArticleBySlug } from "@/lib/public-content";
import { prisma } from "@/lib/prisma";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  try {
    const articles = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        publishDate: { lte: new Date() },
      },
      select: { slug: true },
    });

    return articles.map((article) => ({ slug: article.slug }));
  } catch {
    return [];
  }
}

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
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: article.coverImage ? [article.coverImage] : undefined,
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

  const coverImageIsRemote = Boolean(article.coverImage?.startsWith("http"));
  // Content is sanitized via sanitize-html in article-payload.ts before storage
  const sanitizedContent = article.content;

  // JSON-LD uses sanitized article data from the database
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage || undefined,
    datePublished: new Date(article.publishDate).toISOString(),
    dateModified: new Date(article.updatedAt).toISOString(),
    author: {
      "@type": "Person",
      name: article.author.name || "Redakce Spider-Verse",
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/articles/${article.slug}`),
    },
  };

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <div className="container article-page">
      <div className="article-hero splash-hero" data-burst="BAM!">
        <div className="article-hero-copy splash-copy">
          <Link className="eyebrow splash-backlink" href="/">
            Zpět na titulku
          </Link>
          <p className="issue-kicker">
            {article.category.name} / {formatIssueLabel(article.publishDate)}
          </p>
          <h1 data-text={article.title}>{article.title}</h1>
          <p>{article.excerpt}</p>
          <div className="article-meta-row splash-meta-row">
            <span>{article.author.name || "Redakce Spider-Verse"}</span>
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
            unoptimized={coverImageIsRemote}
          />
          <div className="splash-caption">Celostránkový panel z paralelního světa.</div>
        </div>
      </div>
      <article
        className="article-prose"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </div>
    </>
  );
}
