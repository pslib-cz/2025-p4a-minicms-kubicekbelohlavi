import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Loader,
  Stack,
  Text,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { formatPanelNumber } from "@/lib/magazine";
import type { DashboardArticle } from "@/components/dashboard/dashboard-types";

type DashboardArticlesPanelProps = {
  articles: DashboardArticle[];
  loading: boolean;
  onCreate: () => void;
  onDelete: (article: DashboardArticle) => void;
  onEdit: (article: DashboardArticle) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onToggleStatus: (article: DashboardArticle) => void;
  page: number;
  pageSize: number;
  totalArticles: number;
  totalPages: number;
};

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("cs-CZ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function DashboardArticlesPanel({
  articles,
  loading,
  onCreate,
  onDelete,
  onEdit,
  onNextPage,
  onPreviousPage,
  onToggleStatus,
  page,
  pageSize,
  totalArticles,
  totalPages,
}: DashboardArticlesPanelProps) {
  return (
    <Card className="dashboard-panel-card" p="lg" radius="lg" shadow="sm" withBorder>
      <Stack>
        <Group justify="space-between">
          <div>
            <Text fw={700} size="lg">
              Přehled článků
            </Text>
            <Text c="dimmed" size="sm">
              {totalArticles} článků — kliknutím na kartu otevřete editor.
            </Text>
          </div>
        </Group>
        {loading ? (
          <Group justify="center" py="xl">
            <Loader />
          </Group>
        ) : articles.length ? (
          <div className="dashboard-story-grid">
            {articles.map((article, index) => {
              const panelNumber = formatPanelNumber((page - 1) * pageSize + index);

              return (
                <article
                  className="dashboard-story-card"
                  key={article.id}
                  onClick={() => onEdit(article)}
                  role="button"
                  style={{ cursor: "pointer" }}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onEdit(article);
                    }
                  }}
                >
                  <div
                    className="dashboard-story-cover"
                    style={
                      article.coverImage
                        ? {
                            backgroundImage: `linear-gradient(135deg, rgba(10, 10, 18, 0.18), rgba(10, 10, 18, 0.62)), url(${article.coverImage})`,
                          }
                        : undefined
                    }
                  >
                    <span className="dashboard-story-number">{panelNumber}</span>
                    <Badge
                      color={article.status === "PUBLISHED" ? "heroBlue" : "heroInk"}
                      variant="filled"
                    >
                      {article.status === "PUBLISHED" ? "Publikováno" : "Koncept"}
                    </Badge>
                  </div>
                  <div className="dashboard-story-body">
                    <Group className="dashboard-story-topline" gap="xs">
                      <Badge color="heroYellow" variant="filled">
                        {article.category.name}
                      </Badge>
                      <Text c="dimmed" size="sm">
                        {formatUpdatedAt(article.updatedAt)}
                      </Text>
                    </Group>
                    <div>
                      <Text className="dashboard-story-title" fw={700}>
                        {article.title}
                      </Text>
                      <Text c="dimmed" size="sm">
                        {article.slug}
                      </Text>
                    </div>
                    <Text className="dashboard-story-excerpt" lineClamp={2} size="sm">
                      {article.excerpt}
                    </Text>
                    <Group className="dashboard-story-tags" gap="xs">
                      {article.tags.map((tag) => (
                        <Badge color="heroInk" key={tag.id} variant="light">
                          {tag.name}
                        </Badge>
                      ))}
                    </Group>
                    <Group className="dashboard-story-actions" gap="xs" onClick={(e) => e.stopPropagation()}>
                      <Button
                        onClick={() => onToggleStatus(article)}
                        size="xs"
                        variant="light"
                      >
                        {article.status === "PUBLISHED"
                          ? "Stáhnout do konceptu"
                          : "Publikovat"}
                      </Button>
                      <ActionIcon
                        aria-label={`Smazat článek ${article.title}`}
                        color="red"
                        onClick={() => onDelete(article)}
                        variant="light"
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="dashboard-empty-state">
            <Text fw={700}>Zatím nemáte žádné články.</Text>
            <Text c="dimmed" size="sm">
              Vytvořte svůj první článek pomocí průvodce.
            </Text>
            <Button onClick={onCreate}>Vytvořit první článek</Button>
          </div>
        )}
        <Group justify="space-between">
          <Text c="dimmed" size="sm">
            Strana {page} z {totalPages}
          </Text>
          <Group>
            <Button disabled={page <= 1} onClick={onPreviousPage} variant="default">
              Předchozí
            </Button>
            <Button disabled={page >= totalPages} onClick={onNextPage} variant="default">
              Další
            </Button>
          </Group>
        </Group>
      </Stack>
    </Card>
  );
}
