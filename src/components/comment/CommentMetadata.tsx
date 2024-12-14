import Image from "next/image";
import Link from "next/link";

import { useCommentContext } from "@/context/CommentContextProvider";
import useHydration from "@/hooks/useHydration";
import getRelativeTimeString from "@/utils/getRelativeTimeString";
import dot from "@public/dot.svg";

export default function CommentMetadata() {
  const hydrated = useHydration();
  const { comment } = useCommentContext();

  return (
    <div className="flex items-center gap-1 text-xs">
      <Link href={`/u/${comment.author.name}`} className="rounded-full">
        <Image
          src={comment.author.imageUrl}
          alt="user background"
          priority
          width={28}
          height={28}
          className="rounded-full"
        />
      </Link>
      <Link
        href={`/u/${comment.author.name}`}
        className="font-medium hover:underline"
      >
        {comment.author.name}
      </Link>

      {comment.authorId === comment.post.authorId && (
        <div className="font-bold uppercase text-blue-500">op</div>
      )}
      <Image src={dot} alt="dot" height={2} width={2} />

      {hydrated ? (
        <>
          <time
            dateTime={comment.createdAt.toISOString()}
            title={comment.createdAt.toLocaleDateString("hr-HR")}
            className="text-zinc-500"
          >
            {getRelativeTimeString(comment.createdAt)}
          </time>
          {comment.updatedAt > comment.createdAt && (
            <>
              <Image src={dot} alt="dot" height={2} width={2} />
              <time
                dateTime={comment.updatedAt.toISOString()}
                title={comment.updatedAt.toLocaleDateString("hr-HR")}
                className="italic text-zinc-500"
              >
                edited {getRelativeTimeString(comment.updatedAt)}
              </time>
            </>
          )}
        </>
      ) : (
        <span className="text-zinc-500">Time in progress...</span>
      )}
    </div>
  );
}
