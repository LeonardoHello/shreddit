"use client";

import { useTransition } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import {
  EditorContent,
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
import { useTRPC } from "@/trpc/client";
import { cn } from "@/utils/cn";
import { prettifyHTML } from "@/utils/RTEprettifyHTML";
import { Button } from "../ui/button";
import RTECommentButtons from "./RTECommentButtons";
import RTEcommentLoading from "./RTESkeleton";

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
          "prose prose-sm prose-zinc prose-invert min-h-[8rem] max-w-none px-5 py-2 focus:outline-hidden",
      },
    },
    extensions,
  });

  if (!editor) {
    return <RTEcommentLoading />;
  }

  return (
    <div
      className={cn("rounded-lg border", { "border-ring": editor.isFocused })}
    >
      <RTECommentButtons editor={editor} />

      <EditorContent editor={editor} />

      <ActionButtons editor={editor} />
    </div>
  );
}

function ActionButtons({ editor }: { editor: Editor }) {
  const [isPending, startTransition] = useTransition();

  const state = useCommentContext();
  const dispatch = useCommentDispatchContext();

  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const createComment = useMutation(
    trpc.comment.createComment.mutationOptions({
      onMutate: () => {
        editor.setEditable(false);
      },
      onSuccess: () => {
        startTransition(() => {
          queryClient.invalidateQueries({
            queryKey: trpc.comment.getComments.queryKey(state.postId),
          });
        });

        dispatch({ type: ReducerAction.CANCEL_REPLY });

        toast.success("Reply successfully posted.");
      },
      onError: (error) => {
        editor.setEditable(true);
        toast.error(error.message);
      },
    }),
  );

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
    <div className="flex justify-end gap-2 p-2">
      <Button
        size="sm"
        variant="secondary"
        onClick={() => {
          dispatch({ type: ReducerAction.CANCEL_REPLY });
        }}
        className="rounded-full"
      >
        Cancel
      </Button>

      <Button
        size="sm"
        disabled={isDisabled}
        onClick={() => {
          if (!isDisabled) {
            createComment.mutate({
              postId: state.postId,
              parentCommentId: state.id,
              text: prettifyHTML(editor.getHTML()),
            });
          }
        }}
        className="rounded-full"
      >
        {isMutating && <Loader2 className="size-4 animate-spin" />}
        {!isMutating && "Reply"}
      </Button>
    </div>
  );
}
