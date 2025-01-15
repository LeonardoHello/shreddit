import { useCallback } from "react";

import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  BubbleMenu,
  Editor,
  EditorContent,
  FloatingMenu,
  useEditor,
} from "@tiptap/react";
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
import RTEMarkButtons from "./RTEMarkButtons";
import RTENodeButtons from "./RTENodeButtons";
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
      className={cn("cursor-auto rounded border border-zinc-700/70", {
        "border-zinc-300": editor.isFocused,
      })}
      onClick={(e) => {
        e.stopPropagation();
      }}
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
        <div className="h-4 w-px self-center bg-zinc-700/70" />
        <RTENodeButtonImage editor={editor} />
      </div>

      <EditorContent editor={editor} />

      <RTEPostEditActionButtons editor={editor} />
    </div>
  );
}

function RTEPostEditActionButtons({ editor }: { editor: Editor }) {
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
    <div className="flex h-10 justify-end gap-2 rounded-t p-1.5">
      <button
        className="rounded-full bg-zinc-800 px-4 text-xs font-bold tracking-wide text-zinc-300 transition-colors hover:bg-zinc-700"
        onClick={() => {
          editor.commands.setContent(state.text);
          dispatch({ type: ReducerAction.CANCEL_EDIT });
        }}
      >
        Cancel
      </button>

      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full bg-zinc-300 px-4 text-xs font-bold tracking-wide text-zinc-800 transition-opacity enabled:hover:opacity-80",
          {
            "cursor-not-allowed bg-zinc-400 text-zinc-700": isDisabled,
          },
        )}
        disabled={isDisabled}
        onClick={() => {
          if (isDisabled) return;

          editPost.mutate({
            id: state.id,
            text: prettifyHTML(editor.getHTML()),
          });
        }}
      >
        Edit
      </button>
    </div>
  );
}

function RTENodeButtonImage({ editor }: { editor: Editor }) {
  const dispatch = usePostDispatchContext();

  const { startUpload, routeConfig } = useUploadThing("imageUploader", {
    onBeforeUploadBegin: (files) => {
      dispatch({ type: ReducerAction.DISABLE_EDIT });
      return files;
    },
    onUploadProgress: (p) => {
      toast(
        <div
          className={cn("w-full rounded-full bg-zinc-800", {
            "animate-pulse": p === 100,
          })}
        >
          <div
            className="rounded-full bg-zinc-400 p-0.5 text-center text-xs font-medium leading-none text-zinc-950"
            style={{ width: p < 10 ? "10%" : p + "%" }}
          >
            {p < 10 ? 10 : p}%
          </div>
        </div>,
        { id: toastId, duration: 1000 * 99 },
      );
    },
    onClientUploadComplete: (res) => {
      editor
        .chain()
        .focus()
        .forEach(res, (file, { commands }) => {
          return commands.setImage({
            src: file.url,
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
    <div
      {...getRootProps()}
      className="cursor-pointer p-1 transition-colors hover:rounded hover:bg-zinc-700/70"
      title={"Image"}
    >
      <input {...getInputProps()} />
      <ImageIcon color={editor.isActive("image") ? "#d4d4d8" : "#71717a"} />
    </div>
  );
}
