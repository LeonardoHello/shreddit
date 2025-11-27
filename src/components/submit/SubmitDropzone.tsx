"use client";

import { useCallback, useState } from "react";
import Image from "next/image";

import { useDropzone } from "@uploadthing/react";
import {
  ArrowLeft,
  ArrowRight,
  CloudUpload,
  ImagePlus,
  Trash,
} from "lucide-react";
import { toast } from "sonner";
import {
  generateClientDropzoneAccept,
  generateMimeTypes,
  generatePermittedFileTypes,
} from "uploadthing/client";

import {
  ReducerAction,
  useSubmitContext,
  useSubmitDispatchContext,
} from "@/context/SubmitContext";
import { cn } from "@/lib/cn";
import { getRouteConfig } from "@/lib/uploadthing";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

// file size limit in MB
const maxFileSize = 4;
const maxFileSizeInBytes = maxFileSize * 1024 * 1024; // convert to bytes
const maxFileCount = 12;

export default function SubmitDropzone() {
  const state = useSubmitContext();
  const dispatch = useSubmitDispatchContext();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const filteredFiles = acceptedFiles.filter((file) => {
        if (file.size > maxFileSizeInBytes) {
          toast.error(
            `File ${file.name} exceeds the maximum size of ${maxFileSize}MB`,
          );
          return false;
        }
        return true;
      });

      if (state.selectedFiles.length + filteredFiles.length > 12) {
        toast.error(`You can only upload up to ${maxFileCount} files.`);
      }

      dispatch({
        type: ReducerAction.SET_FILES,
        selectedFiles: filteredFiles.map((file) => ({
          file,
          url: URL.createObjectURL(file),
        })),
      });
    },
    [dispatch, state.selectedFiles.length],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(getRouteConfig("imageUploader")).fileTypes,
    ),
  });

  if (state.selectedFiles.length === 1) {
    const file = state.selectedFiles[0];
    return (
      <div className="group">
        <SelectedImage url={file.url} name={file.file.name} />
      </div>
    );
  }

  if (state.selectedFiles.length > 1) {
    return (
      <div className="group">
        <SelectedImageList files={state.selectedFiles} />
      </div>
    );
  }

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div className="flex h-72 flex-col items-center justify-center rounded border border-dashed">
        <CloudUpload className="size-12 stroke-1" />
        <div className="text-sm font-semibold text-blue-600">
          Choose file(s) or drag and drop
        </div>

        <div className="text-xs">
          Images up to {maxFileSize}MB, max {maxFileCount}
        </div>
        <div className="mt-2">Choose File(s)</div>
      </div>
    </div>
  );
}

function SelectedImageList({
  files,
}: {
  files: ReturnType<typeof useSubmitContext>["selectedFiles"];
}) {
  const [currentIndex, setCurrentIndex] = useState(1);

  return (
    <div className="relative flex flex-col justify-center overflow-hidden">
      <div className="flex items-center">
        {files.map((file, i) => {
          return (
            <div
              key={file.url}
              className={cn("min-w-full", {
                "order-first": currentIndex === i + 1,
              })}
            >
              <SelectedImage url={file.url} name={file.file.name} />
            </div>
          );
        })}
      </div>

      <Badge
        variant={files.length > 12 ? "destructive" : "default"}
        className="absolute top-4 right-4 transition-opacity hover:opacity-60"
      >
        {currentIndex > files.length ? 1 : currentIndex}/{files.length}
      </Badge>
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 rounded-full"
        onClick={(e) => {
          e.stopPropagation();

          setCurrentIndex((prev) => {
            if (prev === 1) {
              return files.length;
            }

            return prev - 1;
          });
        }}
      >
        <ArrowLeft />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 rounded-full"
        onClick={(e) => {
          e.stopPropagation();

          setCurrentIndex((prev) => {
            if (prev === files.length) {
              return 1;
            } else if (prev > files.length) {
              return 2;
            }

            return prev + 1;
          });
        }}
      >
        <ArrowRight />
      </Button>
    </div>
  );
}

function SelectedImage({ url, name }: { url: string; name: File["name"] }) {
  const state = useSubmitContext();
  const dispatch = useSubmitDispatchContext();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const filteredFiles = fileArray.filter((file) => {
      if (file.size > maxFileSizeInBytes) {
        toast.error(
          `File ${file.name} exceeds the maximum size of ${maxFileSize}MB`,
        );
        return false;
      }
      return true;
    });

    if (state.selectedFiles.length + filteredFiles.length > 12) {
      toast.error(`You can only upload up to ${maxFileCount} files.`);
    }

    dispatch({
      type: ReducerAction.ADD_FILES,
      selectedFiles: filteredFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    });

    // Reset the input value to allow re-uploading the same file
    event.target.value = "";
  };

  const permittedFileTypes = generatePermittedFileTypes(
    getRouteConfig("imageUploader"),
  );

  return (
    <div className="relative overflow-hidden rounded-md">
      <div className="relative flex h-96 flex-col justify-center rounded-md border border-white/15">
        <Image
          src={url}
          alt={name + " - background image"}
          fill
          quality={1}
          className="scale-105 rounded-md object-cover object-center opacity-30"
        />

        <Image
          src={url}
          alt={name}
          priority
          quality={100}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 768px) 570px, (max-width: 1024px) 698px, (max-width: 1280px) 618px, (max-width: 1536px) 586px, 674px"
          className="object-contain"
        />

        <label
          htmlFor="profile-upload"
          className="absolute top-4 left-4 z-10 cursor-pointer"
        >
          <Button
            size={"sm"}
            variant="secondary"
            className="rounded-full opacity-0 group-hover:opacity-90"
            asChild
          >
            <div>
              <ImagePlus className="size-4" />
              Add
            </div>
          </Button>
          <input
            id="profile-upload"
            type="file"
            accept={generateMimeTypes(permittedFileTypes.fileTypes).join(", ")}
            multiple={permittedFileTypes.multiple}
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
        <Button
          variant={"secondary"}
          className="absolute top-4 left-[92px] z-10 size-8 rounded-full opacity-0 group-hover:opacity-90"
          onClick={() => {
            dispatch({
              type: ReducerAction.REMOVE_FILE,
              fileUrl: url,
            });
          }}
        >
          <Trash />
        </Button>
      </div>
    </div>
  );
}
