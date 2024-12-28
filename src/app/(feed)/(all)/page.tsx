import Image from "next/image";
import Link from "next/link";

import { currentUser } from "@clerk/nextjs/server";
import { ChartBarIcon } from "@heroicons/react/24/solid";

import {
  getAllBestPosts,
  getAllControversialPosts,
  getAllHotPosts,
  getAllNewPosts,
} from "@/api/getPosts/getAllPosts";
import FeedAllPosts from "@/components/feed/FeedAllPosts";
import FeedEmpty from "@/components/feed/FeedEmpty";
import FeedInput from "@/components/feed/FeedInput";
import FeedSort from "@/components/feed/FeedSort";
import PremiumButton from "@/components/sidebar/PremiumButton";
import ScrollToTop from "@/components/sidebar/ScrollToTop";
import { PostSort, type QueryInfo } from "@/types";

export const runtime = "edge";
export const preferredRegion = ["fra1"];

export default async function AllPage(props: {
  searchParams: Promise<{ sort?: PostSort }>;
}) {
  const searchParamsPromise = props.searchParams;
  const userPromise = currentUser();

  const [searchParams, user] = await Promise.all([
    searchParamsPromise,
    userPromise,
  ]);

  let posts;
  switch (searchParams.sort) {
    case PostSort.HOT:
      posts = await getAllHotPosts.execute({
        currentUserId: user && user.id,
        offset: 0,
      });
      break;

    case PostSort.NEW:
      posts = await getAllNewPosts.execute({
        currentUserId: user && user.id,
        offset: 0,
      });
      break;

    case PostSort.CONTROVERSIAL:
      posts = await getAllControversialPosts.execute({
        currentUserId: user && user.id,
        offset: 0,
      });
      break;

    default:
      posts = await getAllBestPosts.execute({
        currentUserId: user && user.id,
        offset: 0,
      });
      break;
  }

  let nextCursor: QueryInfo<"getAllPosts">["input"]["cursor"] = undefined;
  if (posts.length === 10) {
    nextCursor = 10;
  }

  const queryInfo: QueryInfo<"getAllPosts"> = {
    procedure: "getAllPosts",
    input: { sort: searchParams.sort, currentUserId: user && user.id },
  };

  return (
    <div className="container mx-auto grid grid-cols-1 grid-rows-[auto,minmax(0,1fr)] gap-6 px-2 py-4 lg:grid-cols-[minmax(0,1fr),20rem] lg:pb-12 xl:max-w-6xl">
      <div className="flex flex-col gap-2.5">
        {user && (
          <FeedInput username={user.username} imageUrl={user.imageUrl} />
        )}
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
        <FeedEmpty params={{}} searchParams={searchParams} />
      ) : (
        <FeedAllPosts
          key={searchParams.sort}
          currentUserId={user && user.id}
          initialPosts={{ posts, nextCursor }}
          queryInfo={queryInfo}
        />
      )}
    </div>
  );
}
