import { useCommentContext } from "@/context/CommentContext";
import type { Comment } from "@/db/schema/comments";
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
          <CommentHeaderDate
            createdAt={state.createdAt}
            updatedAt={state.updatedAt}
          />
        ) : (
          <span>Calculating...</span>
        )}
      </div>
    </div>
  );
}

function CommentHeaderDate({
  createdAt,
  updatedAt,
}: Pick<Comment, "createdAt" | "updatedAt">) {
  const createdAtDate = new Date(createdAt);
  const updatedAtDate = new Date(updatedAt);

  if (createdAt === updatedAt) {
    return (
      <time
        dateTime={createdAt}
        title={createdAtDate.toLocaleString("hr-HR", {
          dateStyle: "full",
          timeStyle: "long",
        })}
      >
        {getRelativeTimeString(createdAtDate)}
      </time>
    );
  }

  return (
    <>
      <time
        dateTime={createdAt}
        title={createdAtDate.toLocaleString("hr-HR", {
          dateStyle: "full",
          timeStyle: "long",
        })}
      >
        {getRelativeTimeString(createdAtDate)}
      </time>
      <span>•</span>
      <time
        dateTime={createdAt}
        title={updatedAtDate.toLocaleString("hr-HR", {
          dateStyle: "full",
          timeStyle: "long",
        })}
        className="italic"
      >
        {getRelativeTimeString(updatedAtDate)}
      </time>
    </>
  );
}
