import { memo } from "react";

import { Image as ImageExtension } from "@tiptap/extension-image";
import { generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { usePostContext } from "@/lib/context/PostContextProvider";

export default memo(function PostContent() {
  const { post } = usePostContext();

  if (post.text === null || post.spoiler || post.nsfw) return null;

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
});
