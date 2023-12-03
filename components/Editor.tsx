import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import cn from "@/lib/utils/cn";

import EditorMenu from "./EditorMenu";

export default function Editor() {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: " prose    prose-sm focus:outline-none prose-invert  prose-zinc",
      },
    },
    extensions: [
      StarterKit,
      Image.configure({ inline: true }),
      Placeholder.configure({
        placeholder: "Text (optional)",
      }),
    ],
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
