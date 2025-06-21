import Link from "next/link";

import { useCommentContext } from "@/context/CommentContext";
import { UserSchema } from "@/db/schema/users";
import useHydration from "@/hooks/useHydration";
import getRelativeTimeString from "@/utils/getRelativeTimeString";
import donkey from "@public/donkey.png";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function CommentHeader() {
  const hydrated = useHydration();
  const state = useCommentContext();

  const { success, data: username } = UserSchema.shape.username
    .unwrap()
    .safeParse(state.author.username);

  return (
    <div className="flex items-center gap-2">
      {success ? (
        <Link href={`/u/${username}`} className="rounded-full">
          <Avatar className="size-7">
            <AvatarImage src={state.author.image ?? donkey.src} />
            <AvatarFallback className="uppercase">
              {username.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </Link>
      ) : (
        <Avatar className="size-7">
          <AvatarImage src={state.author.image ?? donkey.src} />
          <AvatarFallback className="uppercase">
            {state.author.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      )}

      <div className="text-muted-foreground flex items-center gap-1 text-xs">
        {success ? (
          <Link
            href={`/u/${username}`}
            className="font-extrabold break-all hover:underline"
          >
            {username}
          </Link>
        ) : (
          <div className="font-extrabold break-all hover:underline">
            {state.authorId.slice(0, 9)}
          </div>
        )}

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
