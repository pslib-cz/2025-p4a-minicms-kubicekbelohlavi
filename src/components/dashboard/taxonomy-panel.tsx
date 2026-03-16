"use client";

import { useState } from "react";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";

type TaxonomyItem = {
  id: string;
  name: string;
  slug: string;
  _count?: {
    articles: number;
  };
};

type TaxonomyPanelProps = {
  endpoint: "/api/dashboard/categories" | "/api/dashboard/tags";
  items: TaxonomyItem[];
  onRefresh: () => Promise<void>;
  title: string;
};

export function TaxonomyPanel({
  endpoint,
  items,
  onRefresh,
  title,
}: TaxonomyPanelProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, slug }),
    });
    const data = (await response.json()) as { error?: string };

    setLoading(false);

    if (!response.ok) {
      notifications.show({
        color: "red",
        message: data.error ?? `Failed to create ${title.toLowerCase()}.`,
      });
      return;
    }

    setName("");
    setSlug("");
    await onRefresh();
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(`Delete this ${title.toLowerCase().slice(0, -1)}?`);

    if (!confirmed) {
      return;
    }

    const response = await fetch(`${endpoint}/${id}`, {
      method: "DELETE",
    });
    const data = (await response.json()) as { error?: string };

    if (!response.ok) {
      notifications.show({
        color: "red",
        message: data.error ?? `Failed to delete ${title.toLowerCase()}.`,
      });
      return;
    }

    await onRefresh();
  };

  return (
    <Card p="lg" radius="lg" shadow="sm" withBorder>
      <Stack>
        <div>
          <Text fw={700} size="lg">
            {title}
          </Text>
          <Text c="dimmed" size="sm">
            Create reusable taxonomy items for filtering and editorial structure.
          </Text>
        </div>
        <TextInput
          label={`${title.slice(0, -1)} name`}
          onChange={(event) => setName(event.currentTarget.value)}
          value={name}
        />
        <TextInput
          label="Slug"
          onChange={(event) => setSlug(event.currentTarget.value)}
          placeholder="Optional"
          value={slug}
        />
        <Button disabled={!name.trim()} loading={loading} onClick={handleCreate}>
          Add {title.slice(0, -1).toLowerCase()}
        </Button>
        <Stack gap="sm">
          {items.map((item) => (
            <Group justify="space-between" key={item.id} wrap="nowrap">
              <div>
                <Text fw={600}>{item.name}</Text>
                <Group gap="xs">
                  <Badge color="gray" variant="light">
                    {item.slug}
                  </Badge>
                  {typeof item._count?.articles === "number" ? (
                    <Badge color="blue" variant="light">
                      {item._count.articles} articles
                    </Badge>
                  ) : null}
                </Group>
              </div>
              <ActionIcon
                aria-label={`Delete ${item.name}`}
                color="red"
                onClick={() => void handleDelete(item.id)}
                variant="light"
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
