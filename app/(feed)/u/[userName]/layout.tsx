import Image from "next/image";
import { notFound } from "next/navigation";

import FeedSort from "@/components/FeedSort";
import UserCommunities from "@/components/UserCommunities";
import UserNavigation from "@/components/UserNavigation";
import { getUser } from "@/lib/api/getUser";
import getOnions from "@/lib/utils/getOnions";
import getRelativeTimeString from "@/lib/utils/getRelativeTimeString";
import cake from "@/public/cake.svg";
import dot from "@/public/dot.svg";
import onion from "@/public/onion.svg";
import userBackground from "@/public/userBackground.jpg";

export const runtime = "edge";

export default async function UserLayout({
  children,
  params: { userName },
}: {
  children: React.ReactNode;
  params: { userName: string };
}) {
  const user = await getUser.execute({
    userName,
  });

  if (user === undefined) return notFound();

  return (
    <main className="flex grow flex-col">
      <div className="flex justify-center border-b border-zinc-700/70 bg-zinc-900">
        <UserNavigation userName={userName} />
      </div>
      <div className="flex grow justify-center gap-6 p-2 py-4 lg:w-full lg:max-w-5xl lg:self-center">
        <div className="flex basis-full flex-col gap-4 lg:basis-2/3">
          <FeedSort />
          {children}
        </div>
        <div className="hidden basis-1/3 text-sm lg:flex lg:flex-col lg:gap-4">
          <div className="relative flex flex-col gap-3 rounded border border-zinc-700/70 bg-zinc-900 p-3 pt-2">
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
              <h1 className="text-nowrap max-w-[302px] break-words text-center text-2xl">
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
          </div>
          <UserCommunities communities={user.communities} />
        </div>
      </div>
    </main>
  );
}
