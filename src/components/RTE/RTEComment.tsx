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

import type { Post } from "@/db/schema/posts";
import { useTRPC } from "@/trpc/client";
import { cn } from "@/utils/cn";
import { prettifyHTML } from "@/utils/RTEprettifyHTML";
import { Button } from "../ui/button";
import RTECommentButtons from "./RTECommentButtons";
import RTESkeleton from "./RTESkeleton";

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
          "prose prose-sm prose-zinc prose-invert min-h-[8rem] max-w-none px-5 py-2 focus:outline-hidden",
      },
    },
    extensions,
  });

  if (!editor) {
    return <RTESkeleton />;
  }

  return (
    <div
      className={cn("rounded-lg border", { "border-ring": editor.isFocused })}
    >
      <RTECommentButtons editor={editor} />

      <EditorContent editor={editor} />

      <ActionButtons editor={editor} postId={postId} />
    </div>
  );
}

function ActionButtons({
  editor,
  postId,
}: {
  editor: Editor;
  postId: Post["id"];
}) {
  const [isPending, startTransition] = useTransition();

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
            queryKey: trpc.comment.getComments.queryKey(postId),
          });
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
    }),
  );

  const isMutating = isPending || createComment.isPending;

  const editorState = useEditorState({
    editor,
    // This function will be called every time the editor state changes
    selector: ({ editor }: { editor: Editor }) => ({
      // It will only re-render if the text content state's length is 0
      isEmpty: editor.state.doc.textContent.trim().length === 0,
    }),
  });

  const isDisabled = editorState.isEmpty || isMutating;

  return (
    <div className="flex justify-end gap-2 p-2">
      <Button
        size="sm"
        variant="secondary"
        className="rounded-full"
        onClick={() => {
          editor.commands.clearContent();
        }}
      >
        Clear
      </Button>

      <Button
        size="sm"
        disabled={isDisabled}
        onClick={() => {
          if (!isDisabled) {
            createComment.mutate({
              postId,
              parentCommentId: null,
              text: prettifyHTML(editor.getHTML()),
            });
          }
        }}
        className="rounded-full"
      >
        {isMutating && <Loader2 className="size-4 animate-spin" />}
        {!isMutating && "Comment"}
      </Button>
    </div>
  );
}
