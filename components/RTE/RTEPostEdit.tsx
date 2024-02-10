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
import { toast } from "sonner";
import { generateClientDropzoneAccept } from "uploadthing/client";

import { useFilesContext } from "@/lib/context/FilesContextProvider";
import { usePostContext } from "@/lib/context/PostContextProvider";
import cn from "@/lib/utils/cn";
import { useUploadThing } from "@/lib/utils/uploadthing";
import { trpc } from "@/trpc/react";

import RTEButtons, { RTEButtonsInline, RTEButtonsNode } from "./RTEButtons";
import RTEpostLoading from "./RTEPostLoading";

const extensions = [
  StarterKit,
  Image.configure({ inline: true }),
  Placeholder.configure({
    placeholder: "Text",
  }),
];

const toastId = "loading_toast";

export default function RTEPostEdit() {
  const { post } = usePostContext();

  const editor = useEditor({
    extensions,
    content: post.text,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm prose-zinc prose-invert min-h-[8rem] max-w-none px-5 py-2 focus:outline-none",
      },
    },
  });

  if (!editor) {
    return <RTEpostLoading content={post.text} />;
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
      <RTEPostEditFloatingMenu editor={editor} />
      <RTEPostEditMenu editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function RTEPostEditMenu({ editor }: { editor: Editor }) {
  const utils = trpc.useUtils();

  const { post, setEditable } = usePostContext();
  const { files, setFiles, isUploading, setIsUploading } = useFilesContext();

  const deleteFiles = trpc.deleteFile.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createFiles = trpc.createFile.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const editPost = trpc.editPost.useMutation({
    onMutate: () => {
      utils["getPost"].setData(post.id, (updater) => {
        if (!updater) {
          const post = utils["getPost"].getData();

          return post;
        }

        return { ...updater, text: editor.getHTML() };
      });

      setEditable(false);
    },
    onSuccess: () => {
      toast.success("Post successfully edited.");

      const filesToDelete = post.files
        .filter(
          (file) =>
            !editor
              .getHTML()
              .includes(`<img src="${file.url}" alt="${file.name}">`),
        )
        .map(({ key }) => key);

      if (filesToDelete.length > 0) {
        deleteFiles.mutate({ postId: post.id, keys: filesToDelete });
      }

      // set to onConflictDoNothing() in case of duplicated file insert
      const filesToInsert = files
        .filter((file) =>
          editor
            .getHTML()
            .includes(`<img src="${file.url}" alt="${file.name}">`),
        )
        .map((file) => ({
          ...file,
          postId: post.id,
        }));

      if (filesToInsert.length > 0) {
        createFiles.mutate(filesToInsert);
      }
    },
    onError: async (error) => {
      await utils["getPost"].refetch(post.id, {}, { throwOnError: true });

      toast.error(error.message);
    },
  });

  const { startUpload, permittedFileInfo } = useUploadThing("imageUploader", {
    onBeforeUploadBegin: (files) => {
      setIsUploading(true);
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
        { id: toastId, duration: 1000 * 99, closeButton: false },
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

      setFiles((prev) => [...prev, ...files]);
      setIsUploading(false);

      toast.dismiss(toastId);
    },
    onUploadError: (e) => {
      setIsUploading(false);

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

  const disabled = editor.isEmpty || editPost.isLoading || isUploading;

  return (
    <div className="flex h-10 flex-wrap gap-2 rounded-t bg-zinc-800 p-1.5">
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

      <div className="ml-auto flex gap-2">
        <button
          className="rounded-full px-4 text-xs font-bold tracking-wide text-zinc-300 transition-colors hover:bg-zinc-700/50"
          onClick={() => {
            editor.commands.setContent(post.text);
            setEditable(false);
          }}
        >
          Cancel
        </button>

        <button
          className="rounded-full px-4 text-xs font-bold tracking-wide text-zinc-300 transition-colors hover:bg-zinc-700/50"
          onClick={() => {
            editor.commands.clearContent();
          }}
        >
          Clear
        </button>

        <button
          className={cn(
            "rounded-full bg-zinc-300 px-4 text-xs font-bold tracking-wide text-zinc-800 transition-opacity hover:opacity-80",
            {
              "cursor-not-allowed text-zinc-500": disabled,
            },
          )}
          disabled={disabled}
          onClick={() => {
            editPost.mutate({
              id: post.id,
              text: editor.getHTML(),
            });
          }}
        >
          Edit
        </button>
      </div>
    </div>
  );
}

function RTEPostEditFloatingMenu({ editor }: { editor: Editor }) {
  const { setFiles, setIsUploading } = useFilesContext();

  const { startUpload, permittedFileInfo } = useUploadThing("imageUploader", {
    onBeforeUploadBegin: (files) => {
      setIsUploading(true);
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
        { id: toastId, duration: 1000 * 99, closeButton: false },
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

      setFiles((prev) => [...prev, ...files]);
      setIsUploading(false);

      toast.dismiss(toastId);
    },
    onUploadError: (e) => {
      setIsUploading(false);

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
