import Image from "next/image";
import Link from "next/link";

import { useCommentContext } from "@/context/CommentContext";
import useHydration from "@/hooks/useHydration";
import getRelativeTimeString from "@/utils/getRelativeTimeString";
import dot from "@public/dot.svg";

export default function CommentMetadata() {
  const hydrated = useHydration();
  const state = useCommentContext();

  return (
    <div className="flex items-center gap-1 text-xs">
      <Link href={`/u/${state.author.name}`} className="rounded-full">
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
        href={`/u/${state.author.name}`}
        className="font-medium hover:underline"
      >
        {state.author.name}
      </Link>

      {state.authorId === state.post.authorId && (
        <div className="font-bold uppercase text-blue-500">op</div>
      )}
      <Image src={dot} alt="dot" height={2} width={2} />

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
              <Image src={dot} alt="dot" height={2} width={2} />
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
