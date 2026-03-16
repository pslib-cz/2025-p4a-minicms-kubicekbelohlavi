"use client";

import { signOut } from "next-auth/react";
import { startTransition, useEffect, useState } from "react";
import {
  ActionIcon,
  AppShell,
  Badge,
  Button,
  Card,
  Grid,
  Group,
  Loader,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { ArticleEditorModal } from "@/components/dashboard/article-editor-modal";
import { TaxonomyPanel } from "@/components/dashboard/taxonomy-panel";
import { toDatetimeLocalValue } from "@/lib/utils";

type DashboardArticle = {
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

type TaxonomyItem = {
  id: string;
  name: string;
  slug: string;
  _count?: {
    articles: number;
  };
};

type EditorValue = {
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

const EMPTY_EDITOR_VALUE: EditorValue = {
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

function toEditorValue(article?: DashboardArticle): EditorValue {
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
      totalPages: number;
      page: number;
    };

    if (!response.ok) {
      notifications.show({
        color: "red",
        message: "Failed to load your articles.",
      });
      setLoadingArticles(false);
      return;
    }

    setArticles(data.items);
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
      const categoryData = (await categoryResponse.json()) as {
        items: TaxonomyItem[];
      };
      const tagData = (await tagResponse.json()) as {
        items: TaxonomyItem[];
      };

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
        totalPages: number;
        page: number;
      };

      if (!active) {
        return;
      }

      if (!response.ok) {
        notifications.show({
          color: "red",
          message: "Failed to load your articles.",
        });
        setLoadingArticles(false);
        return;
      }

      setArticles(data.items);
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
      error?: string;
      details?: { fieldErrors?: Record<string, string[]> };
    };

    setSavingArticle(false);

    if (!response.ok) {
      const fieldErrors = data.details?.fieldErrors
        ? Object.values(data.details.fieldErrors)
            .flat()
            .filter(Boolean)
            .join(" ")
        : "";
      setEditorError(fieldErrors || data.error || "Failed to save article.");
      return;
    }

    setEditorOpen(false);
    notifications.show({
      color: "teal",
      message: values.id ? "Article updated." : "Article created.",
    });
    setLoadingArticles(true);
    await loadArticles(page);
  };

  const handleDeleteArticle = async (article: DashboardArticle) => {
    const confirmed = window.confirm(`Delete "${article.title}"?`);

    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/dashboard/articles/${article.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      notifications.show({
        color: "red",
        message: "Failed to delete article.",
      });
      return;
    }

    notifications.show({
      color: "teal",
      message: "Article deleted.",
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
        message: "Failed to change publication status.",
      });
      return;
    }

    setLoadingArticles(true);
    await loadArticles(page);
  };

  return (
    <>
      <AppShell header={{ height: 72 }} padding="lg">
        <AppShell.Header>
          <Group className="dashboard-bar" justify="space-between">
            <div>
              <Text fw={700}>Dashboard</Text>
              <Text c="dimmed" size="sm">
                {user.name || user.email}
              </Text>
            </div>
            <Group>
              <Button leftSection={<IconPlus size={16} />} onClick={openCreateModal}>
                New article
              </Button>
              <Button onClick={() => void signOut({ callbackUrl: "/" })} variant="default">
                Sign out
              </Button>
            </Group>
          </Group>
        </AppShell.Header>
        <AppShell.Main>
          <Stack gap="lg">
            <div className="dashboard-intro">
              <span className="eyebrow">Client-side editorial workspace</span>
              <h1>Manage only your own content.</h1>
              <p>
                The dashboard talks to protected Route Handlers, and every API call
                enforces both authentication and ownership.
              </p>
            </div>
            <Grid gutter="lg">
              <Grid.Col span={{ base: 12, lg: 8 }}>
                <Card p="lg" radius="lg" shadow="sm" withBorder>
                  <Stack>
                    <Group justify="space-between">
                      <div>
                        <Text fw={700} size="lg">
                          Your articles
                        </Text>
                        <Text c="dimmed" size="sm">
                          Paginated overview with publishing actions.
                        </Text>
                      </div>
                    </Group>
                    {loadingArticles ? (
                      <Group justify="center" py="xl">
                        <Loader />
                      </Group>
                    ) : (
                      <Table.ScrollContainer minWidth={760}>
                        <Table highlightOnHover verticalSpacing="md">
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Th>Title</Table.Th>
                              <Table.Th>Status</Table.Th>
                              <Table.Th>Category</Table.Th>
                              <Table.Th>Updated</Table.Th>
                              <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {articles.map((article) => (
                              <Table.Tr key={article.id}>
                                <Table.Td>
                                  <Text fw={600}>{article.title}</Text>
                                  <Text c="dimmed" size="sm">
                                    {article.slug}
                                  </Text>
                                </Table.Td>
                                <Table.Td>
                                  <Badge
                                    color={
                                      article.status === "PUBLISHED" ? "teal" : "gray"
                                    }
                                    variant="light"
                                  >
                                    {article.status}
                                  </Badge>
                                </Table.Td>
                                <Table.Td>{article.category.name}</Table.Td>
                                <Table.Td>
                                  {new Intl.DateTimeFormat("cs-CZ", {
                                    dateStyle: "medium",
                                  }).format(new Date(article.updatedAt))}
                                </Table.Td>
                                <Table.Td>
                                  <Group gap="xs" wrap="nowrap">
                                    <Button
                                      onClick={() => void handleToggleStatus(article)}
                                      size="xs"
                                      variant="light"
                                    >
                                      {article.status === "PUBLISHED"
                                        ? "Move to draft"
                                        : "Publish"}
                                    </Button>
                                    <ActionIcon
                                      aria-label={`Edit ${article.title}`}
                                      onClick={() => openEditModal(article)}
                                      variant="light"
                                    >
                                      <IconEdit size={16} />
                                    </ActionIcon>
                                    <ActionIcon
                                      aria-label={`Delete ${article.title}`}
                                      color="red"
                                      onClick={() => void handleDeleteArticle(article)}
                                      variant="light"
                                    >
                                      <IconTrash size={16} />
                                    </ActionIcon>
                                  </Group>
                                </Table.Td>
                              </Table.Tr>
                            ))}
                            {!articles.length ? (
                              <Table.Tr>
                                <Table.Td colSpan={5}>
                                  <Text c="dimmed" ta="center">
                                    No articles yet. Create your first draft.
                                  </Text>
                                </Table.Td>
                              </Table.Tr>
                            ) : null}
                          </Table.Tbody>
                        </Table>
                      </Table.ScrollContainer>
                    )}
                    <Group justify="space-between">
                      <Text c="dimmed" size="sm">
                        Page {page} of {totalPages}
                      </Text>
                      <Group>
                        <Button
                          disabled={page <= 1}
                          onClick={() => {
                            setLoadingArticles(true);
                            startTransition(() =>
                              setPage((current) => current - 1),
                            );
                          }}
                          variant="default"
                        >
                          Previous
                        </Button>
                        <Button
                          disabled={page >= totalPages}
                          onClick={() => {
                            setLoadingArticles(true);
                            startTransition(() =>
                              setPage((current) => current + 1),
                            );
                          }}
                          variant="default"
                        >
                          Next
                        </Button>
                      </Group>
                    </Group>
                  </Stack>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, lg: 4 }}>
                <Stack>
                  <TaxonomyPanel
                    endpoint="/api/dashboard/categories"
                    items={categories}
                    onRefresh={refreshAll}
                    title="Categories"
                  />
                  <TaxonomyPanel
                    endpoint="/api/dashboard/tags"
                    items={tags}
                    onRefresh={refreshAll}
                    title="Tags"
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
