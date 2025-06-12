import { useMutation } from "@tanstack/react-query";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import {
  EditorContent,
  useEditor,
  useEditorState,
  type Editor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { toast } from "sonner";

import {
  ReducerAction,
  useCommentContext,
  useCommentDispatchContext,
} from "@/context/CommentContext";
import { cn } from "@/lib/cn";
import { useTRPC } from "@/trpc/client";
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

export default function RTECommentEdit() {
  const state = useCommentContext();

  const editor = useEditor({
    immediatelyRender: false,
    content: state.text,
    extensions,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm prose-zinc prose-invert min-h-[8rem] max-w-none px-5 py-2 focus:outline-hidden",
      },
    },
  });

  if (!editor) {
    return <RTESkeleton content={state.text} />;
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
  const state = useCommentContext();
  const dispatch = useCommentDispatchContext();

  const trpc = useTRPC();

  const editComment = useMutation(
    trpc.comment.editComment.mutationOptions({
      onMutate: () => {
        editor.setEditable(false);
        dispatch({ type: ReducerAction.SET_TEXT, text: editor.getHTML() });
        dispatch({ type: ReducerAction.CANCEL_EDIT });
      },
      onSuccess: () => {
        toast.success("Comment successfully edited.");
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

  return (
    <div className="flex justify-end gap-2 p-2">
      <Button
        size="sm"
        variant="secondary"
        onClick={() => {
          editor.commands.setContent(state.text);
          dispatch({ type: ReducerAction.CANCEL_EDIT });
        }}
        className="rounded-full"
      >
        Cancel
      </Button>

      <Button
        size="sm"
        disabled={editorState.isEmpty}
        onClick={() => {
          if (!editorState.isEmpty) {
            editComment.mutate({
              id: state.id,
              text: prettifyHTML(editor.getHTML()),
            });
          }
        }}
        className="rounded-full"
      >
        Edit
      </Button>
    </div>
  );
}
