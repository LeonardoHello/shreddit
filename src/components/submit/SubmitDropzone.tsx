"use client";

import { useCallback } from "react";
import Image from "next/image";

import { useDropzone } from "@uploadthing/react";
import { CloudUpload, ImagePlus, Trash } from "lucide-react";
import { toast } from "sonner";
import {
  generateClientDropzoneAccept,
  generateMimeTypes,
  generatePermittedFileTypes,
} from "uploadthing/client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  ReducerAction,
  useSubmitContext,
  useSubmitDispatchContext,
  type ReducerState,
} from "@/context/SubmitContext";
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
          file: file,
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

  if (state.selectedFiles.length > 0) {
    return <SelectedImageCarousel files={state.selectedFiles} />;
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

function SelectedImageCarousel({
  files,
}: {
  files: ReducerState["selectedFiles"];
}) {
  if (files.length === 1) {
    const file = files[0];

    return (
      <div className="group">
        <SelectedImage url={file.url} name={file.file.name} />
      </div>
    );
  }

  return (
    <Carousel opts={{ duration: 0, watchDrag: false }}>
      <CarouselContent className="group gap-4">
        {files.map((file, i) => {
          return (
            <CarouselItem key={file.url}>
              <SelectedImage
                url={file.url}
                name={file.file.name}
                index={i + 1}
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

function SelectedImage({
  url,
  name,
  index,
}: {
  url: string;
  name: File["name"];
  index?: number;
}) {
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
        file: file,
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

        {index !== undefined && (
          <Badge
            variant={
              state.selectedFiles.length > 12 ? "destructive" : "default"
            }
            className="absolute top-6 right-6 z-10 gap-0"
          >
            {index}/{state.selectedFiles.length}
          </Badge>
        )}
      </div>
    </div>
  );
}
