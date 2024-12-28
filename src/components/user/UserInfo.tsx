import Image from "next/image";
import Link from "next/link";

import type { getUserByName } from "@/api/getUser";
import getOnions from "@/utils/getOnions";
import getRelativeTimeString from "@/utils/getRelativeTimeString";
import cake from "@public/cake.svg";
import dot from "@public/dot.svg";
import onion from "@public/onion.svg";
import userBackground from "@public/userBackground.jpg";
import CommunityImage from "../community/CommunityImage";

type user = NonNullable<Awaited<ReturnType<typeof getUserByName.execute>>>;

export default function UserInfo({ user }: { user: user }) {
  return (
    <div className="sticky top-4 flex flex-col gap-3 scroll-auto rounded border border-zinc-700/70 bg-zinc-900 p-3 pt-2 shadow-lg shadow-zinc-950">
      <Image
        src={userBackground}
        alt="galaxy"
        priority
        quality={10}
        className="absolute left-0 top-0 h-24 rounded-t object-cover object-center"
      />
      <Image
        src={user.imageUrl}
        alt="user background"
        priority
        width={84}
        height={84}
        className="z-10 mt-8 self-center rounded-full"
      />
      <div className="flex flex-col items-center gap-0.5">
        <h1 className="max-w-[302px] text-nowrap break-words text-center text-2xl">
          {user.name}
        </h1>
        <h2 className="flex items-center gap-1 text-xs text-zinc-500">
          <span className="max-w-[10rem] break-words text-center">
            u/{user.name}
          </span>

          <Image src={dot} alt="dot" height={4} width={4} />
          <time
            dateTime={user.createdAt.toISOString()}
            title={user.createdAt.toLocaleDateString("hr-HR")}
          >
            {getRelativeTimeString(user.createdAt)}
          </time>
        </h2>
      </div>

      <hr className="border-zinc-700/70" />

      <div className="flex justify-between">
        <div className="space-y-1">
          <div className="font-medium">Onions</div>
          <div className="flex items-center gap-1">
            <Image src={onion} alt="onion" />
            <div className="text-xs text-zinc-500">
              {new Intl.NumberFormat("en-US", {
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(getOnions(user))}
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="font-medium">Cake day</div>
          <div className="flex items-center gap-1">
            <Image src={cake} alt="cake" />
            <div className="text-xs text-zinc-500">
              {user.createdAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
              })}
            </div>
          </div>
        </div>
        <div />
      </div>

      {user.communities.length > 0 && (
        <>
          <hr className="border-zinc-700/70" />
          <div>
            <h1 className="mb-4 max-w-[15rem] font-bold tracking-wide text-zinc-500">
              Moderator of these communities
            </h1>
            <div className="flex h-56 flex-col gap-3.5 overflow-y-scroll">
              {user.communities.map((community) => (
                <div key={community.id} className="flex items-center gap-1.5">
                  <CommunityImage imageUrl={community.imageUrl} size={32} />

                  <div className="truncate text-xs tracking-wide">
                    <Link
                      href={`/r/${community.name}`}
                      className="max-w-[15rem] cursor-pointer font-medium lowercase hover:underline"
                    >
                      r/{community.name}
                    </Link>
                    <div>
                      {new Intl.NumberFormat("en-US", {
                        notation: "compact",
                        maximumFractionDigits: 1,
                      }).format(community.usersToCommunities.length)}{" "}
                      {community.usersToCommunities.length === 1
                        ? "member"
                        : "members"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
