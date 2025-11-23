import { useCallback } from "react";

import { useMutation } from "@tanstack/react-query";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useDropzone } from "@uploadthing/react";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";

import {
  ReducerAction,
  usePostContext,
  usePostDispatchContext,
} from "@/context/PostContext";
import { client } from "@/hono/client";
import { cn } from "@/lib/cn";
import { useUploadThing } from "@/lib/uploadthing";
import { prettifyHTML } from "@/utils/RTEprettifyHTML";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Toggle } from "../ui/toggle";
import RTEPostButtons from "./RTEPostButtons";
import RTESkeleton from "./RTESkeleton";

const extensions = [
  StarterKit,
  Image.configure({ inline: true }),
  Placeholder.configure({
    placeholder: "Text",
  }),
];

const toastId = "loading_toast";

export default function PostEditRTE() {
  const post = usePostContext();

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: post.text || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm prose-zinc prose-invert min-h-[8rem] max-w-none px-5 py-2 focus:outline-hidden",
      },
    },
  });

  if (!editor) {
    return <RTESkeleton content={post.text ?? undefined} />;
  }

  return (
    <div
      className={cn("rounded-lg border", { "border-ring": editor.isFocused })}
    >
      <RTEPostButtons editor={editor}>
        <ImageButton editor={editor} />
      </RTEPostButtons>

      <EditorContent editor={editor} />

      <ActionButtons editor={editor} />
    </div>
  );
}

function ActionButtons({ editor }: { editor: Editor }) {
  const state = usePostContext();
  const dispatch = usePostDispatchContext();

  const editPost = useMutation({
    mutationFn: async () => {
      await client.posts[
        ":postId{[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}}"
      ].$patch({
        param: { postId: state.id },
        json: { text: prettifyHTML(editor.getHTML()) },
      });
    },
    onMutate: () => {
      dispatch({
        type: ReducerAction.SET_TEXT,
        text: prettifyHTML(editor.getHTML()),
      });
      dispatch({ type: ReducerAction.CANCEL_EDIT });
    },
    onSuccess: () => {
      toast.success("Post successfully edited.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const isMutating = state.isUploading || editPost.isPending;

  const handleSubmit = () => {
    if (isMutating) return;

    editPost.mutate();
  };

  return (
    <div className="flex justify-end gap-2 p-2">
      <Button
        size="sm"
        variant="secondary"
        onClick={() => {
          editor.commands.setContent(state.text);
          dispatch({ type: ReducerAction.CANCEL_EDIT });

          toast.dismiss(toastId);
        }}
        className="rounded-full"
      >
        Cancel
      </Button>

      <Button
        size="sm"
        disabled={isMutating}
        onClick={handleSubmit}
        className="rounded-full"
      >
        {state.isUploading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Uploading...
          </>
        ) : (
          "Edit"
        )}
      </Button>
    </div>
  );
}

function ImageButton({ editor }: { editor: Editor }) {
  const state = usePostContext();
  const dispatch = usePostDispatchContext();

  const { startUpload, routeConfig } = useUploadThing("imageUploader", {
    onBeforeUploadBegin: (files) => {
      dispatch({ type: ReducerAction.START_UPLOAD });

      return files;
    },
    onUploadProgress: (p) => {
      if (state.isEditing) {
        toast.info(<Progress value={p} />, {
          id: toastId,
          duration: 1000 * 99,
        });
      }
    },
    onClientUploadComplete: (res) => {
      editor
        .chain()
        .focus()
        .forEach(res, (file, { commands }) => {
          return commands.setImage({
            src: file.ufsUrl,
            alt: file.name,
          });
        })
        .run();

      dispatch({ type: ReducerAction.STOP_UPLOAD });

      toast.dismiss(toastId);
    },
    onUploadError: (e) => {
      dispatch({ type: ReducerAction.STOP_UPLOAD });

      toast.dismiss(toastId);
      toast.error(e.message);
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      startUpload(acceptedFiles);
    },
    [startUpload],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes,
    ),
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Toggle pressed={false}>
        <ImageIcon />
      </Toggle>
    </div>
  );
}
