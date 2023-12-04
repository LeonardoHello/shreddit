import { memo } from "react";

import Image from "@tiptap/extension-image";
import { generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import type { RouterOutput } from "@/trpc/procedures";
import type { ArrElement } from "@/types";

import ImageSlider from "./ImageSlider";

export default memo(function PostContent({
  post,
}: {
  post: ArrElement<RouterOutput["joinedCommunitiesPosts"]["posts"]>;
}) {
  if (post.text === null && post.files.length === 0) {
    return null;
  }

  if (post.text) {
    if (post.spoiler || post.nsfw) return null;

    const json = JSON.parse(post.text);
    const output = generateHTML(json, [StarterKit, Image]);

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
      <ImageSlider
        images={post.files}
        spoiler={post.spoiler}
        nsfw={post.nsfw}
      />
    );
  }
});
