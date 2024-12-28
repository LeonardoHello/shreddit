import { useParams } from "next/navigation";

import { usePostContext } from "@/context/PostContext";

export default function PostContentText() {
  const { postId } = useParams();

  const state = usePostContext();

  // if post component is rendered in the post page
  if (postId) {
    return (
      <div
        className="prose prose-sm prose-zinc prose-invert max-w-none break-words"
        dangerouslySetInnerHTML={{ __html: state.text ?? "" }}
      />
    );
  }

  if (state.spoiler || state.nsfw) {
    return null;
  }

  return (
    <div className="relative max-h-72 overflow-hidden">
      <div
        className="prose prose-sm prose-zinc prose-invert max-w-none break-words"
        dangerouslySetInnerHTML={{ __html: state.text ?? "" }}
      />
      <div className="absolute top-0 h-full w-full bg-gradient-to-b from-transparent to-zinc-900" />
    </div>
  );
}
