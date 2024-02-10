"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import {
  BubbleMenu,
  type Editor,
  EditorContent,
  FloatingMenu,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { toast } from "sonner";

import { useCommentContext } from "@/lib/context/CommentContextProvider";
import cn from "@/lib/utils/cn";
import { trpc } from "@/trpc/react";

import RTEButtons, { RTEButtonsInline, RTEButtonsNode } from "./RTEButtons";
import RTEcommentLoading from "./RTECommentLoading";

const extensions = [
  StarterKit,
  CharacterCount.configure({ limit: 255 }),
  Placeholder.configure({
    placeholder: "What are your thoughts?",
  }),
];

export default function RTECommentReply() {
  const { reply } = useCommentContext();

  return reply && <RTECommentReplyContent />;
}

function RTECommentReplyContent() {
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
    return <RTEcommentLoading />;
  }

  return (
    <div className="ml-3 border-l-2 border-zinc-700/70 pl-6">
      <div
        className={cn("rounded border border-zinc-700/70", {
          "border-zinc-300": editor.isFocused,
        })}
      >
        <BubbleMenu
          editor={editor}
          className="rounded-md border border-zinc-700/70 bg-zinc-900 p-1 lg:hidden"
        >
          <RTEButtonsInline editor={editor} />
        </BubbleMenu>
        <FloatingMenu
          editor={editor}
          className="rounded-md border border-zinc-700/70 bg-zinc-900 p-1 lg:hidden"
        >
          <RTEButtonsNode editor={editor} />
        </FloatingMenu>
        <EditorContent editor={editor} />
        <RTECommentReplyMenu editor={editor} />
      </div>
    </div>
  );
}

function RTECommentReplyMenu({ editor }: { editor: Editor }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { comment, setReply } = useCommentContext();

  if (!editor) {
    return <RTEcommentLoading />;
  }

  const createComment = trpc.createComment.useMutation({
    onMutate: () => {
      editor.setEditable(false);
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      setReply(false);

      toast.success("Reply successfully posted.");
    },
    onError: (error) => {
      editor.setEditable(true);
      toast.error(error.message);
    },
  });

  const isMutating = isPending || createComment.isLoading;

  const isEmpty = editor.state.doc.textContent.trim().length === 0;

  return (
    <div className="flex h-10 flex-wrap gap-2 rounded-b bg-zinc-800 p-1.5">
      <RTEButtons editor={editor} />
      <div className="ml-auto flex gap-2">
        <button
          className="rounded-full px-4 text-xs font-bold tracking-wide text-zinc-300 transition-colors hover:bg-zinc-700/50"
          onClick={() => setReply(false)}
        >
          Cancel
        </button>

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
              postId: comment.postId,
              parentCommentId: comment.id,
              text: editor.getHTML(),
            });
          }}
        >
          Reply
        </button>
      </div>
    </div>
  );
}
