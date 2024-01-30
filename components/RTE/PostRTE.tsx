"use client";

import { useCallback } from "react";

import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import type { Post } from "@/lib/db/schema";
import cn from "@/lib/utils/cn";

import RTEButtons from "./RTEButtons";

const extensions = [
  StarterKit,
  Image.configure({ inline: true }),
  Placeholder.configure({
    placeholder: "Text",
  }),
];

export default function PostRTE({
  handleTextChange,
}: {
  handleTextChange: (data: Post["text"]) => void;
}) {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class:
          "prose prose-sm prose-zinc prose-invert min-h-[8rem] max-w-none py-2 px-4 focus:outline-none",
      },
    },
    extensions,
    onUpdate: ({ editor }) => {
      if (editor.state.doc.textContent.trim().length === 0) {
        handleTextChange(null);
      } else {
        handleTextChange(editor.getHTML());
      }
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn("rounded border border-zinc-700/70", {
        "border-zinc-300": editor.isFocused,
      })}
    >
      <EditorMenu editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function EditorMenu({ editor }: { editor: Editor }) {
  return (
    <div className="flex flex-wrap gap-2 rounded-t bg-zinc-800 p-1.5">
      <RTEButtons editor={editor} />
      <div className="h-4 w-px self-center bg-zinc-700/70" />
      <button
        title="Image"
        className={cn(
          "p-0.5 transition-colors hover:rounded hover:bg-zinc-700/70",
          { "opacity-30": false },
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M2.9918 21C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918ZM20 15V5H4V19L14 9L20 15ZM20 17.8284L14 11.8284L6.82843 19H20V17.8284ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z"
            fill="#71717a"
          />
        </svg>
      </button>
    </div>
  );
}
