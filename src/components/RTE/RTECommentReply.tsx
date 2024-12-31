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
  useEditorState,
  type Editor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  ReducerAction,
  useCommentContext,
  useCommentDispatchContext,
} from "@/context/CommentContext";
import { trpc } from "@/trpc/client";
import cn from "@/utils/cn";
import { prettifyHTML } from "@/utils/RTEprettifyHTML";
import RTEcommentLoading from "./RTELoading";
import RTEMarkButtons from "./RTEMarkButtons";
import RTENodeButtons from "./RTENodeButtons";

const extensions = [
  StarterKit,
  CharacterCount.configure({ limit: 255 }),
  Placeholder.configure({
    placeholder: "What are your thoughts?",
  }),
];

export default function RTECommentReply() {
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
      className={cn("ml-3 rounded border border-zinc-700/70", {
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

      <RTECommentReplyActionButtons editor={editor} />
    </div>
  );
}

function RTECommentReplyActionButtons({ editor }: { editor: Editor }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const state = useCommentContext();
  const dispatch = useCommentDispatchContext();

  const createComment = trpc.comment.createComment.useMutation({
    onMutate: () => {
      editor.setEditable(false);
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      dispatch({ type: ReducerAction.CANCEL_REPLY });

      toast.success("Reply successfully posted.");
    },
    onError: (error) => {
      editor.setEditable(true);
      toast.error(error.message);
    },
  });

  const editorState = useEditorState({
    editor,
    // This function will be called every time the editor state changes
    selector: ({ editor }: { editor: Editor }) => ({
      // It will only re-render if the text content state's length is 0
      isEmpty: editor.state.doc.textContent.trim().length === 0,
    }),
  });

  const isMutating = isPending || createComment.isPending;

  const isDisabled = editorState.isEmpty || isMutating;

  return (
    <div className="flex h-10 justify-end gap-2 rounded-b p-1.5">
      <button
        className="rounded-full bg-zinc-800 px-4 text-xs font-bold tracking-wide text-zinc-300 transition-colors hover:bg-zinc-700"
        onClick={() => {
          dispatch({ type: ReducerAction.CANCEL_REPLY });
        }}
      >
        Cancel
      </button>

      <button
        className={cn(
          "inline-flex w-16 items-center justify-center gap-2 rounded-full bg-zinc-300 text-xs font-bold tracking-wide text-zinc-800 transition-opacity enabled:hover:opacity-80",
          {
            "cursor-not-allowed bg-zinc-400 text-zinc-700": isDisabled,
          },
        )}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        onClick={() => {
          if (isDisabled) return;

          createComment.mutate({
            postId: state.postId,
            parentCommentId: state.id,
            text: prettifyHTML(editor.getHTML()),
          });
        }}
      >
        {isMutating && <Loader2 className="size-4 animate-spin" />}
        {!isMutating && "Reply"}
      </button>
    </div>
  );
}
