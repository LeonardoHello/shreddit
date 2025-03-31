"use client";

import { useCallback } from "react";

import ExtensionBubbleMenu from "@tiptap/extension-bubble-menu";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
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
import { PostType } from "@/types/enums";
import { cn } from "@/utils/cn";
import { prettifyHTML } from "@/utils/RTEprettifyHTML";
import { useUploadThing } from "@/utils/uploadthing";
import { Progress } from "../ui/progress";
import { Toggle } from "../ui/toggle";
import RTEPostButtons from "./RTEPostButtons";
import RTESkeleton from "./RTESkeleton";

const extensions = [
  StarterKit,
  ExtensionBubbleMenu,
  Image.configure({ inline: true }),
  Placeholder.configure({
    placeholder: "Text",
  }),
];

export default function RTEPost() {
  const state = useSubmitContext();
  const dispatch = useSubmitDispatchContext();

  const editor = useEditor({
    immediatelyRender: false,
    content: state.text ?? undefined,
    extensions,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm prose-zinc prose-invert min-h-[8rem] max-w-none py-2 px-4 focus:outline-hidden",
      },
    },
    onUpdate: ({ editor }) => {
      dispatch({
        type: ReducerAction.SET_TEXT,
        text: prettifyHTML(editor.getHTML()),
      });
    },
  });

  if (!editor) {
    return <RTESkeleton isSubmitPage />;
  }

  return (
    <div
      className={cn("rounded-lg border", {
        "border-ring": editor.isFocused,
        "border-dashed": state.postType === PostType.IMAGE,
      })}
    >
      <RTEPostButtons editor={editor}>
        <ImageButton editor={editor} />
      </RTEPostButtons>

      <EditorContent editor={editor} />
    </div>
  );
}

const toastId = "loading_toast";

function ImageButton({ editor }: { editor: Editor }) {
  const dispatch = useSubmitDispatchContext();

  const { startUpload, routeConfig } = useUploadThing("imageUploader", {
    onBeforeUploadBegin: (files) => {
      dispatch({ type: ReducerAction.DISABLE_SUBMIT });
      return files;
    },
    onUploadProgress: (p) => {
      toast.info(<Progress value={p} />, {
        id: toastId,
        duration: 1000 * 99,
      });
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
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Toggle pressed={false}>
        <ImageIcon />
      </Toggle>
    </div>
  );
}
