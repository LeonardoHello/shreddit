import Image from "next/image";
import Link from "next/link";

import { Dot } from "lucide-react";

import { useCommentContext } from "@/context/CommentContext";
import useHydration from "@/hooks/useHydration";
import getRelativeTimeString from "@/utils/getRelativeTimeString";

export default function CommentMetadata() {
  const hydrated = useHydration();
  const state = useCommentContext();

  return (
    <div className="flex items-center gap-1 text-xs">
      <Link href={`/u/${state.author.username}`} className="rounded-full">
        <Image
          src={state.author.imageUrl}
          alt="user background"
          priority
          width={28}
          height={28}
          className="rounded-full"
        />
      </Link>
      <Link
        href={`/u/${state.author.username}`}
        className="font-medium hover:underline"
      >
        {state.author.username}
      </Link>

      {state.authorId === state.post.authorId && (
        <div className="font-bold uppercase text-blue-500">op</div>
      )}
      <Dot className="size-0.5" />

      {hydrated ? (
        <>
          <time
            dateTime={state.createdAt.toISOString()}
            title={state.createdAt.toLocaleDateString("hr-HR")}
            className="text-zinc-500"
          >
            {getRelativeTimeString(state.createdAt)}
          </time>
          {state.updatedAt > state.createdAt && (
            <>
              <Dot className="size-0.5" />
              <time
                dateTime={state.updatedAt.toISOString()}
                title={state.updatedAt.toLocaleDateString("hr-HR")}
                className="italic text-zinc-500"
              >
                edited {getRelativeTimeString(state.updatedAt)}
              </time>
            </>
          )}
        </>
      ) : (
        <span className="text-zinc-500">Calculating...</span>
      )}
    </div>
  );
}
