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
import { IconEdit, IconTrash } from "@tabler/icons-react";
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
              Redakční přehled
            </Text>
            <Text c="dimmed" size="sm">
              {totalArticles} článků, rychlé publikování a přímý vstup do editoru.
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
                <article className="dashboard-story-card" key={article.id}>
                  <div
                    className="dashboard-story-cover"
                    style={
                      article.coverImage
                        ? {
                            backgroundImage: `linear-gradient(135deg, rgba(16, 21, 32, 0.18), rgba(16, 21, 32, 0.62)), url(${article.coverImage})`,
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
                        Aktualizováno {formatUpdatedAt(article.updatedAt)}
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
                    <Text className="dashboard-story-excerpt" size="sm">
                      {article.excerpt}
                    </Text>
                    <Group className="dashboard-story-tags" gap="xs">
                      {article.tags.map((tag) => (
                        <Badge color="heroInk" key={tag.id} variant="light">
                          {tag.name}
                        </Badge>
                      ))}
                    </Group>
                    <Group className="dashboard-story-actions" gap="xs">
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
                        aria-label={`Upravit článek ${article.title}`}
                        onClick={() => onEdit(article)}
                        variant="light"
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
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
            <Text fw={700}>V přehledu zatím není žádný příběh.</Text>
            <Text c="dimmed" size="sm">
              Rozjeďte první koncept a postavte z něj další titulku.
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
