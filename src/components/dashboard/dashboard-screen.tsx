"use client";

import { signOut } from "next-auth/react";
import { startTransition, useEffect, useState } from "react";
import { AppShell, Grid, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { ArticleEditorModal } from "@/components/dashboard/article-editor-modal";
import { DashboardArticlesPanel } from "@/components/dashboard/dashboard-articles-panel";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardStudioHero } from "@/components/dashboard/dashboard-studio-hero";
import {
  EMPTY_EDITOR_VALUE,
  toEditorValue,
  type DashboardArticle,
  type EditorValue,
  type TaxonomyItem,
} from "@/components/dashboard/dashboard-types";
import { TaxonomyPanel } from "@/components/dashboard/taxonomy-panel";
import { siteConfig } from "@/lib/site";

type DashboardScreenProps = {
  user: {
    email?: string | null;
    name?: string | null;
  };
};

export function DashboardScreen({ user }: DashboardScreenProps) {
  const [articles, setArticles] = useState<DashboardArticle[]>([]);
  const [categories, setCategories] = useState<TaxonomyItem[]>([]);
  const [tags, setTags] = useState<TaxonomyItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [savingArticle, setSavingArticle] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorError, setEditorError] = useState<string | null>(null);
  const [editorValue, setEditorValue] = useState<EditorValue>(EMPTY_EDITOR_VALUE);

  const loadTaxonomies = async () => {
    const [categoryResponse, tagResponse] = await Promise.all([
      fetch("/api/dashboard/categories"),
      fetch("/api/dashboard/tags"),
    ]);

    const categoryData = (await categoryResponse.json()) as { items: TaxonomyItem[] };
    const tagData = (await tagResponse.json()) as { items: TaxonomyItem[] };

    if (categoryResponse.ok) {
      setCategories(categoryData.items);
    }

    if (tagResponse.ok) {
      setTags(tagData.items);
    }
  };

  const loadArticles = async (nextPage: number) => {
    const response = await fetch(`/api/dashboard/articles?page=${nextPage}`);
    const data = (await response.json()) as {
      items: DashboardArticle[];
      page: number;
      total: number;
      totalPages: number;
    };

    if (!response.ok) {
      notifications.show({
        color: "red",
        message: "Nepodařilo se načíst vaše články.",
      });
      setLoadingArticles(false);
      return;
    }

    setArticles(data.items);
    setTotalArticles(data.total);
    setTotalPages(data.totalPages);
    setPage(data.page);
    setLoadingArticles(false);
  };

  useEffect(() => {
    let active = true;

    const run = async () => {
      const [categoryResponse, tagResponse] = await Promise.all([
        fetch("/api/dashboard/categories"),
        fetch("/api/dashboard/tags"),
      ]);
      const categoryData = (await categoryResponse.json()) as { items: TaxonomyItem[] };
      const tagData = (await tagResponse.json()) as { items: TaxonomyItem[] };

      if (!active) {
        return;
      }

      if (categoryResponse.ok) {
        setCategories(categoryData.items);
      }

      if (tagResponse.ok) {
        setTags(tagData.items);
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const run = async () => {
      const response = await fetch(`/api/dashboard/articles?page=${page}`);
      const data = (await response.json()) as {
        items: DashboardArticle[];
        page: number;
        total: number;
        totalPages: number;
      };

      if (!active) {
        return;
      }

      if (!response.ok) {
        notifications.show({
          color: "red",
          message: "Nepodařilo se načíst vaše články.",
        });
        setLoadingArticles(false);
        return;
      }

      setArticles(data.items);
      setTotalArticles(data.total);
      setTotalPages(data.totalPages);
      setPage(data.page);
      setLoadingArticles(false);
    };

    void run();

    return () => {
      active = false;
    };
  }, [page]);

  const refreshAll = async () => {
    await Promise.all([loadTaxonomies(), loadArticles(page)]);
  };

  const openCreateModal = () => {
    setEditorError(null);
    setEditorValue({
      ...EMPTY_EDITOR_VALUE,
      categoryId: categories[0]?.id ?? "",
    });
    setEditorOpen(true);
  };

  const openEditModal = (article: DashboardArticle) => {
    setEditorError(null);
    setEditorValue(toEditorValue(article));
    setEditorOpen(true);
  };

  const handleSaveArticle = async (values: EditorValue) => {
    setSavingArticle(true);
    setEditorError(null);

    const response = await fetch(
      values.id ? `/api/dashboard/articles/${values.id}` : "/api/dashboard/articles",
      {
        method: values.id ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      },
    );
    const data = (await response.json()) as {
      details?: { fieldErrors?: Record<string, string[]> };
      error?: string;
    };

    setSavingArticle(false);

    if (!response.ok) {
      const fieldErrors = data.details?.fieldErrors
        ? Object.values(data.details.fieldErrors)
            .flat()
            .filter(Boolean)
            .join(" ")
        : "";
      setEditorError(fieldErrors || data.error || "Nepodařilo se uložit článek.");
      return;
    }

    setEditorOpen(false);
    notifications.show({
      color: "teal",
      message: values.id ? "Článek byl upraven." : "Článek byl vytvořen.",
    });
    setLoadingArticles(true);
    await loadArticles(page);
  };

  const handleDeleteArticle = async (article: DashboardArticle) => {
    const confirmed = window.confirm(`Opravdu smazat článek „${article.title}“?`);

    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/dashboard/articles/${article.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      notifications.show({
        color: "red",
        message: "Nepodařilo se smazat článek.",
      });
      return;
    }

    notifications.show({
      color: "teal",
      message: "Článek byl smazán.",
    });
    setLoadingArticles(true);
    await loadArticles(page);
  };

  const handleToggleStatus = async (article: DashboardArticle) => {
    const response = await fetch(`/api/dashboard/articles/${article.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...toEditorValue(article),
        status: article.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED",
      }),
    });

    if (!response.ok) {
      notifications.show({
        color: "red",
        message: "Nepodařilo se změnit stav publikace.",
      });
      return;
    }

    setLoadingArticles(true);
    await loadArticles(page);
  };

  return (
    <>
      <AppShell header={{ height: 92 }} padding="lg">
        <AppShell.Header>
          <DashboardHeader
            onCreate={openCreateModal}
            onSignOut={() => void signOut({ callbackUrl: "/" })}
            userLabel={user.name || user.email || "Redakční identita"}
          />
        </AppShell.Header>
        <AppShell.Main>
          <Stack gap="lg">
            <DashboardStudioHero
              articleCount={totalArticles}
              categoryCount={categories.length}
              tagCount={tags.length}
            />
            <Grid gutter="lg">
              <Grid.Col span={{ base: 12, lg: 8 }}>
                <DashboardArticlesPanel
                  articles={articles}
                  loading={loadingArticles}
                  onCreate={openCreateModal}
                  onDelete={(article) => void handleDeleteArticle(article)}
                  onEdit={openEditModal}
                  onNextPage={() => {
                    setLoadingArticles(true);
                    startTransition(() => setPage((current) => current + 1));
                  }}
                  onPreviousPage={() => {
                    setLoadingArticles(true);
                    startTransition(() => setPage((current) => current - 1));
                  }}
                  onToggleStatus={(article) => void handleToggleStatus(article)}
                  page={page}
                  pageSize={siteConfig.dashboardPageSize}
                  totalArticles={totalArticles}
                  totalPages={totalPages}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, lg: 4 }}>
                <Stack>
                  <TaxonomyPanel
                    endpoint="/api/dashboard/categories"
                    itemLabel="rubrika"
                    items={categories}
                    onRefresh={refreshAll}
                    title="Rubriky"
                  />
                  <TaxonomyPanel
                    endpoint="/api/dashboard/tags"
                    itemLabel="štítek"
                    items={tags}
                    onRefresh={refreshAll}
                    title="Štítky"
                  />
                </Stack>
              </Grid.Col>
            </Grid>
          </Stack>
        </AppShell.Main>
      </AppShell>
      <ArticleEditorModal
        categories={categories}
        error={editorError}
        loading={savingArticle}
        onClose={() => setEditorOpen(false)}
        onSubmit={(values) => void handleSaveArticle(values)}
        opened={editorOpen}
        tags={tags}
        value={editorValue}
      />
    </>
  );
}
