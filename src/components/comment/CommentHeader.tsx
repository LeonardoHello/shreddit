import { useCommentContext } from "@/context/CommentContext";
import { UserSchema } from "@/db/schema/users";
import useHydration from "@/hooks/useHydration";
import getRelativeTimeString from "@/utils/getRelativeTimeString";
import defaultUserImage from "@public/defaultUserImage.png";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { HoverPrefetchLink } from "../ui/hover-prefetch-link";

export default function CommentHeader() {
  const hydrated = useHydration();
  const state = useCommentContext();

  const { success, data: username } = UserSchema.shape.username
    .unwrap()
    .safeParse(state.author.username);

  const createdAtDate = new Date(state.createdAt);
  const updatedAtDate = new Date(state.updatedAt);

  return (
    <div className="flex items-center gap-2">
      {success ? (
        <HoverPrefetchLink href={`/u/${username}`} className="rounded-full">
          <Avatar className="size-7">
            <AvatarImage src={state.author.image ?? defaultUserImage.src} />
            <AvatarFallback className="uppercase">
              {username.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </HoverPrefetchLink>
      ) : (
        <Avatar className="size-7">
          <AvatarImage src={state.author.image ?? defaultUserImage.src} />
          <AvatarFallback className="uppercase">
            {state.author.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      )}

      <div className="text-muted-foreground flex items-center gap-1 text-xs">
        {success ? (
          <HoverPrefetchLink
            href={`/u/${username}`}
            className="font-extrabold break-all hover:underline"
          >
            {username}
          </HoverPrefetchLink>
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
              dateTime={state.createdAt}
              title={createdAtDate.toLocaleDateString("hr-HR")}
            >
              {getRelativeTimeString(createdAtDate)}
            </time>
            {state.updatedAt > state.createdAt && (
              <>
                <span>•</span>
                <time
                  dateTime={state.updatedAt}
                  title={updatedAtDate.toLocaleDateString("hr-HR")}
                  className="italic"
                >
                  edited {getRelativeTimeString(updatedAtDate)}
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
