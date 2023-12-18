import { memo, useState } from "react";

import Image from "next/image";

import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";
import { Image as ImageExtension } from "@tiptap/extension-image";
import { generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import type { File, Post } from "@/lib/db/schema";
import type { InfiniteQueryPost } from "@/lib/types";
import cn from "@/lib/utils/cn";

export default memo(function PostContent({
  post,
}: {
  post: InfiniteQueryPost;
}) {
  if (post.text === null && post.files.length === 0) return null;

  if (post.text) {
    if (post.spoiler || post.nsfw) return null;

    const json = JSON.parse(post.text);
    const output = generateHTML(json, [StarterKit, ImageExtension]);

    return (
      <div className="relative max-h-64 overflow-hidden">
        <div
          className="prose prose-sm prose-zinc prose-invert focus:outline-none"
          dangerouslySetInnerHTML={{
            __html: output,
          }}
        />
        <div className="absolute top-0 h-full w-full bg-gradient-to-b from-transparent to-zinc-900" />
      </div>
    );
  } else {
    return (
      <PostImageContent
        images={post.files}
        spoiler={post.spoiler}
        nsfw={post.nsfw}
      />
    );
  }
});

function PostImageContent({
  images,
  spoiler,
  nsfw,
}: {
  images: File[];
  spoiler: Post["spoiler"];
  nsfw: Post["nsfw"];
}) {
  const [currentIndex, setCurrentIndex] = useState(1);

  if (images.length === 1) {
    return (
      <div
        className={cn("grid max-h-96 place-content-center", {
          "blur-2xl": nsfw || spoiler,
        })}
      >
        <Image
          src={images[0].url}
          alt="post image"
          width={500}
          height={500}
          className="h-auto max-h-96 min-w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className="relative flex max-h-96 flex-col justify-center overflow-hidden">
      <div className="flex items-center">
        {images.map((image, i) => (
          <div
            key={image.id}
            className={cn("order-2 grid min-w-full place-content-center", {
              "order-1": currentIndex === i + 1,
              "blur-2xl": nsfw || spoiler,
            })}
          >
            <Image
              src={image.url}
              alt="post slider image"
              height={500}
              width={500}
              className="h-auto max-h-96 min-w-full object-contain"
            />
          </div>
        ))}
      </div>
      {!nsfw && !spoiler && (
        <>
          <div className="absolute right-2 top-4 rounded-full bg-zinc-950/70 px-2 py-1 text-xs font-semibold tracking-[0.075em]">
            {currentIndex}/{images.length}
          </div>
          <ArrowLeftCircleIcon
            className="absolute left-2 h-12 w-12 cursor-pointer rounded-full"
            onClick={() => {
              setCurrentIndex((prev) => {
                if (prev === 1) {
                  return images.length;
                }

                return prev - 1;
              });
            }}
          />
          <ArrowRightCircleIcon
            className="absolute right-2 h-12 w-12 cursor-pointer rounded-full"
            onClick={() => {
              setCurrentIndex((prev) => {
                if (prev === images.length) {
                  return 1;
                }

                return prev + 1;
              });
            }}
          />
        </>
      )}
    </div>
  );
}
