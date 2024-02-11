import Image from "next/image";
import Link from "next/link";

import { auth } from "@clerk/nextjs";
import { ChartBarIcon } from "@heroicons/react/24/solid";

import FeedInput from "@/components/feed/FeedInput";
import FeedSort from "@/components/feed/FeedSort";
import PremiumButton from "@/components/feed/PremiumButton";
import ScrollToTop from "@/components/feed/ScrollToTop";
import PostsInfiniteQuery from "@/components/post/PostsInfiniteQuery";
import {
  getAllBestPosts,
  getAllControversialPosts,
  getAllHotPosts,
  getAllNewPosts,
} from "@/lib/api/getPosts/getAllPosts";
import { getUserById } from "@/lib/api/getUser";
import { type QueryInfo, SortPosts } from "@/lib/types";
import galaxy from "@/public/galaxy.jpg";

export const runtime = "edge";
export const preferredRegion = ["fra1"];

export default async function AllPage({
  params,
  searchParams,
}: {
  params: {};
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { userId } = auth();

  const { sort } = searchParams;

  let postsData;
  switch (sort) {
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
    input: { sort },
  };

  return (
    <main className="grid w-full max-w-5xl grow grid-flow-col grid-rows-[auto,1fr] gap-6 self-center p-2 py-4 lg:grid-cols-[2fr,1fr]">
      <div className="flex flex-col gap-2.5">
        {user && <FeedInput user={user} />}
        <FeedSort searchParams={searchParams} />
      </div>
      <PostsInfiniteQuery
        currentUserId={userId}
        initialPosts={{ posts, nextCursor }}
        queryInfo={queryInfo}
        params={params}
        searchParams={searchParams}
      />
      <div className="row-span-2 hidden flex-col gap-4 text-sm lg:flex">
        <PremiumButton />
        <div className="sticky top-16 flex flex-col gap-3 rounded border border-zinc-700/70 bg-zinc-900 p-3 pt-2">
          <Image
            src={galaxy}
            alt="galaxy"
            priority
            quality={10}
            className="absolute left-0 top-0 h-8 rounded-t object-cover object-bottom "
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
    </main>
  );
}
