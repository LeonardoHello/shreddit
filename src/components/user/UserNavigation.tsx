import Link from "next/link";

import { PostFilter } from "@/types";
import cn from "@/utils/cn";

export default function UserNavigation({
  username,
  isCurrentUser,
  searchParams,
}: {
  username: string;
  isCurrentUser: boolean;
  searchParams: { filter?: PostFilter };
}) {
  const { filter } = searchParams;

  const defaultNavigation = !(
    filter && Object.values(PostFilter).includes(filter)
  );

  const href = `/u/${username}`;

  return (
    <div className="flex justify-center border-b border-zinc-700/70 bg-zinc-900">
      <div className="flex w-[72rem] flex-wrap gap-x-6 gap-y-2 px-2 py-2.5 text-sm font-medium uppercase">
        <Link
          href={href}
          className={cn("border-b-2 border-transparent", {
            "border-zinc-300": defaultNavigation,
            "hover:border-zinc-300/40": !defaultNavigation,
          })}
        >
          overview
        </Link>
        <Link
          href={{ href, query: { filter: "saved" } }}
          className={cn("border-b-2 border-transparent", {
            "border-zinc-300": filter === "saved",
            "hover:border-zinc-300/40": filter !== "saved",
          })}
        >
          saved
        </Link>
        {isCurrentUser && (
          <Link
            href={{ href, query: { filter: "hidden" } }}
            className={cn("border-b-2 border-transparent", {
              "border-zinc-300": filter === "hidden",
              "hover:border-zinc-300/40": filter !== "hidden",
            })}
          >
            hidden
          </Link>
        )}
        <Link
          href={{ href, query: { filter: "upvoted" } }}
          className={cn("border-b-2 border-transparent", {
            "border-zinc-300": filter === "upvoted",
            "hover:border-zinc-300/40": filter !== "upvoted",
          })}
        >
          upvoted
        </Link>
        <Link
          href={{ href, query: { filter: "downvoted" } }}
          className={cn("border-b-2 border-transparent", {
            "border-zinc-300": filter === "downvoted",
            "hover:border-zinc-300/40": filter !== "downvoted",
          })}
        >
          downvoted
        </Link>
      </div>
    </div>
  );
}
