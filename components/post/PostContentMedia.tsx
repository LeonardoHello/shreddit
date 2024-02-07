import { memo, useState } from "react";

import Image from "next/image";
import { useParams } from "next/navigation";

import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";

import { usePostContext } from "@/lib/context/PostContextProvider";
import cn from "@/lib/utils/cn";

export default memo(function PostContentMedia() {
  const { postId } = useParams();

  const [currentIndex, setCurrentIndex] = useState(1);

  const {
    post: { files, spoiler, nsfw },
  } = usePostContext();

  if (files.length === 0) return null;

  if (files.length === 1) {
    return (
      <div
        className={cn("grid max-h-96 place-content-center", {
          "blur-2xl": !postId && (nsfw || spoiler),
        })}
      >
        <Image
          src={files[0].url}
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
        {files.map((image, i) => (
          <div
            key={image.id}
            className={cn("order-2 grid min-w-full place-content-center", {
              "order-1": currentIndex === i + 1,
              "blur-2xl": !postId && (nsfw || spoiler),
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
      {(postId || (!nsfw && !spoiler)) && (
        <>
          <div className="absolute right-2 top-4 rounded-full bg-zinc-950/70 px-2 py-1 text-xs font-semibold tracking-[0.075em]">
            {currentIndex}/{files.length}
          </div>
          <ArrowLeftCircleIcon
            className="absolute left-2 h-12 w-12 cursor-pointer rounded-full"
            onClick={(e) => {
              e.stopPropagation();

              setCurrentIndex((prev) => {
                if (prev === 1) {
                  return files.length;
                }

                return prev - 1;
              });
            }}
          />
          <ArrowRightCircleIcon
            className="absolute right-2 h-12 w-12 cursor-pointer rounded-full"
            onClick={(e) => {
              e.stopPropagation();

              setCurrentIndex((prev) => {
                if (prev === files.length) {
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
});
