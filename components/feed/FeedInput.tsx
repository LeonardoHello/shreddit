import Image from "next/image";
import Link from "next/link";

import { PhotoIcon } from "@heroicons/react/24/outline";

import { Community, User } from "@/lib/db/schema";

export default function InputSubmit({
  userImageUrl,
  userName,
  communityName,
}: {
  userImageUrl: User["imageUrl"];
  userName: User["name"] | null;
  communityName?: Community["name"];
}) {
  return (
    <div className="flex gap-2 rounded border border-zinc-700/70 bg-zinc-900 p-2">
      <Link href={`/u/${userName}`} className="rounded-full">
        <Image
          src={userImageUrl}
          alt="user image"
          width={38}
          height={38}
          className="rounded-full"
          priority
        />
      </Link>

      <Link
        href={{
          pathname: "/submit",
          ...(communityName && { query: { community: communityName } }),
        }}
        className="flex grow rounded"
      >
        <input
          readOnly
          className="min-w-0 grow rounded bg-zinc-400/10 px-4 py-[3px] text-sm outline-none ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-400/70 hover:bg-inherit hover:ring-zinc-300 focus:bg-inherit focus:ring-zinc-300"
          placeholder="Create Post"
        />
      </Link>

      <Link
        href={{
          pathname: "/submit",
          query: {
            submit: "media",
            ...(communityName && { community: communityName }),
          },
        }}
        className="rounded p-1.5 hover:bg-zinc-700/50"
      >
        <PhotoIcon className="h-7 w-7 self-center text-zinc-500" />
      </Link>
    </div>
  );
}
