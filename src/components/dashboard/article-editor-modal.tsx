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
import { zodResolver } from "mantine-form-zod-resolver";
import { RichTextEditor } from "@/components/dashboard/rich-text-editor";
import { articleSchema } from "@/lib/validation/article";

type ArticleValue = {
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

type TaxonomyOption = {
  id: string;
  name: string;
  slug: string;
};

type ArticleEditorModalProps = {
  categories: TaxonomyOption[];
  error: string | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (values: ArticleValue) => void;
  opened: boolean;
  tags: TaxonomyOption[];
  value: ArticleValue;
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
  const form = useForm<ArticleValue>({
    initialValues: value,
    validate: zodResolver(articleSchema),
  });

  useEffect(() => {
    form.setValues(value);
    form.resetDirty(value);
  }, [form, value]);

  const handleSubmit = form.onSubmit((values) => onSubmit(values));

  return (
    <Modal
      centered
      onClose={onClose}
      opened={opened}
      size="xl"
      title={value.id ? "Edit article" : "Create article"}
    >
      <form onSubmit={handleSubmit}>
        <Stack>
          {error ? <Alert color="red">{error}</Alert> : null}
          {!categories.length ? (
            <Alert color="yellow">
              Create at least one category before saving an article.
            </Alert>
          ) : null}
          <TextInput
            label="Title"
            placeholder="A precise, editorial title"
            {...form.getInputProps("title")}
          />
          <Group grow>
            <TextInput
              label="Slug"
              placeholder="auto-generated-if-empty"
              {...form.getInputProps("slug")}
            />
            <TextInput
              label="Cover image URL"
              placeholder="https://images.unsplash.com/..."
              {...form.getInputProps("coverImage")}
            />
          </Group>
          <Textarea
            autosize
            label="Excerpt"
            minRows={3}
            placeholder="A concise summary for cards and metadata"
            {...form.getInputProps("excerpt")}
          />
          <Group grow align="flex-start">
            <Select
              allowDeselect={false}
              data={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
              label="Category"
              placeholder="Choose category"
              searchable
              {...form.getInputProps("categoryId")}
            />
            <MultiSelect
              data={tags.map((tag) => ({
                label: tag.name,
                value: tag.id,
              }))}
              label="Tags"
              placeholder="Select tags"
              searchable
              {...form.getInputProps("tagIds")}
            />
          </Group>
          <Group grow>
            <TextInput
              label="Publish date"
              type="datetime-local"
              {...form.getInputProps("publishDate")}
            />
            <Select
              allowDeselect={false}
              data={[
                { label: "Draft", value: "DRAFT" },
                { label: "Published", value: "PUBLISHED" },
              ]}
              label="Status"
              {...form.getInputProps("status")}
            />
          </Group>
          <div>
            <label className="editor-label" htmlFor="article-content">
              Content
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
              Cancel
            </Button>
            <Button disabled={!categories.length} loading={loading} type="submit">
              {value.id ? "Save changes" : "Create article"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
