"use client";

import { useEffect, useCallback } from "react";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Youtube from "@tiptap/extension-youtube";
import CharacterCount from "@tiptap/extension-character-count";
import Typography from "@tiptap/extension-typography";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { useEditor } from "@tiptap/react";
import { RichTextEditor as MantineRichTextEditor } from "@mantine/tiptap";
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconStrikethrough,
  IconHighlight,
  IconCode,
  IconH1,
  IconH2,
  IconH3,
  IconH4,
  IconBlockquote,
  IconSeparator,
  IconList,
  IconListNumbers,
  IconListCheck,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconAlignJustified,
  IconSuperscript,
  IconSubscript,
  IconLink,
  IconLinkOff,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconClearFormatting,
  IconSourceCode,
  IconPhoto,
  IconTable,
  IconTablePlus,
  IconTableMinus,
  IconColumnInsertRight,
  IconColumnRemove,
  IconRowInsertBottom,
  IconRowRemove,
  IconBrandYoutube,
  IconPalette,
  IconTypography,
} from "@tabler/icons-react";
import { ActionIcon, Group, Tooltip, Divider, Text } from "@mantine/core";
import type { Editor } from "@tiptap/react";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

function ToolbarButton({
  icon: Icon,
  label,
  onClick,
  active = false,
  disabled = false,
  color,
}: {
  icon: React.ComponentType<{ size?: number; stroke?: number }>;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  color?: string;
}) {
  return (
    <Tooltip label={label} position="top" withArrow openDelay={400}>
      <ActionIcon
        variant={active ? "filled" : "subtle"}
        size={32}
        onClick={onClick}
        disabled={disabled}
        className={`sv-editor-btn ${active ? "sv-editor-btn-active" : ""}`}
        style={color ? { color } : undefined}
      >
        <Icon size={16} stroke={1.8} />
      </ActionIcon>
    </Tooltip>
  );
}

function ToolbarSep() {
  return <Divider orientation="vertical" className="sv-editor-sep" />;
}

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return (
    <Group gap={2} className="sv-editor-group">
      {children}
    </Group>
  );
}

function ImageButton({ editor }: { editor: Editor }) {
  const addImage = useCallback(() => {
    const url = window.prompt("URL obrázku:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  return (
    <ToolbarButton icon={IconPhoto} label="Vložit obrázek" onClick={addImage} />
  );
}

function YoutubeButton({ editor }: { editor: Editor }) {
  const addVideo = useCallback(() => {
    const url = window.prompt("YouTube URL:");
    if (url) {
      editor.commands.setYoutubeVideo({ src: url, width: 640, height: 360 });
    }
  }, [editor]);

  return (
    <ToolbarButton
      icon={IconBrandYoutube}
      label="Vložit YouTube video"
      onClick={addVideo}
    />
  );
}

function ColorButtons({ editor }: { editor: Editor }) {
  const colors = [
    { color: "#e23636", label: "Spider Red" },
    { color: "#00c2cb", label: "Cyan" },
    { color: "#ff2d95", label: "Magenta" },
    { color: "#ffc863", label: "Yellow" },
    { color: "#ffffff", label: "White" },
  ];

  return (
    <>
      {colors.map((c) => (
        <Tooltip key={c.color} label={c.label} position="top" withArrow openDelay={300}>
          <ActionIcon
            size={20}
            variant="subtle"
            onClick={() => editor.chain().focus().setColor(c.color).run()}
            className="sv-color-dot"
            style={{ color: c.color }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: c.color,
                border: `2px solid ${editor.isActive("textStyle", { color: c.color }) ? "#fff" : "transparent"}`,
              }}
            />
          </ActionIcon>
        </Tooltip>
      ))}
      <Tooltip label="Reset barvy" position="top" withArrow openDelay={300}>
        <ActionIcon
          size={20}
          variant="subtle"
          onClick={() => editor.chain().focus().unsetColor().run()}
          className="sv-color-dot"
        >
          <IconPalette size={12} stroke={1.5} />
        </ActionIcon>
      </Tooltip>
    </>
  );
}

function EditorToolbar({ editor }: { editor: Editor }) {
  return (
    <div className="sv-editor-toolbar">
      <div className="sv-editor-toolbar-row">
        <ToolbarGroup>
          <ToolbarButton
            icon={IconBold}
            label="Tučné"
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
          />
          <ToolbarButton
            icon={IconItalic}
            label="Kurzíva"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
          />
          <ToolbarButton
            icon={IconUnderline}
            label="Podtržení"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
          />
          <ToolbarButton
            icon={IconStrikethrough}
            label="Přeškrtnutí"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
          />
          <ToolbarButton
            icon={IconHighlight}
            label="Zvýraznění"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            active={editor.isActive("highlight")}
          />
          <ToolbarButton
            icon={IconCode}
            label="Inline kód"
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive("code")}
          />
        </ToolbarGroup>

        <ToolbarSep />

        <ToolbarGroup>
          <ToolbarButton
            icon={IconH1}
            label="Nadpis 1"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive("heading", { level: 1 })}
          />
          <ToolbarButton
            icon={IconH2}
            label="Nadpis 2"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive("heading", { level: 2 })}
          />
          <ToolbarButton
            icon={IconH3}
            label="Nadpis 3"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive("heading", { level: 3 })}
          />
          <ToolbarButton
            icon={IconH4}
            label="Nadpis 4"
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            active={editor.isActive("heading", { level: 4 })}
          />
          <ToolbarButton
            icon={IconTypography}
            label="Odstavec"
            onClick={() => editor.chain().focus().setParagraph().run()}
            active={editor.isActive("paragraph")}
          />
        </ToolbarGroup>

        <ToolbarSep />

        <ToolbarGroup>
          <ToolbarButton
            icon={IconAlignLeft}
            label="Zarovnat vlevo"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            active={editor.isActive({ textAlign: "left" })}
          />
          <ToolbarButton
            icon={IconAlignCenter}
            label="Zarovnat na střed"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            active={editor.isActive({ textAlign: "center" })}
          />
          <ToolbarButton
            icon={IconAlignRight}
            label="Zarovnat vpravo"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            active={editor.isActive({ textAlign: "right" })}
          />
          <ToolbarButton
            icon={IconAlignJustified}
            label="Do bloku"
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            active={editor.isActive({ textAlign: "justify" })}
          />
        </ToolbarGroup>
      </div>

      <div className="sv-editor-toolbar-row">
        <ToolbarGroup>
          <ToolbarButton
            icon={IconBlockquote}
            label="Citace"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
          />
          <ToolbarButton
            icon={IconList}
            label="Odrážkový seznam"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
          />
          <ToolbarButton
            icon={IconListNumbers}
            label="Číslovaný seznam"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
          />
          <ToolbarButton
            icon={IconListCheck}
            label="Úkolový seznam"
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            active={editor.isActive("taskList")}
          />
          <ToolbarButton
            icon={IconSourceCode}
            label="Blok kódu"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive("codeBlock")}
          />
          <ToolbarButton
            icon={IconSeparator}
            label="Oddělovač"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          />
        </ToolbarGroup>

        <ToolbarSep />

        <ToolbarGroup>
          <ToolbarButton
            icon={IconSuperscript}
            label="Horní index"
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            active={editor.isActive("superscript")}
          />
          <ToolbarButton
            icon={IconSubscript}
            label="Dolní index"
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            active={editor.isActive("subscript")}
          />
          <ToolbarButton
            icon={IconLink}
            label="Odkaz"
            onClick={() => {
              const url = window.prompt("URL odkazu:");
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            active={editor.isActive("link")}
          />
          <ToolbarButton
            icon={IconLinkOff}
            label="Zrušit odkaz"
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={!editor.isActive("link")}
          />
        </ToolbarGroup>

        <ToolbarSep />

        <ToolbarGroup>
          <ImageButton editor={editor} />
          <YoutubeButton editor={editor} />
          <ToolbarButton
            icon={IconTable}
            label="Vložit tabulku"
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
          />
        </ToolbarGroup>

        <ToolbarSep />

        <ToolbarGroup>
          <ToolbarButton
            icon={IconArrowBackUp}
            label="Zpět"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          />
          <ToolbarButton
            icon={IconArrowForwardUp}
            label="Vpřed"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          />
          <ToolbarButton
            icon={IconClearFormatting}
            label="Vyčistit formátování"
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          />
        </ToolbarGroup>
      </div>

      {/* Color row */}
      <div className="sv-editor-toolbar-row sv-editor-color-row">
        <Group gap={4} align="center">
          <Text size="xs" className="sv-editor-color-label">
            Barva:
          </Text>
          <ColorButtons editor={editor} />
        </Group>

        {/* Table controls - show only when inside a table */}
        {editor.isActive("table") && (
          <>
            <ToolbarSep />
            <ToolbarGroup>
              <ToolbarButton
                icon={IconColumnInsertRight}
                label="Přidat sloupec"
                onClick={() => editor.chain().focus().addColumnAfter().run()}
              />
              <ToolbarButton
                icon={IconColumnRemove}
                label="Smazat sloupec"
                onClick={() => editor.chain().focus().deleteColumn().run()}
              />
              <ToolbarButton
                icon={IconRowInsertBottom}
                label="Přidat řádek"
                onClick={() => editor.chain().focus().addRowAfter().run()}
              />
              <ToolbarButton
                icon={IconRowRemove}
                label="Smazat řádek"
                onClick={() => editor.chain().focus().deleteRow().run()}
              />
              <ToolbarButton
                icon={IconTableMinus}
                label="Smazat tabulku"
                onClick={() => editor.chain().focus().deleteTable().run()}
              />
            </ToolbarGroup>
          </>
        )}

        {/* Character count */}
        <Text size="xs" className="sv-editor-char-count">
          {editor.storage.characterCount.characters()} znaků
        </Text>
      </div>
    </div>
  );
}

export function RichTextEditor({ onChange, value }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      Highlight.configure({ multicolor: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Superscript,
      Subscript,
      Placeholder.configure({ placeholder: "Začněte psát svůj příběh..." }),
      Image.configure({ inline: false, allowBase64: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      TaskList,
      TaskItem.configure({ nested: true }),
      Youtube.configure({ controls: true, nocookie: true }),
      CharacterCount,
      Typography,
      Color,
      TextStyle,
    ],
    content: value,
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div className="sv-editor-root">
      <EditorToolbar editor={editor} />

      <MantineRichTextEditor editor={editor}>
        <MantineRichTextEditor.Content />
      </MantineRichTextEditor>
    </div>
  );
}
