import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
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
      title: "Article not found",
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
      <div className="article-hero" data-burst="Read!">
        <div className="article-hero-copy">
          <span className="eyebrow">{article.category.name}</span>
          <h1>{article.title}</h1>
          <p>{article.excerpt}</p>
          <div className="article-meta-row">
            <span>{article.author.name || "Unknown author"}</span>
            <span>{formatDate(article.publishDate)}</span>
            <span>Updated {formatDate(article.updatedAt)}</span>
          </div>
          <div className="tag-list">
            {article.tags.map((tag) => (
              <Link className="tag-pill" href={`/?tag=${tag.slug}`} key={tag.id}>
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="article-hero-media">
          <Image
            alt={article.title}
            fill
            priority
            sizes="(max-width: 960px) 100vw, 44vw"
            src={article.coverImage || "/window.svg"}
          />
        </div>
      </div>
      <article
        className="article-prose"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </div>
  );
}
