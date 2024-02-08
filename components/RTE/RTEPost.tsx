"use client";

import { useCallback } from "react";

import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useDropzone } from "@uploadthing/react";
import { toast } from "sonner";
import { generateClientDropzoneAccept } from "uploadthing/client";

import {
  REDUCER_ACTION_TYPE,
  useSubmitContext,
} from "@/lib/context/SubmitContextProvider";
import cn from "@/lib/utils/cn";
import { useUploadThing } from "@/lib/utils/uploadthing";

import RTEButtons from "./RTEButtons";
import RTEpostLoading from "./RTEPostLoading";

const extensions = [
  StarterKit,
  Image.configure({ inline: true }),
  Placeholder.configure({
    placeholder: "Text",
  }),
];

const toastId = "loading_toast";

export default function RTEPost() {
  const { dispatch } = useSubmitContext();

  const editor = useEditor({
    extensions,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm prose-zinc prose-invert min-h-[8rem] max-w-none py-2 px-4 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      if (editor.isEmpty) {
        dispatch({ type: REDUCER_ACTION_TYPE.CHANGED_TEXT, nextText: null });
      } else {
        dispatch({
          type: REDUCER_ACTION_TYPE.CHANGED_TEXT,
          nextText: editor.getHTML(),
        });
      }
    },
    onDestroy: () => {
      dispatch({ type: REDUCER_ACTION_TYPE.CHANGED_TEXT, nextText: null });
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
      <RTEPostMenu editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function RTEPostMenu({ editor }: { editor: Editor }) {
  const { dispatch } = useSubmitContext();

  const { startUpload, permittedFileInfo } = useUploadThing("imageUploader", {
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

      const files = res.map(({ size, serverData, ...rest }) => rest);

      dispatch({
        type: REDUCER_ACTION_TYPE.ADDED_FILES,
        nextFiles: files,
      });

      toast.dismiss(toastId);
    },
    onUploadProgress: (p) => {
      toast.loading(p + "%", { id: toastId, duration: Infinity });
    },
    onUploadError: (e) => {
      toast.error(e.message);
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      startUpload(acceptedFiles);
    },
    [startUpload],
  );

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  return (
    <div className="flex flex-wrap gap-2 rounded-t bg-zinc-800 p-1.5">
      <RTEButtons editor={editor}>
        <div className="h-4 w-px self-center bg-zinc-700/70" />
        <div
          {...getRootProps()}
          title="Image"
          className={cn(
            "cursor-pointer p-0.5 transition-colors hover:rounded hover:bg-zinc-700/70",
            { "opacity-30": false },
          )}
        >
          <input {...getInputProps()} />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              d="M2.9918 21C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918ZM20 15V5H4V19L14 9L20 15ZM20 17.8284L14 11.8284L6.82843 19H20V17.8284ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z"
              fill="#71717a"
            />
          </svg>
        </div>
      </RTEButtons>
    </div>
  );
}