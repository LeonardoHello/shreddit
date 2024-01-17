"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { toast } from "sonner";

import type { Post } from "@/lib/db/schema";
import cn from "@/lib/utils/cn";
import { trpc } from "@/trpc/react";

import RTEButtons from "./RTEButtons";

const extensions = [
  StarterKit,
  CharacterCount.configure({ limit: 255 }),
  Placeholder.configure({
    placeholder: "What are your thoughts?",
  }),
];

export default function CommentRTE({ postId }: { postId: Post["id"] }) {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class:
          "prose prose-sm prose-zinc prose-invert min-h-[8rem] max-w-none px-5 py-2 focus:outline-none",
      },
    },
    extensions,
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
      <EditorContent editor={editor} />
      <CommentRTEMenu editor={editor} postId={postId} />
    </div>
  );
}

function CommentRTEMenu({
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

  const isMutating = isPending || createComment.isLoading;

  const isEmpty = editor.state.doc.textContent.trim().length === 0;

  return (
    <div className="flex flex-wrap gap-2 rounded-b bg-zinc-800 px-1.5 py-1">
      <RTEButtons editor={editor} />
      <div className="ml-auto flex gap-2">
        <button
          className="rounded-full px-4 text-xs font-bold tracking-wide text-zinc-300 transition-colors hover:bg-zinc-700/50"
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
    </div>
  );
}
