"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Group,
  Loader,
  MultiSelect,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { RichTextEditor } from "@/components/dashboard/rich-text-editor";
import {
  toEditorValue,
  type DashboardArticle,
  type EditorValue,
  type TaxonomyItem,
} from "@/components/dashboard/dashboard-types";
import { formResolver } from "@/lib/validation/form-resolver";
import { articleSchema } from "@/lib/validation/article";

type ArticleEditScreenProps = {
  articleId: string;
};

export function ArticleEditScreen({ articleId }: ArticleEditScreenProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<TaxonomyItem[]>([]);
  const [tags, setTags] = useState<TaxonomyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const form = useForm<EditorValue>({
    initialValues: toEditorValue(),
    validate: formResolver(articleSchema),
    validateInputOnBlur: true,
  });

  useEffect(() => {
    let active = true;

    const load = async () => {
      const [articleRes, catRes, tagRes] = await Promise.all([
        fetch(`/api/dashboard/articles/${articleId}`),
        fetch("/api/dashboard/categories"),
        fetch("/api/dashboard/tags"),
      ]);

      if (!active) return;

      if (!articleRes.ok) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const articleData = (await articleRes.json()) as { item: DashboardArticle };
      const catData = (await catRes.json()) as { items: TaxonomyItem[] };
      const tagData = (await tagRes.json()) as { items: TaxonomyItem[] };

      if (catRes.ok) setCategories(catData.items);
      if (tagRes.ok) setTags(tagData.items);

      const editorValue = toEditorValue(articleData.item);
      form.setInitialValues(editorValue);
      form.setValues(editorValue);
      form.resetDirty(editorValue);
      setLoading(false);
    };

    void load();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  const handleSave = async () => {
    const validation = form.validate();
    if (validation.hasErrors) return;

    setSaving(true);
    setSaveError(null);

    const res = await fetch(`/api/dashboard/articles/${articleId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form.values),
    });
    const data = (await res.json()) as { error?: string; details?: { fieldErrors?: Record<string, string[]> } };
    setSaving(false);

    if (!res.ok) {
      const fieldErrors = data.details?.fieldErrors
        ? Object.values(data.details.fieldErrors).flat().filter(Boolean).join(" ")
        : "";
      setSaveError(fieldErrors || data.error || "Nepodařilo se uložit změny.");
      return;
    }

    notifications.show({ color: "teal", message: "Článek byl uložen." });
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: "4rem", textAlign: "center" }}>
        <Loader size="lg" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="container" style={{ paddingTop: "2rem" }}>
        <Stack>
          <Alert color="red">Článek nebyl nalezen nebo k němu nemáte přístup.</Alert>
          <Button onClick={() => router.push("/dashboard")} variant="default">
            Zpět na přehled
          </Button>
        </Stack>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
      <Stack gap="lg">
        <Group justify="space-between">
          <div>
            <Text className="dashboard-bar-title" fw={700}>Upravit článek</Text>
            <Text c="dimmed" size="sm">{form.values.title || "Bez názvu"}</Text>
          </div>
          <Group>
            <Button
              leftSection={<IconDeviceFloppy size={16} />}
              loading={saving}
              onClick={() => void handleSave()}
            >
              Uložit změny
            </Button>
            <Button
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => router.push("/dashboard")}
              variant="default"
            >
              Zpět
            </Button>
          </Group>
        </Group>

        {saveError ? <Alert color="red">{saveError}</Alert> : null}

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
        }}>
          <TextInput
            label="Titulek"
            placeholder="Zadejte titulek článku"
            withAsterisk
            {...form.getInputProps("title")}
          />
          <TextInput
            label="Slug"
            placeholder="Vygeneruje se automaticky"
            {...form.getInputProps("slug")}
          />
        </div>

        <TextInput
          label="URL titulního obrázku"
          placeholder="https://images.unsplash.com/..."
          {...form.getInputProps("coverImage")}
        />

        {form.values.coverImage ? (
          <div
            style={{
              width: "100%",
              height: 200,
              borderRadius: 8,
              border: "2px solid var(--sv-blue)",
              backgroundImage: `url(${form.values.coverImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ) : null}

        <Textarea
          autosize
          label="Perex"
          minRows={3}
          placeholder="Krátké shrnutí pro náhled a metadata"
          {...form.getInputProps("excerpt")}
        />

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
        }}>
          <Select
            allowDeselect={false}
            data={categories.map((c) => ({ label: c.name, value: c.id }))}
            label="Kategorie"
            placeholder="Vyberte kategorii"
            searchable
            withAsterisk
            {...form.getInputProps("categoryId")}
          />
          <MultiSelect
            data={tags.map((t) => ({ label: t.name, value: t.id }))}
            label="Štítky"
            placeholder="Vyberte štítky"
            searchable
            {...form.getInputProps("tagIds")}
          />
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
        }}>
          <TextInput
            label="Datum vydání"
            type="datetime-local"
            withAsterisk
            {...form.getInputProps("publishDate")}
          />
          <Select
            allowDeselect={false}
            data={[
              { label: "Koncept", value: "DRAFT" },
              { label: "Publikováno", value: "PUBLISHED" },
            ]}
            label="Stav"
            {...form.getInputProps("status")}
          />
        </div>

        <div>
          <Text fw={700} mb={4} size="sm">
            Obsah článku <span style={{ color: "var(--sv-red)" }}>*</span>
          </Text>
          <RichTextEditor
            onChange={(v) => form.setFieldValue("content", v)}
            value={form.values.content}
          />
          {form.errors.content ? (
            <p className="editor-error">{form.errors.content}</p>
          ) : null}
        </div>

        <Group justify="flex-end">
          <Button
            leftSection={<IconDeviceFloppy size={16} />}
            loading={saving}
            onClick={() => void handleSave()}
          >
            Uložit změny
          </Button>
        </Group>
      </Stack>
    </div>
  );
}
