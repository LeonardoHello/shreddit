"use client";

import { useEffect, useTransition } from "react";

import { useRouter } from "next/navigation";

import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { toast } from "sonner";

import { useCommentContext } from "@/lib/context/CommentContextProvider";
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

export default function CommentContentRTE() {
  const { comment, editable } = useCommentContext();

  const editor = useEditor({
    content: comment.text,
    extensions,
    editable: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm prose-zinc prose-invert max-w-none focus:outline-none",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn({
        "rounded border border-zinc-700/70": editable,
        "border-zinc-300": editable && editor.isFocused,
      })}
    >
      <EditorContent editor={editor} />
      {editable && <CommentEditRTEMenu editor={editor} />}
    </div>
  );
}

function CommentEditRTEMenu({ editor }: { editor: Editor }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { comment, setEditable } = useCommentContext();

  useEffect(() => {
    editor.setEditable(true);
    editor.setOptions({
      editorProps: {
        attributes: {
          class:
            "prose prose-sm prose-zinc prose-invert min-h-[8rem] max-w-none px-5 py-2 focus:outline-none",
        },
      },
    });

    return () => {
      editor.setEditable(false);
      editor.setOptions({
        editorProps: {
          attributes: {
            class:
              "prose prose-sm prose-zinc prose-invert max-w-none focus:outline-none",
          },
        },
      });
    };
  }, [editor]);

  const editComment = trpc.editComment.useMutation({
    onMutate: () => {
      editor.setEditable(false);
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      setEditable(false);

      toast.success("Comment successfully edited.");
    },
    onError: (error) => {
      editor.setEditable(true);
      toast.error(error.message);
    },
  });

  const isMutating = isPending || editComment.isLoading;

  const isEmpty = editor.state.doc.textContent.trim().length === 0;

  return (
    <div className="flex flex-wrap gap-2 rounded-b bg-zinc-800 px-1.5 py-1">
      <RTEButtons editor={editor} />
      <div className="ml-auto flex gap-2">
        <button
          className="rounded-full px-4 text-xs font-bold tracking-wide text-zinc-300 transition-colors hover:bg-zinc-700/50"
          onClick={() => {
            editor.commands.setContent(comment.text);
            setEditable(false);
          }}
        >
          Cancel
        </button>

        <button
          className="rounded-full px-4 text-xs font-bold tracking-wide text-zinc-300 transition-colors hover:bg-zinc-700/50"
          onClick={() => {
            editor.commands.clearContent();
          }}
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
            editComment.mutate({
              id: comment.id,
              text: editor.getHTML(),
            });
          }}
        >
          Edit
        </button>
      </div>
    </div>
  );
}
