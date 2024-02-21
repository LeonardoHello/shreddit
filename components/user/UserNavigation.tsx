import Link from "next/link";

import cn from "@/lib/utils/cn";

export default function UserNavigation({
  userName,
  filter,
  isCurrentUser,
}: {
  userName: string;
  isCurrentUser: boolean;
  filter?: string | string[] | undefined;
}) {
  const defaultNav = !(
    filter === "saved" ||
    filter === "hidden" ||
    filter === "upvoted" ||
    filter === "downvoted"
  );

  const href = `/u/${userName}`;

  return (
    <div className="flex justify-center border-b border-zinc-700/70 bg-zinc-900">
      <div className="flex w-[72rem] flex-wrap gap-x-6 gap-y-2 px-2 py-2.5 text-sm font-medium uppercase">
        <Link
          href={href}
          className={cn("border-b-2 border-transparent", {
            "border-zinc-300": defaultNav,
            "hover:border-zinc-300/40": !defaultNav,
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
