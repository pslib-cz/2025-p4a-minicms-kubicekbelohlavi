import Image from "next/image";
import Link from "next/link";

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
  };
};

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="article-card">
      <Link className="article-card-media" href={`/articles/${article.slug}`}>
        <Image
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          src={article.coverImage || "/window.svg"}
        />
      </Link>
      <div className="article-card-body">
        <div className="article-meta">
          <Link href={`/?category=${article.category.slug}`}>{article.category.name}</Link>
          <span>
            {new Intl.DateTimeFormat("cs-CZ", {
              dateStyle: "medium",
            }).format(new Date(article.publishDate))}
          </span>
        </div>
        <h3>
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h3>
        <p>{article.excerpt}</p>
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
