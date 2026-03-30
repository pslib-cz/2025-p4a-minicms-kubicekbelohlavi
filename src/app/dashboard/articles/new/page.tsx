import { ArticleWizard } from "@/components/dashboard/article-wizard";
import { requireUser } from "@/lib/auth";

export default async function NewArticlePage() {
  await requireUser();

  return <ArticleWizard />;
}
