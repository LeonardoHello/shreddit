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
import { toast } from "sonner";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";

import { REDUCER_ACTION_TYPE, useSubmitContext } from "@/context/SubmitContext";
import cn from "@/utils/cn";
import { useUploadThing } from "@/utils/uploadthing";
import RTEButtons, { RTEButtonsInline, RTEButtonsNode } from "./RTEButtons";
import RTEpostLoading from "./RTEPostLoading";

const extensions = [
  StarterKit,
  ExtensionBubbleMenu,
  Image.configure({ inline: true }),
  Placeholder.configure({
    placeholder: "Text",
  }),
];

const toastId = "loading_toast";

export default function RTEPost() {
  const { dispatch } = useSubmitContext();

  const editor = useEditor({
    immediatelyRender: false,
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
        dispatch({ type: REDUCER_ACTION_TYPE.CHANGED_FILES, nextFiles: [] });
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
      <div>
        <BubbleMenu
          editor={editor}
          className="rounded-md border border-zinc-700/70 bg-zinc-900 p-1 lg:hidden"
        >
          <RTEButtonsInline editor={editor} />
        </BubbleMenu>
      </div>
      <RTEPostFloatingMenu editor={editor} />
      <RTEPostMenu editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function RTEPostMenu({ editor }: { editor: Editor }) {
  const { dispatch } = useSubmitContext();

  const { startUpload, routeConfig } = useUploadThing("imageUploader", {
    onBeforeUploadBegin: (files) => {
      dispatch({ type: REDUCER_ACTION_TYPE.STARTED_UPLOAD });
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

      const files = res.map(({ size, serverData, ...rest }) => rest);

      dispatch({
        type: REDUCER_ACTION_TYPE.ADDED_FILES,
        nextFiles: files,
      });
      dispatch({ type: REDUCER_ACTION_TYPE.STOPPED_UPLOAD });

      toast.dismiss(toastId);
    },
    onUploadError: (e) => {
      dispatch({ type: REDUCER_ACTION_TYPE.STOPPED_UPLOAD });

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
    <div className="hidden h-10 flex-wrap gap-2 rounded-t bg-zinc-800 p-1.5 lg:flex">
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

function RTEPostFloatingMenu({ editor }: { editor: Editor }) {
  const { dispatch } = useSubmitContext();

  const { startUpload, routeConfig } = useUploadThing("imageUploader", {
    onBeforeUploadBegin: (files) => {
      dispatch({ type: REDUCER_ACTION_TYPE.STARTED_UPLOAD });
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

      const files = res.map(({ size, serverData, ...rest }) => rest);

      dispatch({
        type: REDUCER_ACTION_TYPE.ADDED_FILES,
        nextFiles: files,
      });
      dispatch({ type: REDUCER_ACTION_TYPE.STOPPED_UPLOAD });

      toast.dismiss(toastId);
    },
    onUploadError: (e) => {
      dispatch({ type: REDUCER_ACTION_TYPE.STOPPED_UPLOAD });

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
    <div>
      <FloatingMenu
        editor={editor}
        className="rounded-md border border-zinc-700/70 bg-zinc-900 p-1 lg:hidden"
      >
        <RTEButtonsNode editor={editor}>
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
        </RTEButtonsNode>
      </FloatingMenu>
    </div>
  );
}
