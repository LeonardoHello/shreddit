import Image from "next/image";
import Link from "next/link";

import { auth } from "@clerk/nextjs";
import { HomeIcon } from "@heroicons/react/24/solid";

import CommunityCreate from "@/components/community/CommunityCreate";
import PostsInfiniteQuery from "@/components/post/PostsInfiniteQuery";
import FeedInput from "@/components/shared/FeedInput";
import FeedSort from "@/components/shared/FeedSort";
import Modal from "@/components/shared/Modal";
import PremiumButton from "@/components/shared/PremiumButton";
import {
  getHomeBestPosts,
  getHomeControversialPosts,
  getHomeHotPosts,
  getHomeNewPosts,
} from "@/lib/api/getPosts/getHomePosts";
import { getUserById } from "@/lib/api/getUser";
import { type QueryInfo, SortPosts } from "@/lib/types";
import home from "@/public/home.jpg";

export const runtime = "edge";
export const preferredRegion = ["fra1"];

export default async function HomePage({
  params,
  searchParams,
}: {
  params: {};
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { userId } = auth();

  if (userId === null) throw new Error("Could not load home page information.");

  const { sort } = searchParams;

  let postsData;
  switch (sort) {
    case SortPosts.HOT:
      postsData = getHomeHotPosts.execute({
        offset: 0,
        currentUserId: userId,
      });
      break;

    case SortPosts.NEW:
      postsData = getHomeNewPosts.execute({
        offset: 0,
        currentUserId: userId,
      });
      break;

    case SortPosts.CONTROVERSIAL:
      postsData = getHomeControversialPosts.execute({
        offset: 0,
        currentUserId: userId,
      });
      break;

    default:
      postsData = getHomeBestPosts.execute({
        offset: 0,
        currentUserId: userId,
      });
      break;
  }

  const userData = getUserById.execute({ currentUserId: userId });

  const [user, posts] = await Promise.all([userData, postsData]).catch(() => {
    throw new Error("There was a problem with loading user information.");
  });

  let nextCursor: QueryInfo<"getHomePosts">["input"]["cursor"] = null;
  if (posts.length === 10) {
    nextCursor = 10;
  }

  const queryInfo: QueryInfo<"getHomePosts"> = {
    procedure: "getHomePosts",
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
          {user && (
            <FeedInput userImageUrl={user.imageUrl} userName={user.name} />
          )}
          <FeedSort />
          <PostsInfiniteQuery<"getHomePosts">
            currentUserId={userId}
            initialPosts={{ posts, nextCursor }}
            queryInfo={queryInfo}
            params={params}
            searchParams={searchParams}
          />
        </div>
        <div className="hidden basis-1/3 text-sm lg:flex lg:flex-col lg:gap-4">
          <PremiumButton />
          <div className="relative flex flex-col gap-3 rounded border border-zinc-700/70 bg-zinc-900 p-3 pt-2">
            <Image
              src={home}
              alt="home"
              priority
              quality={10}
              className="absolute left-0 top-0 h-8 rounded-t object-cover object-center"
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
        </div>
      </main>
    </>
  );
}
