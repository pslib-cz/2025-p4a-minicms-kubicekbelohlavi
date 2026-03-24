"use client";

import { useEffect } from "react";
import {
  Alert,
  Button,
  Group,
  Modal,
  MultiSelect,
  Select,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { RichTextEditor } from "@/components/dashboard/rich-text-editor";
import type {
  EditorValue,
  TaxonomyItem,
} from "@/components/dashboard/dashboard-types";
import { formResolver } from "@/lib/validation/form-resolver";
import { articleSchema } from "@/lib/validation/article";

type ArticleEditorModalProps = {
  categories: TaxonomyItem[];
  error: string | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (values: EditorValue) => void;
  opened: boolean;
  tags: TaxonomyItem[];
  value: EditorValue;
};

export function ArticleEditorModal({
  categories,
  error,
  loading,
  onClose,
  onSubmit,
  opened,
  tags,
  value,
}: ArticleEditorModalProps) {
  const form = useForm<EditorValue>({
    initialValues: value,
    validate: formResolver(articleSchema),
  });
  const { clearErrors, resetDirty, setInitialValues, setValues } = form;

  useEffect(() => {
    setInitialValues(value);
    setValues(value);
    resetDirty(value);
    clearErrors();
  }, [clearErrors, resetDirty, setInitialValues, setValues, value]);

  const handleSubmit = form.onSubmit((values) => onSubmit(values));

  return (
    <Modal
      centered
      onClose={onClose}
      opened={opened}
      size="xl"
      title={value.id ? "Upravit článek" : "Nový článek"}
    >
      <form onSubmit={handleSubmit}>
        <Stack>
          {error ? <Alert color="red">{error}</Alert> : null}
          {!categories.length ? (
            <Alert color="yellow">
              Před uložením článku nejdřív vytvořte alespoň jednu rubriku.
            </Alert>
          ) : null}
          <TextInput
            label="Titulek"
            placeholder="Úderný titul pro cover story"
            {...form.getInputProps("title")}
          />
          <Group grow>
            <TextInput
              label="Slug"
              placeholder="vygeneruje-se-pokud-nechate-prazdne"
              {...form.getInputProps("slug")}
            />
            <TextInput
              label="URL cover obrázku"
              placeholder="https://images.unsplash.com/..."
              {...form.getInputProps("coverImage")}
            />
          </Group>
          <Textarea
            autosize
            label="Perex"
            minRows={3}
            placeholder="Krátké shrnutí pro kartu, metadata a splash hero"
            {...form.getInputProps("excerpt")}
          />
          <Group align="flex-start" grow>
            <Select
              allowDeselect={false}
              data={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
              label="Rubrika"
              placeholder="Vyberte rubriku"
              searchable
              {...form.getInputProps("categoryId")}
            />
            <MultiSelect
              data={tags.map((tag) => ({
                label: tag.name,
                value: tag.id,
              }))}
              label="Štítky"
              placeholder="Vyberte štítky"
              searchable
              {...form.getInputProps("tagIds")}
            />
          </Group>
          <Group grow>
            <TextInput
              label="Datum vydání"
              type="datetime-local"
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
          </Group>
          <div>
            <label className="editor-label" htmlFor="article-content">
              Obsah
            </label>
            <RichTextEditor
              onChange={(nextValue) => form.setFieldValue("content", nextValue)}
              value={form.values.content}
            />
            {form.errors.content ? (
              <p className="editor-error">{form.errors.content}</p>
            ) : null}
          </div>
          <Group justify="flex-end">
            <Button onClick={onClose} type="button" variant="default">
              Zrušit
            </Button>
            <Button disabled={!categories.length} loading={loading} type="submit">
              {value.id ? "Uložit změny" : "Vytvořit článek"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
