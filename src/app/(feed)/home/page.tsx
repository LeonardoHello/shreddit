import Image from "next/image";
import Link from "next/link";

import { auth } from "@clerk/nextjs/server";
import { HomeIcon } from "@heroicons/react/24/solid";

import FeedEmpty from "@/components/feed/FeedEmpty";
import FeedHomePosts from "@/components/feed/FeedHomePosts";
import FeedSort from "@/components/feed/FeedSort";
import PremiumButton from "@/components/sidebar/PremiumButton";
import ScrollToTop from "@/components/sidebar/ScrollToTop";
import { trpc } from "@/trpc/server";
import { PostSort, type QueryInfo } from "@/types";

export const runtime = "edge";
export const preferredRegion = ["fra1"];

export default async function HomePage(props: {
  searchParams: Promise<{ sort?: PostSort }>;
}) {
  const searchParamsPromise = props.searchParams;
  const authPromise = auth();

  const [searchParams, { userId }] = await Promise.all([
    searchParamsPromise,
    authPromise,
  ]);

  if (userId === null) throw new Error("Could not load home page information.");

  const infiniteQueryPosts = await trpc.postFeed.getHomePosts({
    sort: searchParams.sort,
  });

  const queryInfo: QueryInfo<"getHomePosts"> = {
    procedure: "getHomePosts",
    input: { cursor: infiniteQueryPosts.nextCursor, sort: searchParams.sort },
  };

  return (
    <div className="container mx-auto grid grid-cols-1 grid-rows-[auto,minmax(0,1fr)] gap-6 px-2 py-4 lg:grid-cols-[minmax(0,1fr),20rem] lg:pb-12 xl:max-w-6xl">
      <div className="flex flex-col gap-2.5">
        <FeedSort />
      </div>

      <div className="row-span-2 hidden max-w-80 flex-col gap-4 text-sm lg:flex">
        <PremiumButton />
        <div className="sticky top-4 flex flex-col gap-3 rounded border border-zinc-700/70 bg-zinc-900 p-3 pt-2">
          <Image
            src="https://www.redditstatic.com/desktop2x/img/id-cards/home-banner@2x.png"
            alt="home banner"
            priority
            width={624}
            height={68}
            className="absolute left-0 top-0 h-8 rounded-t object-cover"
          />
          <div className="z-10 mt-4 flex items-center gap-2">
            <HomeIcon className="h-7 w-7" />
            <h1>Home</h1>
          </div>
          <p className="text-sm">
            Your personal Shreddit frontpage. Come here to check in with your
            favorite communities.
          </p>
          <hr className="border-zinc-700/70" />
          <Link href="/submit" className="rounded-full">
            <button className="w-full rounded-full bg-zinc-300 p-1.5 text-sm font-bold text-zinc-900 transition-colors hover:bg-zinc-400">
              Create Post
            </button>
          </Link>
          <Link
            href={{ query: { submit: "community" } }}
            scroll={false}
            className="rounded-full"
          >
            <button className="w-full rounded-full border border-zinc-300 p-1.5 text-sm font-bold text-zinc-300 transition-colors hover:bg-zinc-800">
              Create Community
            </button>
          </Link>
        </div>
        <ScrollToTop />
      </div>

      {infiniteQueryPosts.posts.length === 0 ? (
        <FeedEmpty params={{}} />
      ) : (
        <FeedHomePosts
          key={searchParams.sort}
          currentUserId={userId}
          initialPosts={infiniteQueryPosts}
          queryInfo={queryInfo}
        />
      )}
    </div>
  );
}
