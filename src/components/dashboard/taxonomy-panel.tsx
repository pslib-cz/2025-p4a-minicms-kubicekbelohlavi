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
import type { TaxonomyItem } from "@/components/dashboard/dashboard-types";

type TaxonomyPanelProps = {
  endpoint: "/api/dashboard/categories" | "/api/dashboard/tags";
  itemLabel: "rubrika" | "štítek";
  items: TaxonomyItem[];
  onRefresh: () => Promise<void>;
  title: string;
};

function getObjectForm(itemLabel: "rubrika" | "štítek") {
  return itemLabel === "rubrika" ? "rubriku" : "štítek";
}

function getDeletePrompt(itemLabel: "rubrika" | "štítek") {
  return itemLabel === "rubrika"
    ? "Opravdu smazat tuto rubriku?"
    : "Opravdu smazat tento štítek?";
}

function getAddedMessage(itemLabel: "rubrika" | "štítek") {
  return itemLabel === "rubrika"
    ? "Rubrika byla přidána."
    : "Štítek byl přidán.";
}

function getDeletedMessage(itemLabel: "rubrika" | "štítek") {
  return itemLabel === "rubrika"
    ? "Rubrika byla smazána."
    : "Štítek byl smazán.";
}

export function TaxonomyPanel({
  endpoint,
  itemLabel,
  items,
  onRefresh,
  title,
}: TaxonomyPanelProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const objectForm = getObjectForm(itemLabel);

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
        message: data.error ?? `Nepodařilo se vytvořit ${objectForm}.`,
      });
      return;
    }

    setName("");
    setSlug("");
    notifications.show({
      color: "teal",
      message: getAddedMessage(itemLabel),
    });
    await onRefresh();
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(getDeletePrompt(itemLabel));

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
        message: data.error ?? `Nepodařilo se smazat ${objectForm}.`,
      });
      return;
    }

    notifications.show({
      color: "teal",
      message: getDeletedMessage(itemLabel),
    });
    await onRefresh();
  };

  return (
    <Card className="taxonomy-panel-card" p="lg" radius="lg" shadow="sm" withBorder>
      <Stack>
        <div>
          <Text fw={700} size="lg">
            {title}
          </Text>
          <Text c="dimmed" size="sm">
            Skládejte si vlastní redakční navigaci, kterou pak použijete ve filtrech
            i v editoru.
          </Text>
        </div>
        <TextInput
          label={`Název ${itemLabel}`}
          onChange={(event) => setName(event.currentTarget.value)}
          value={name}
        />
        <TextInput
          label="Slug"
          onChange={(event) => setSlug(event.currentTarget.value)}
          placeholder="Volitelné"
          value={slug}
        />
        <Button disabled={!name.trim()} loading={loading} onClick={handleCreate}>
          Přidat {objectForm}
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
                    <Badge color="heroBlue" variant="light">
                      {item._count.articles} článků
                    </Badge>
                  ) : null}
                </Group>
              </div>
              <ActionIcon
                aria-label={`Smazat ${item.name}`}
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
