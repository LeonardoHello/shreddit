import Image from "next/image";
import Link from "next/link";

import { auth } from "@clerk/nextjs";
import { ChartBarIcon } from "@heroicons/react/24/solid";

import CommunityCreate from "@/components/CommunityCreate";
import FeedSort from "@/components/FeedSort";
import Modal from "@/components/Modal";
import PostsInfiniteQuery from "@/components/PostsInfiniteQuery";
import Premium from "@/components/Premium";
import {
  getAllBestPosts,
  getAllControversialPosts,
  getAllHotPosts,
  getAllNewPosts,
} from "@/lib/api/getPosts/getAllPosts";
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

  let posts;
  switch (sort) {
    case SortPosts.HOT:
      posts = await getAllHotPosts.execute({
        offset: 0,
      });
      break;

    case SortPosts.NEW:
      posts = await getAllNewPosts.execute({
        offset: 0,
      });
      break;

    case SortPosts.CONTROVERSIAL:
      posts = await getAllControversialPosts.execute({
        offset: 0,
      });
      break;

    default:
      posts = await getAllBestPosts.execute({
        offset: 0,
      });
      break;
  }

  let nextCursor: QueryInfo<"getAllPosts">["input"]["cursor"] = null;
  if (posts.length === 10) {
    nextCursor = 10;
  }

  const queryInfo: QueryInfo<"getAllPosts"> = {
    procedure: "getAllPosts",
    input: { sort },
  };

  return (
    <>
      {searchParams.submit === "community" && (
        <Modal>
          <CommunityCreate />
        </Modal>
      )}
      <main className="flex grow justify-center gap-6 p-2 py-4 lg:w-full lg:max-w-5xl lg:self-center">
        <div className="flex basis-full flex-col gap-4 lg:basis-2/3">
          <FeedSort />
          <PostsInfiniteQuery<"getAllPosts">
            currentUserId={userId}
            initialPosts={{ posts, nextCursor }}
            queryInfo={queryInfo}
            params={params}
            searchParams={searchParams}
          />
        </div>
        <div className="hidden basis-1/3 text-sm lg:flex lg:flex-col lg:gap-4">
          <Premium />
          <div className="relative flex flex-col gap-3 rounded border border-zinc-700/70 bg-zinc-900 p-3 pt-2">
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
        </div>
      </main>
    </>
  );
}
