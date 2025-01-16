import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import * as thumbhash from "thumbhash";

import { usePostContext } from "@/context/PostContext";
import { cn } from "@/utils/cn";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export default function PostContentMedia() {
  const { postId } = useParams();
  const [currentIndex, setCurrentIndex] = useState(1);

  const post = usePostContext();

  const showBlur = !postId && (post.nsfw || post.spoiler);

  const imageSizes =
    "(max-width: 640px) 90vw, (max-width: 768px) 570px, (max-width: 1024px) 698px, (max-width: 1280px) 618px, (max-width: 1536px) 586px, 674px";

  if (post.files.length === 1) {
    const file = post.files[0];

    const placeholderURL = thumbhash.thumbHashToDataURL(
      Buffer.from(file.thumbHash, "base64"),
    );

    return (
      <div
        style={{
          backgroundImage: `url(${placeholderURL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className={cn("relative h-96 overflow-hidden", {
          "brightness-[0.4]": showBlur,
        })}
      >
        {!showBlur && (
          <Image
            src={file.url}
            alt={file.name}
            fill
            sizes={imageSizes}
            placeholder="blur"
            blurDataURL={placeholderURL}
            className="object-contain backdrop-brightness-[0.4]"
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative flex flex-col justify-center overflow-hidden">
      <div className="flex items-center">
        {post.files.map((image, i) => {
          const placeholderURL = thumbhash.thumbHashToDataURL(
            Buffer.from(image.thumbHash, "base64"),
          );

          return (
            <div
              key={image.id}
              style={{
                backgroundImage: `url(${placeholderURL})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
              className={cn("relative order-2 h-96 min-w-full", {
                "order-1": currentIndex === i + 1,
                "brightness-[0.4]": showBlur,
              })}
            >
              {!showBlur && (
                <Image
                  src={image.url}
                  alt={image.name}
                  fill
                  sizes={imageSizes}
                  placeholder="blur"
                  blurDataURL={placeholderURL}
                  className="object object-contain backdrop-brightness-[0.4]"
                />
              )}
            </div>
          );
        })}
      </div>
      {!showBlur && (
        <>
          <Badge className="absolute right-4 top-4 rounded-full">
            {currentIndex}/{post.files.length}
          </Badge>

          <Button
            className="absolute left-8 rounded-full"
            size={"icon"}
            onClick={(e) => {
              e.stopPropagation();

              setCurrentIndex((prev) => {
                if (prev === 1) {
                  return post.files.length;
                }

                return prev - 1;
              });
            }}
          >
            <ChevronLeftIcon />
          </Button>

          <Button
            className="absolute right-8 rounded-full"
            size={"icon"}
            onClick={(e) => {
              e.stopPropagation();

              setCurrentIndex((prev) => {
                if (prev === post.files.length) {
                  return 1;
                }

                return prev + 1;
              });
            }}
          >
            <ChevronRightIcon />
          </Button>
        </>
      )}
    </div>
  );
}
