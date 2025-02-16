import { useCallback } from "react";

import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useDropzone } from "@uploadthing/react";
import { Image as ImageIcon } from "lucide-react";
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
import { trpc } from "@/trpc/client";
import { cn } from "@/utils/cn";
import { prettifyHTML } from "@/utils/RTEprettifyHTML";
import { useUploadThing } from "@/utils/uploadthing";
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
          "prose prose-sm prose-zinc prose-invert min-h-[8rem] max-w-none px-5 py-2 focus:outline-none",
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

  const editPost = trpc.post.editPost.useMutation({
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

  const isDisabled = editPost.isPending || state.isDisabled;

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
        disabled={isDisabled}
        onClick={() => {
          if (!isDisabled) {
            editPost.mutate({
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

function ImageButton({ editor }: { editor: Editor }) {
  const dispatch = usePostDispatchContext();

  const { startUpload, routeConfig } = useUploadThing("imageUploader", {
    onBeforeUploadBegin: (files) => {
      dispatch({ type: ReducerAction.DISABLE_EDIT });
      return files;
    },
    onUploadProgress: (p) => {
      toast(<Progress value={p} />, { id: toastId, duration: 1000 * 99 });
    },
    onClientUploadComplete: (res) => {
      editor
        .chain()
        .focus()
        .forEach(res, (file, { commands }) => {
          return commands.setImage({
            src: file.appUrl,
            alt: file.name,
          });
        })
        .run();

      dispatch({ type: ReducerAction.ENABLE_EDIT });

      toast.dismiss(toastId);
    },
    onUploadError: (e) => {
      dispatch({ type: ReducerAction.ENABLE_EDIT });

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
