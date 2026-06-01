'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExt from '@tiptap/extension-image';
import { useState } from 'react';

interface Props {
  name: string;
  defaultValue?: string;
}

export function TiptapEditor({ name, defaultValue = '' }: Props) {
  const [html, setHtml] = useState(defaultValue);

  const editor = useEditor({
    extensions: [StarterKit, ImageExt],
    content: defaultValue,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'prose prose-slate max-w-none min-h-[280px] focus:outline-none rounded-b-md border border-t-0 border-slate-300 bg-white px-4 py-3',
      },
    },
    onUpdate({ editor }) {
      setHtml(editor.getHTML());
    },
  });

  async function insertImage() {
    if (!editor) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const fd = new FormData();
      fd.append('file', file);
      fd.append('bucket', 'blog');
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (json.success && json.url) {
        editor.chain().focus().setImage({ src: json.url }).run();
      } else {
        alert(json.error || 'Upload failed');
      }
    };
    input.click();
  }

  if (!editor) {
    return (
      <div className="rounded-md border border-slate-300 px-4 py-3 text-sm text-slate-500">
        Loading editor…
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1 rounded-t-md border border-slate-300 bg-slate-50 px-2 py-1.5 text-xs">
        <ToolButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
          B
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
          I
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')}>
          S
        </ToolButton>
        <Divider />
        <ToolButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
        >
          H2
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
        >
          H3
        </ToolButton>
        <Divider />
        <ToolButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>
          • List
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>
          1. List
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')}>
          “”
        </ToolButton>
        <Divider />
        <ToolButton onClick={insertImage}>Image</ToolButton>
        <ToolButton onClick={() => editor.chain().focus().setHorizontalRule().run()}>— HR</ToolButton>
        <Divider />
        <ToolButton onClick={() => editor.chain().focus().undo().run()}>↶</ToolButton>
        <ToolButton onClick={() => editor.chain().focus().redo().run()}>↷</ToolButton>
      </div>
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={html} />
    </div>
  );
}

function ToolButton({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-2 py-1 font-semibold transition ${
        active ? 'bg-[var(--color-primary)] text-white' : 'text-slate-700 hover:bg-slate-200'
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-4 w-px bg-slate-300" />;
}
