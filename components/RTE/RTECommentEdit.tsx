import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { toast } from "sonner";

import { useCommentContext } from "@/lib/context/CommentContextProvider";
import cn from "@/lib/utils/cn";
import { trpc } from "@/trpc/react";

import RTEButtons from "./RTEButtons";
import RTEcommentLoading from "./RTECommentLoading";

const extensions = [
  StarterKit,
  CharacterCount.configure({ limit: 255 }),
  Placeholder.configure({
    placeholder: "What are your thoughts?",
  }),
];

export default function RTECommentEdit() {
  const { comment } = useCommentContext();

  const editor = useEditor({
    content: comment.text,
    extensions,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm prose-zinc prose-invert min-h-[8rem] max-w-none px-5 py-2 focus:outline-none",
      },
    },
  });

  if (!editor) {
    return <RTEcommentLoading content={comment.text} />;
  }

  return (
    <div
      className={cn("rounded border border-zinc-700/70", {
        "border-zinc-300": editor.isFocused,
      })}
    >
      <EditorContent editor={editor} />
      <RTECommentEditMenu editor={editor} />
    </div>
  );
}

function RTECommentEditMenu({ editor }: { editor: Editor }) {
  const utils = trpc.useUtils();

  const { comment, setEditable } = useCommentContext();

  const editComment = trpc.editComment.useMutation({
    onMutate: () => {
      utils["getComment"].setData(comment.id, (updater) => {
        if (!updater) {
          return comment;
        }

        return { ...comment, text: editor.getHTML() };
      });
      setEditable(false);
    },
    onSuccess: () => {
      toast.success("Comment successfully edited.");
    },
    onError: async (error) => {
      await utils["getComment"].refetch(comment.id, {}, { throwOnError: true });

      toast.error(error.message);
    },
  });

  const isEmpty = editor.state.doc.textContent.trim().length === 0;

  return (
    <div className="flex flex-wrap gap-2 rounded-b bg-zinc-800 p-1.5">
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
              "cursor-not-allowed text-zinc-500":
                isEmpty || editComment.isLoading,
            },
          )}
          disabled={isEmpty || editComment.isLoading}
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
