"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import {
  BubbleMenu,
  EditorContent,
  FloatingMenu,
  useEditor,
  type Editor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { toast } from "sonner";

import type { Post } from "@/db/schema";
import { trpc } from "@/trpc/client";
import cn from "@/utils/cn";
import RTEcommentLoading from "./RTECommentLoading";
import RTEMarkButtons from "./RTEMarkButtons";
import RTENodeButtons from "./RTENodeButtons";

const extensions = [
  StarterKit,
  CharacterCount.configure({ limit: 255 }),
  Placeholder.configure({
    placeholder: "What are your thoughts?",
  }),
];

export default function RTEComment({ postId }: { postId: Post["id"] }) {
  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm prose-zinc prose-invert min-h-[8rem] max-w-none px-5 py-2 focus:outline-none",
      },
    },
    extensions,
  });

  if (!editor) {
    return <RTEcommentLoading />;
  }

  return (
    <div
      className={cn("rounded border border-zinc-700/70", {
        "border-zinc-300": editor.isFocused,
      })}
    >
      <BubbleMenu
        editor={editor}
        className="rounded-md border border-zinc-700/70 bg-zinc-900 p-1 sm:hidden"
      >
        <RTEMarkButtons editor={editor} />
      </BubbleMenu>

      <FloatingMenu
        editor={editor}
        className="rounded-md border border-zinc-700/70 bg-zinc-900 p-1 sm:hidden"
      >
        <RTENodeButtons editor={editor} />
      </FloatingMenu>

      <div className="hidden flex-wrap gap-2 rounded-t bg-zinc-800 p-1 sm:flex">
        <RTEMarkButtons editor={editor} />
        <div className="h-4 w-px self-center bg-zinc-700/70" />
        <RTENodeButtons editor={editor} />
      </div>

      <EditorContent editor={editor} />

      <RTECommentActionButtons editor={editor} postId={postId} />
    </div>
  );
}

function RTECommentActionButtons({
  editor,
  postId,
}: {
  editor: Editor;
  postId: Post["id"];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const createComment = trpc.createComment.useMutation({
    onMutate: () => {
      editor.setEditable(false);
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      editor.commands.clearContent();

      toast.success("Comment successfully posted.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      editor.setEditable(true);
    },
  });

  const isMutating = isPending || createComment.isPending;

  const isEmpty = editor.state.doc.textContent.trim().length === 0;

  return (
    <div className="flex h-10 justify-end gap-2 rounded-t p-1.5">
      <button
        className="rounded-full bg-zinc-800 px-4 text-xs font-bold tracking-wide text-zinc-300 transition-colors hover:bg-zinc-700"
        onClick={() => editor.commands.clearContent()}
      >
        Clear
      </button>

      <button
        className={cn(
          "rounded-full bg-zinc-300 px-4 text-xs font-bold tracking-wide text-zinc-800 transition-opacity hover:opacity-80",
          {
            "cursor-not-allowed text-zinc-500": isEmpty || isMutating,
          },
        )}
        disabled={isEmpty || isMutating}
        onClick={() => {
          createComment.mutate({
            postId,
            parentCommentId: null,
            text: editor.getHTML(),
          });
        }}
      >
        Comment
      </button>
    </div>
  );
}
