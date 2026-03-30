"use client";

import { useEffect } from "react";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import { useEditor } from "@tiptap/react";
import { RichTextEditor as MantineRichTextEditor } from "@mantine/tiptap";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function RichTextEditor({ onChange, value }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    if (editor.getHTML() !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  return (
    <MantineRichTextEditor editor={editor}>
      <MantineRichTextEditor.Toolbar sticky stickyOffset={80}>
        <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.Bold />
          <MantineRichTextEditor.Italic />
          <MantineRichTextEditor.Underline />
          <MantineRichTextEditor.Strikethrough />
        </MantineRichTextEditor.ControlsGroup>
        <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.H2 />
          <MantineRichTextEditor.H3 />
          <MantineRichTextEditor.H4 />
          <MantineRichTextEditor.Blockquote />
        </MantineRichTextEditor.ControlsGroup>
        <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.BulletList />
          <MantineRichTextEditor.OrderedList />
          <MantineRichTextEditor.Link />
          <MantineRichTextEditor.Unlink />
        </MantineRichTextEditor.ControlsGroup>
        <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.ClearFormatting />
        </MantineRichTextEditor.ControlsGroup>
      </MantineRichTextEditor.Toolbar>
      <MantineRichTextEditor.Content />
    </MantineRichTextEditor>
  );
}
