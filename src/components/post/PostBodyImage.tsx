import Image from "next/image";

import * as thumbhash from "thumbhash";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { usePostContext } from "@/context/PostContext";
import { ArrElement } from "@/types/helpers";
import { Badge } from "../ui/badge";

export default function PostBodyImage({ isUnsafe }: { isUnsafe: boolean }) {
  const post = usePostContext();

  if (post.files.length === 1) {
    const file = post.files[0];

    return <PostImage file={file} isUnsafe={isUnsafe} />;
  }

  return (
    <Carousel>
      <CarouselContent className="gap-4">
        {post.files.map((image) => (
          <CarouselItem key={image.id}>
            <PostImage file={image} isUnsafe={isUnsafe} />
          </CarouselItem>
        ))}
      </CarouselContent>
      {!isUnsafe && (
        <>
          <CarouselPrevious />
          <CarouselNext />
        </>
      )}
    </Carousel>
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
