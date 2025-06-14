import Link from "next/link";

import { useCommentContext } from "@/context/CommentContext";
import useHydration from "@/hooks/useHydration";
import getRelativeTimeString from "@/utils/getRelativeTimeString";
import donkey from "@public/donkey.png";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function CommentHeader() {
  const hydrated = useHydration();
  const state = useCommentContext();

  return (
    <div className="flex items-center gap-2">
      <Link href={`/u/${state.author.username}`} className="rounded-full">
        <Avatar className="size-7">
          <AvatarImage src={state.author.image ?? donkey.src} />
          <AvatarFallback className="uppercase">
            {state.author.username?.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      </Link>

      <div className="text-muted-foreground flex items-center gap-1 text-xs">
        <Link
          href={`/u/${state.author.username}`}
          className="font-extrabold break-all hover:underline"
        >
          {state.author.username}
        </Link>

        {state.authorId === state.post.authorId && (
          <div className="font-bold text-blue-500 uppercase">op</div>
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
