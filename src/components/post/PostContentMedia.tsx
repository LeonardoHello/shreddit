import { memo, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";

import { usePostContext } from "@/context/PostContextProvider";
import cn from "@/utils/cn";

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
        className={cn("relative h-96", {
          "blur-2xl": !postId && (nsfw || spoiler),
        })}
      >
        <Image
          src={files[0].url}
          alt={files[0].name}
          fill
          sizes="(max-width: 768px) 90vw, (max-width: 1024px) 700px, (max-width: 1280px) 610px, 740px"
          className="object-contain"
        />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col justify-center overflow-hidden">
      <div className="flex items-center">
        {files.map((image, i) => (
          <div
            key={image.id}
            className={cn("relative order-2 h-96 min-w-full", {
              "order-1": currentIndex === i + 1,
              "blur-2xl": !postId && (nsfw || spoiler),
            })}
          >
            <Image
              src={image.url}
              alt={image.name}
              fill
              sizes="(max-width: 768px) 90vw, (max-width: 1024px) 700px, (max-width: 1280px) 610px, 740px"
              className="object-contain"
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
