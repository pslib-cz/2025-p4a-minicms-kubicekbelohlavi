import Image from "next/image";
import Link from "next/link";
import { formatPanelNumber } from "@/lib/magazine";

type ArticleCardProps = {
  article: {
    slug: string;
    title: string;
    excerpt: string;
    coverImage: string | null;
    publishDate: Date | string;
    category: {
      name: string;
      slug: string;
    };
    tags: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
    author: {
      name: string | null;
    };
  };
  index: number;
};

export function ArticleCard({ article, index }: ArticleCardProps) {
  const publishedAt = new Intl.DateTimeFormat("cs-CZ", {
    dateStyle: "medium",
  }).format(new Date(article.publishDate));

  return (
    <article className="article-card panel-card" data-burst={formatPanelNumber(index)}>
      <Link className="article-card-media" href={`/articles/${article.slug}`}>
        <span className="article-card-stamp">{article.category.name}</span>
        <Image
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          src={article.coverImage || "/window.svg"}
        />
      </Link>
      <div className="article-card-body">
        <div className="article-meta article-panel-meta">
          <span>Panel {formatPanelNumber(index)}</span>
          <span>{publishedAt}</span>
        </div>
        <h3>
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h3>
        <p>{article.excerpt}</p>
        <p className="article-card-byline">
          Scénář: {article.author.name ?? "Redakce Inkspire"}
        </p>
        <div className="article-meta article-panel-links">
          <Link href={`/?category=${article.category.slug}`}>{article.category.name}</Link>
          <Link href={`/articles/${article.slug}`}>Otevřít splash</Link>
        </div>
        <div className="tag-list">
          {article.tags.map((tag) => (
            <Link className="tag-pill" href={`/?tag=${tag.slug}`} key={tag.id}>
              {tag.name}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
