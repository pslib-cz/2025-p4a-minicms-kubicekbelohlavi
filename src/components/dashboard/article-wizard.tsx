"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Group,
  MultiSelect,
  Select,
  Stack,
  Stepper,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconArrowLeft, IconArrowRight, IconCheck, IconDeviceFloppy } from "@tabler/icons-react";
import { RichTextEditor } from "@/components/dashboard/rich-text-editor";
import {
  EMPTY_EDITOR_VALUE,
  type EditorValue,
  type TaxonomyItem,
} from "@/components/dashboard/dashboard-types";
import { formResolver } from "@/lib/validation/form-resolver";
import { articleSchema } from "@/lib/validation/article";

const STEP_LABELS = [
  "Základní údaje",
  "Obsah",
  "Kategorie a štítky",
  "Publikování",
];

export function ArticleWizard() {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [categories, setCategories] = useState<TaxonomyItem[]>([]);
  const [tags, setTags] = useState<TaxonomyItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const form = useForm<EditorValue>({
    initialValues: {
      ...EMPTY_EDITOR_VALUE,
    },
    validate: formResolver(articleSchema),
    validateInputOnBlur: true,
  });

  useEffect(() => {
    const load = async () => {
      const [catRes, tagRes] = await Promise.all([
        fetch("/api/dashboard/categories"),
        fetch("/api/dashboard/tags"),
      ]);
      const catData = (await catRes.json()) as { items: TaxonomyItem[] };
      const tagData = (await tagRes.json()) as { items: TaxonomyItem[] };
      if (catRes.ok) {
        setCategories(catData.items);
        if (catData.items.length > 0 && !form.values.categoryId) {
          form.setFieldValue("categoryId", catData.items[0].id);
        }
      }
      if (tagRes.ok) setTags(tagData.items);
    };
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateStep = (step: number): boolean => {
    let hasError = false;
    if (step === 0) {
      for (const field of ["title"] as const) {
        const result = form.validateField(field);
        if (result.hasError) hasError = true;
      }
    }
    if (step === 1) {
      const result = form.validateField("content");
      if (result.hasError) hasError = true;
    }
    if (step === 2) {
      const result = form.validateField("categoryId");
      if (result.hasError) hasError = true;
    }
    if (step === 3) {
      const result = form.validateField("publishDate");
      if (result.hasError) hasError = true;
    }
    return !hasError;
  };

  const nextStep = () => {
    if (validateStep(active)) {
      setActive((c) => Math.min(c + 1, 3));
    }
  };

  const prevStep = () => setActive((c) => Math.max(c - 1, 0));

  const handleSaveDraft = async () => {
    const titleResult = form.validateField("title");
    if (titleResult.hasError) {
      setActive(0);
      return;
    }

    setSaving(true);
    setSaveError(null);
    const values = { ...form.values, status: "DRAFT" as const };

    const res = await fetch("/api/dashboard/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = (await res.json()) as { error?: string; details?: { fieldErrors?: Record<string, string[]> } };
    setSaving(false);

    if (!res.ok) {
      const fieldErrors = data.details?.fieldErrors
        ? Object.values(data.details.fieldErrors).flat().filter(Boolean).join(" ")
        : "";
      setSaveError(fieldErrors || data.error || "Nepodařilo se uložit koncept.");
      return;
    }

    notifications.show({ color: "teal", message: "Koncept byl uložen." });
    router.push("/dashboard");
  };

  const handlePublish = async () => {
    const validation = form.validate();
    if (validation.hasErrors) {
      const errorFields = Object.keys(validation.errors);
      if (errorFields.some((f) => f === "title" || f === "slug" || f === "coverImage")) setActive(0);
      else if (errorFields.some((f) => f === "content" || f === "excerpt")) setActive(1);
      else if (errorFields.some((f) => f === "categoryId" || f === "tagIds")) setActive(2);
      else setActive(3);
      return;
    }

    setSaving(true);
    setSaveError(null);
    const values = { ...form.values, status: "PUBLISHED" as const };

    const res = await fetch("/api/dashboard/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = (await res.json()) as { error?: string; details?: { fieldErrors?: Record<string, string[]> } };
    setSaving(false);

    if (!res.ok) {
      const fieldErrors = data.details?.fieldErrors
        ? Object.values(data.details.fieldErrors).flat().filter(Boolean).join(" ")
        : "";
      setSaveError(fieldErrors || data.error || "Nepodařilo se publikovat článek.");
      return;
    }

    notifications.show({ color: "teal", message: "Článek byl publikován." });
    router.push("/dashboard");
  };

  return (
    <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
      <Stack gap="xl">
        <Group justify="space-between">
          <div>
            <Text className="dashboard-bar-title" fw={700}>Nový článek</Text>
            <Text c="dimmed" size="sm">Krok {active + 1} ze 4 — {STEP_LABELS[active]}</Text>
          </div>
          <Group>
            <Button
              leftSection={<IconDeviceFloppy size={16} />}
              loading={saving}
              onClick={() => void handleSaveDraft()}
              variant="default"
            >
              Uložit koncept
            </Button>
            <Button onClick={() => router.push("/dashboard")} variant="subtle">
              Zrušit
            </Button>
          </Group>
        </Group>

        {saveError ? <Alert color="red">{saveError}</Alert> : null}

        <Stepper
          active={active}
          onStepClick={setActive}
          size="sm"
        >
          {/* Step 0: Basic info */}
          <Stepper.Step label="Základní údaje" description="Titulek a obrázek">
            <Stack gap="md" mt="lg">
              <TextInput
                label="Titulek"
                placeholder="Zadejte titulek článku"
                withAsterisk
                {...form.getInputProps("title")}
              />
              <TextInput
                label="Slug"
                placeholder="Vygeneruje se automaticky, pokud necháte prázdné"
                {...form.getInputProps("slug")}
              />
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
            </Stack>
          </Stepper.Step>

          {/* Step 1: Content */}
          <Stepper.Step label="Obsah" description="Text a perex">
            <Stack gap="md" mt="lg">
              <Textarea
                autosize
                label="Perex"
                minRows={3}
                placeholder="Krátké shrnutí pro náhled a metadata"
                {...form.getInputProps("excerpt")}
              />
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
            </Stack>
          </Stepper.Step>

          {/* Step 2: Taxonomy */}
          <Stepper.Step label="Kategorie a štítky" description="Organizace">
            <Stack gap="md" mt="lg">
              {!categories.length ? (
                <Alert color="yellow">
                  Nejdříve vytvořte alespoň jednu kategorii v přehledu.
                </Alert>
              ) : null}
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
            </Stack>
          </Stepper.Step>

          {/* Step 3: Publish */}
          <Stepper.Step label="Publikování" description="Datum a stav">
            <Stack gap="md" mt="lg">
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

              {/* Review summary */}
              <div style={{
                padding: "1rem",
                border: "2px solid var(--sv-blue)",
                borderRadius: 8,
                background: "rgba(27, 58, 140, 0.08)",
              }}>
                <Text fw={800} mb="sm" size="sm" tt="uppercase">Shrnutí článku</Text>
                <Stack gap={4}>
                  <Text size="sm"><strong>Titulek:</strong> {form.values.title || "—"}</Text>
                  <Text size="sm"><strong>Perex:</strong> {form.values.excerpt || "—"}</Text>
                  <Text size="sm">
                    <strong>Kategorie:</strong>{" "}
                    {categories.find((c) => c.id === form.values.categoryId)?.name || "—"}
                  </Text>
                  <Text size="sm">
                    <strong>Štítky:</strong>{" "}
                    {form.values.tagIds.length
                      ? tags.filter((t) => form.values.tagIds.includes(t.id)).map((t) => t.name).join(", ")
                      : "—"}
                  </Text>
                  <Text size="sm"><strong>Obrázek:</strong> {form.values.coverImage ? "Ano" : "Ne"}</Text>
                </Stack>
              </div>
            </Stack>
          </Stepper.Step>
        </Stepper>

        {/* Navigation */}
        <Group justify="space-between">
          <Button
            disabled={active === 0}
            leftSection={<IconArrowLeft size={16} />}
            onClick={prevStep}
            variant="default"
          >
            Zpět
          </Button>
          {active < 3 ? (
            <Button
              onClick={nextStep}
              rightSection={<IconArrowRight size={16} />}
            >
              Další
            </Button>
          ) : (
            <Button
              leftSection={<IconCheck size={16} />}
              loading={saving}
              onClick={() => void handlePublish()}
            >
              Publikovat článek
            </Button>
          )}
        </Group>
      </Stack>
    </div>
  );
}
