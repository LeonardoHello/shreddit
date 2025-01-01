import { type Editor } from "@tiptap/react";
import { Bold, Code, Italic, Strikethrough } from "lucide-react";

import { cn } from "@/utils/cn";

export default function RTEMarkButtons({ editor }: { editor: Editor }) {
  const isActive = (name: string, attributes?: object | undefined) =>
    editor.isActive(name, attributes) ? "#d4d4d8" : "#71717a";

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={cn(
          "p-1 transition-colors hover:rounded hover:bg-zinc-700/70",
          {
            "pointer-events-none opacity-30": !editor
              .can()
              .chain()
              .focus()
              .toggleBold()
              .run(),
          },
        )}
        title={"Bold"}
      >
        <Bold color={isActive("bold")} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={cn(
          "p-1 transition-colors hover:rounded hover:bg-zinc-700/70",
          {
            "pointer-events-none opacity-30": !editor
              .can()
              .chain()
              .focus()
              .toggleItalic()
              .run(),
          },
        )}
        title={"Italic"}
      >
        <Italic color={isActive("italic")} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={cn(
          "p-1 transition-colors hover:rounded hover:bg-zinc-700/70",
          {
            "pointer-events-none opacity-30": !editor
              .can()
              .chain()
              .focus()
              .toggleStrike()
              .run(),
          },
        )}
        title={"Strike"}
      >
        <Strikethrough color={isActive("strike")} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={cn(
          "p-1 transition-colors hover:rounded hover:bg-zinc-700/70",
          {
            "pointer-events-none opacity-30": !editor
              .can()
              .chain()
              .focus()
              .toggleCode()
              .run(),
          },
        )}
        title={"Code"}
      >
        <Code color={isActive("code")} />
      </button>
    </div>
  );
}
