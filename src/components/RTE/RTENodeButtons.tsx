import { type Editor } from "@tiptap/react";
import {
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  SquareCode,
} from "lucide-react";

import { cn } from "@/utils/cn";

export default function RTENodeButtons({ editor }: { editor: Editor }) {
  const isActive = (name: string, attributes?: object | undefined) =>
    editor.isActive(name, attributes) ? "#d4d4d8" : "#71717a";

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        disabled={
          !editor.can().chain().focus().toggleHeading({ level: 1 }).run()
        }
        className={cn(
          "p-1 transition-colors hover:rounded hover:bg-zinc-700/70",
          {
            "pointer-events-none opacity-30": !editor
              .can()
              .chain()
              .focus()
              .toggleHeading({ level: 1 })
              .run(),
          },
        )}
        title={"Heading 1"}
      >
        <Heading1 color={isActive("heading", { level: 1 })} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        disabled={
          !editor.can().chain().focus().toggleHeading({ level: 2 }).run()
        }
        className={cn(
          "p-1 transition-colors hover:rounded hover:bg-zinc-700/70",
          {
            "pointer-events-none opacity-30": !editor
              .can()
              .chain()
              .focus()
              .toggleHeading({ level: 2 })
              .run(),
          },
        )}
        title={"Heading 2"}
      >
        <Heading2 color={isActive("heading", { level: 2 })} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
        className={cn(
          "p-1 transition-colors hover:rounded hover:bg-zinc-700/70",
          {
            "pointer-events-none opacity-30": !editor
              .can()
              .chain()
              .focus()
              .toggleBulletList()
              .run(),
          },
        )}
        title={"Bullet List"}
      >
        <List color={isActive("bulletList")} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={!editor.can().chain().focus().toggleOrderedList().run()}
        className={cn(
          "p-1 transition-colors hover:rounded hover:bg-zinc-700/70",
          {
            "pointer-events-none opacity-30": !editor
              .can()
              .chain()
              .focus()
              .toggleOrderedList()
              .run(),
          },
        )}
        title={"Ordered List"}
      >
        <ListOrdered color={isActive("orderedList")} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        disabled={!editor.can().chain().focus().toggleBlockquote().run()}
        className={cn(
          "p-1 transition-colors hover:rounded hover:bg-zinc-700/70",
          {
            "pointer-events-none opacity-30": !editor
              .can()
              .chain()
              .focus()
              .toggleBlockquote()
              .run(),
          },
        )}
        title={"Blockquote"}
      >
        <Quote color={isActive("blockquote")} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
        className={cn(
          "p-1 transition-colors hover:rounded hover:bg-zinc-700/70",
          {
            "pointer-events-none opacity-30": !editor
              .can()
              .chain()
              .focus()
              .toggleCodeBlock()
              .run(),
          },
        )}
        title={"Code Block"}
      >
        <SquareCode color={isActive("codeBlock")} />
      </button>
    </div>
  );
}
