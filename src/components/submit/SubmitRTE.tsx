"use client";

import { useCallback } from "react";

import ExtensionBubbleMenu from "@tiptap/extension-bubble-menu";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  BubbleMenu,
  EditorContent,
  FloatingMenu,
  useEditor,
} from "@tiptap/react";
import type { Editor } from "@tiptap/react";
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
  useSubmitContext,
  useSubmitDispatchContext,
} from "@/context/SubmitContext";
import cn from "@/utils/cn";
import { useUploadThing } from "@/utils/uploadthing";
import RTEMarkButtons from "../RTE/RTEMarkButtons";
import RTENodeButtons from "../RTE/RTENodeButtons";
import RTEpostLoading from "../RTE/RTEPostLoading";

const extensions = [
  StarterKit,
  ExtensionBubbleMenu,
  Image.configure({ inline: true }),
  Placeholder.configure({
    placeholder: "Text",
  }),
];

export default function SubmitRTE() {
  const state = useSubmitContext();
  const dispatch = useSubmitDispatchContext();

  const editor = useEditor({
    immediatelyRender: false,
    content: state.text || "",
    extensions,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm prose-zinc prose-invert min-h-[8rem] max-w-none py-2 px-4 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      if (editor.isEmpty) {
        dispatch({ type: ReducerAction.SET_TEXT, nextText: null });
      } else {
        dispatch({
          type: ReducerAction.SET_TEXT,
          nextText: editor.getHTML(),
        });
      }
    },
  });

  if (!editor) {
    return <RTEpostLoading />;
  }

  return (
    <div
      className={cn("rounded border border-zinc-700/70", {
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
        <div className="h-4 w-px self-center bg-zinc-700/70" />
        <RTENodeButtonImage editor={editor} />
      </FloatingMenu>

      <div className="hidden flex-wrap gap-2 rounded-t bg-zinc-800 p-1 sm:flex">
        <RTEMarkButtons editor={editor} />
        <div className="h-4 w-px self-center bg-zinc-700/70" />
        <RTENodeButtons editor={editor} />
        <div className="h-4 w-px self-center bg-zinc-700/70" />
        <RTENodeButtonImage editor={editor} />
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

const toastId = "loading_toast";

function RTENodeButtonImage({ editor }: { editor: Editor }) {
  const dispatch = useSubmitDispatchContext();

  const { startUpload, routeConfig } = useUploadThing("imageUploader", {
    onBeforeUploadBegin: (files) => {
      dispatch({ type: ReducerAction.DISABLE_SUBMIT });
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
        {
          id: toastId,
          duration: 1000 * 99,
        },
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

      dispatch({ type: ReducerAction.ENABLE_SUBMIT });

      toast.dismiss(toastId);
    },

    onUploadError: (e) => {
      dispatch({ type: ReducerAction.ENABLE_SUBMIT });

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
