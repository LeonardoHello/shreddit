import { useState } from "react";

import Image from "next/image";

import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";

import type { File } from "@/lib/db/schema";
import cn from "@/lib/utils/cn";

export default function ImageSlider({
  images,
  spoiler,
  nsfw,
}: {
  images: File[];
  spoiler: boolean;
  nsfw: boolean;
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
