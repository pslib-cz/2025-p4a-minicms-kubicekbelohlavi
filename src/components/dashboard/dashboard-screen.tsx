"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { startTransition, useEffect, useState } from "react";
import { AppShell, Grid, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { DashboardArticlesPanel } from "@/components/dashboard/dashboard-articles-panel";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardStudioHero } from "@/components/dashboard/dashboard-studio-hero";
import {
  toEditorValue,
  type DashboardArticle,
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
  const router = useRouter();
  const [articles, setArticles] = useState<DashboardArticle[]>([]);
  const [categories, setCategories] = useState<TaxonomyItem[]>([]);
  const [tags, setTags] = useState<TaxonomyItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingArticles, setLoadingArticles] = useState(true);

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

  const handleDeleteArticle = async (article: DashboardArticle) => {
    const confirmed = window.confirm(`Opravdu smazat článek "${article.title}"?`);

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
    <AppShell header={{ height: 92 }} padding="lg">
      <AppShell.Header>
        <DashboardHeader
          onCreate={() => router.push("/dashboard/articles/new")}
          onSignOut={() => void signOut({ callbackUrl: "/" })}
          userLabel={user.name || user.email || "Redakce"}
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
                onCreate={() => router.push("/dashboard/articles/new")}
                onDelete={(article) => void handleDeleteArticle(article)}
                onEdit={(article) => router.push(`/dashboard/articles/${article.id}/edit`)}
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
                  title="Kategorie"
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
  );
}
