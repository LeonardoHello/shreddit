import Image from "next/image";
import Link from "next/link";

import { useCommentContext } from "@/context/CommentContext";
import useHydration from "@/hooks/useHydration";
import getRelativeTimeString from "@/utils/getRelativeTimeString";

export default function CommentHeader() {
  const hydrated = useHydration();
  const state = useCommentContext();

  return (
    <div className="flex items-center gap-2">
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

      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Link
          href={`/u/${state.author.username}`}
          className="break-all font-extrabold hover:underline"
        >
          {state.author.username}
        </Link>

        {state.authorId === state.post.authorId && (
          <div className="font-bold uppercase text-blue-500">op</div>
        )}

        <span>•</span>

        {hydrated ? (
          <>
            <time
              dateTime={state.createdAt.toISOString()}
              title={state.createdAt.toLocaleDateString("hr-HR")}
            >
              {getRelativeTimeString(state.createdAt)}
            </time>
            {state.updatedAt > state.createdAt && (
              <>
                <span>•</span>
                <time
                  dateTime={state.updatedAt.toISOString()}
                  title={state.updatedAt.toLocaleDateString("hr-HR")}
                  className="italic"
                >
                  edited {getRelativeTimeString(state.updatedAt)}
                </time>
              </>
            )}
          </>
        ) : (
          <span>Calculating...</span>
        )}
      </div>
    </div>
  );
}
