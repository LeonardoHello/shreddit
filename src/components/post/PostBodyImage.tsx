import { useState } from "react";
import Image from "next/image";

import { ArrowLeft, ArrowRight } from "lucide-react";
import * as thumbhash from "thumbhash";

import { usePostContext } from "@/context/PostContext";
import { cn } from "@/lib/cn";
import { ArrElement } from "@/types/helpers";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export default function PostBodyImage({ isUnsafe }: { isUnsafe: boolean }) {
  const post = usePostContext();

  const files = post.files;

  if (files.length === 1) {
    const file = files[0];

    return <PostImage file={file} isUnsafe={isUnsafe} />;
  }

  return <PostImageList files={files} isUnsafe={isUnsafe} />;
}

function PostImageList({
  files,
  isUnsafe,
}: {
  files: ReturnType<typeof usePostContext>["files"];
  isUnsafe: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(1);

  return (
    <div className="relative flex flex-col justify-center overflow-hidden">
      <div className="flex items-center">
        {files.map((file, i) => (
          <div
            key={file.id}
            className={cn("min-w-full", {
              "order-first": currentIndex === i + 1,
            })}
          >
            <PostImage file={file} isUnsafe={isUnsafe} />
          </div>
        ))}
      </div>
      {!isUnsafe && (
        <>
          <Badge className="absolute top-4 right-4 transition-opacity hover:opacity-60">
            {currentIndex}/{files.length}
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
                }

                return prev + 1;
              });
            }}
          >
            <ArrowRight />
          </Button>
        </>
      )}
    </div>
  );
}

function PostImage({
  file,
  isUnsafe,
}: {
  file: ArrElement<ReturnType<typeof usePostContext>["files"]>;
  isUnsafe: boolean;
}) {
  const post = usePostContext();

  const placeholderURL = thumbhash.thumbHashToDataURL(
    Buffer.from(file.thumbHash, "base64"),
  );

  return (
    <div className="relative overflow-hidden rounded-md">
      <div className="relative flex h-96 flex-col justify-center rounded-md border border-white/15">
        <Image
          src={placeholderURL}
          alt={file.name + " - background image"}
          fill
          className="scale-105 rounded-md object-cover object-center opacity-30"
        />
        {!isUnsafe && (
          <Image
            src={file.url}
            alt={file.name}
            priority
            quality={50}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 768px) 570px, (max-width: 1024px) 698px, (max-width: 1280px) 618px, (max-width: 1536px) 586px, 674px"
            placeholder="blur"
            blurDataURL={placeholderURL}
            className="object-contain"
          />
        )}

        {isUnsafe && (
          <Badge className="bg-background text-foreground hover:bg-background/80 absolute self-center justify-self-center rounded-full">
            View{" "}
            {post.nsfw && post.spoiler
              ? "NSFW content & spoilers"
              : post.nsfw
                ? "View NSFW content"
                : "View spoilers"}
          </Badge>
        )}
      </div>
    </div>
  );
}
