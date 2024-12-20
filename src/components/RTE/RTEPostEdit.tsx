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

import { useFilesContext } from "@/context/FilesContext";
import { usePostContext } from "@/context/PostContext";
import { trpc } from "@/trpc/client";
import cn from "@/utils/cn";
import { useUploadThing } from "@/utils/uploadthing";
import RTEMarkButtons from "./RTEMarkButtons";
import RTENodeButtons from "./RTENodeButtons";
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
    immediatelyRender: false,
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
  const utils = trpc.useUtils();

  const { post, setEditable } = usePostContext();
  const { files, isUploading } = useFilesContext();

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

  const disabled =
    editor.getHTML() === post.text ||
    editor.isEmpty ||
    editPost.isPending ||
    isUploading;

  return (
    <div className="flex h-10 justify-end gap-2 rounded-t p-1.5">
      <button
        className="rounded-full bg-zinc-800 px-4 text-xs font-bold tracking-wide text-zinc-300 transition-colors hover:bg-zinc-700"
        onClick={() => {
          editor.commands.setContent(post.text);
          setEditable(false);
        }}
      >
        Cancel
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
  );
}

function RTENodeButtonImage({ editor }: { editor: Editor }) {
  const { setFiles, setIsUploading } = useFilesContext();

  const { startUpload, routeConfig } = useUploadThing("imageUploader", {
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
