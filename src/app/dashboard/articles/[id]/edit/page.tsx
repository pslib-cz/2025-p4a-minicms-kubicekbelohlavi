import { ArticleEditScreen } from "@/components/dashboard/article-edit-screen";
import { requireUser } from "@/lib/auth";

type Params = Promise<{ id: string }>;

export default async function EditArticlePage({
  params,
}: {
  params: Params;
}) {
  await requireUser();
  const { id } = await params;

  return <ArticleEditScreen articleId={id} />;
}
