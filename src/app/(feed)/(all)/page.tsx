import Image from "next/image";
import Link from "next/link";

import { auth } from "@clerk/nextjs/server";
import { ChartBarIcon } from "@heroicons/react/24/solid";

import {
  getAllBestPosts,
  getAllControversialPosts,
  getAllHotPosts,
  getAllNewPosts,
} from "@/api/getPosts/getAllPosts";
import { getUserById } from "@/api/getUser";
import FeedInput from "@/components/feed/FeedInput";
import FeedSort from "@/components/feed/FeedSort";
import PremiumButton from "@/components/feed/PremiumButton";
import ScrollToTop from "@/components/feed/ScrollToTop";
import InfiniteQueryAllPosts from "@/components/post/InfiniteQueryAllPosts";
import InfiniteQueryPostsEmpty from "@/components/post/InfiniteQueryPostsEmpty";
import { SortPosts, type QueryInfo } from "@/types";

export const runtime = "edge";
export const preferredRegion = ["fra1"];

export default async function AllPage(props: {
  searchParams: Promise<{ sort: SortPosts }>;
}) {
  const searchParams = await props.searchParams;

  const { userId } = await auth();

  let postsData;
  switch (searchParams.sort) {
    case SortPosts.HOT:
      postsData = getAllHotPosts.execute({
        offset: 0,
      });
      break;

    case SortPosts.NEW:
      postsData = getAllNewPosts.execute({
        offset: 0,
      });
      break;

    case SortPosts.CONTROVERSIAL:
      postsData = getAllControversialPosts.execute({
        offset: 0,
      });
      break;

    default:
      postsData = getAllBestPosts.execute({
        offset: 0,
      });
      break;
  }

  const userData = getUserById.execute({ currentUserId: userId });

  const [user, posts] = await Promise.all([userData, postsData]);

  let nextCursor: QueryInfo<"getAllPosts">["input"]["cursor"] = null;
  if (posts.length === 10) {
    nextCursor = 10;
  }

  const queryInfo: QueryInfo<"getAllPosts"> = {
    procedure: "getAllPosts",
    input: { sort: searchParams.sort },
  };

  return (
    <div className="container mx-auto grid grid-cols-1 grid-rows-[auto,minmax(0,1fr)] gap-6 px-2 py-4 lg:grid-cols-[minmax(0,1fr),20rem] lg:pb-12 xl:max-w-6xl">
      <div className="flex flex-col gap-2.5">
        {user && <FeedInput user={user} />}
        <FeedSort searchParams={searchParams} />
      </div>

      <div className="row-span-2 hidden max-w-80 flex-col gap-4 text-sm lg:flex">
        <PremiumButton />
        <div className="sticky top-4 flex flex-col gap-3 rounded border border-zinc-700/70 bg-zinc-900 p-3 pt-2">
          <Image
            src="https://www.redditstatic.com/desktop2x/img/id-cards/banner@2x.png"
            alt="banner"
            priority
            width={624}
            height={68}
            className="absolute left-0 top-0 h-8 rounded-t object-cover"
          />
          <div className="z-10 mt-4 flex items-center gap-2">
            <ChartBarIcon
              className="h-7 w-7 rounded-full bg-zinc-300 stroke-[3] p-0.5 text-zinc-900"
              width={20}
              height={20}
            />
            <h1>All</h1>
          </div>
          <p className="text-sm">
            The most active posts from all of Shreddit. Come here to see new
            posts rising and be a part of the conversation.
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

      {posts.length === 0 ? (
        <InfiniteQueryPostsEmpty params={{}} searchParams={searchParams} />
      ) : (
        <InfiniteQueryAllPosts
          currentUserId={userId}
          initialPosts={{ posts, nextCursor }}
          queryInfo={queryInfo}
        />
      )}
    </div>
  );
}
