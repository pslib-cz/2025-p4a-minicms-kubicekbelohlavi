import { toDatetimeLocalValue } from "@/lib/utils";

export type DashboardArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  publishDate: string;
  createdAt: string;
  updatedAt: string;
  status: "DRAFT" | "PUBLISHED";
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
};

export type TaxonomyItem = {
  id: string;
  name: string;
  slug: string;
  _count?: {
    articles: number;
  };
};

export type EditorValue = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  status: "DRAFT" | "PUBLISHED";
  publishDate: string;
  categoryId: string;
  tagIds: string[];
};

export const EMPTY_EDITOR_VALUE: EditorValue = {
  title: "",
  slug: "",
  excerpt: "",
  content: "<p></p>",
  coverImage: "",
  status: "DRAFT",
  publishDate: toDatetimeLocalValue(new Date()),
  categoryId: "",
  tagIds: [],
};

export function toEditorValue(article?: DashboardArticle): EditorValue {
  if (!article) {
    return EMPTY_EDITOR_VALUE;
  }

  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    coverImage: article.coverImage ?? "",
    status: article.status,
    publishDate: toDatetimeLocalValue(article.publishDate),
    categoryId: article.categoryId,
    tagIds: article.tags.map((tag) => tag.id),
  };
}
