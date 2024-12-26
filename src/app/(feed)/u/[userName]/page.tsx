import { notFound, permanentRedirect } from "next/navigation";

import { auth } from "@clerk/nextjs/server";

import { getUserByName } from "@/api/getUser";
import FeedInput from "@/components/feed/FeedInput";
import FeedSort from "@/components/feed/FeedSort";
import ScrollToTop from "@/components/feed/ScrollToTop";
import InfiniteQueryPostsEmpty from "@/components/infiniteQuery/InfiniteQueryPostsEmpty";
import InfiniteQueryUserPosts from "@/components/infiniteQuery/InfiniteQueryUserPosts";
import ModeratedCommunities from "@/components/user/ModeratedCommunities";
import UserInfo from "@/components/user/UserInfo";
import UserNavigation from "@/components/user/UserNavigation";
import type { PostFilter, PostSort, QueryInfo } from "@/types";
import getUserPosts from "@/utils/getUserPosts";

export const runtime = "edge";
export const preferredRegion = ["fra1"];

export default async function UserPage(props: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ sort: PostSort; filter: PostFilter }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const user = await getUserByName
    .execute({
      username: params.username,
    })
    .catch((err) => {
      throw new Error(err);
    });

  if (user === undefined) notFound();

  const { userId } = await auth();

  if (user.id !== userId && searchParams.filter === "hidden")
    permanentRedirect(`/u/${params.username}`);

  const posts = await getUserPosts({
    currentUserId: userId,
    userId: user.id,
    username: params.username,
    filter: searchParams.filter,
    sort: searchParams.sort,
  }).catch((err) => {
    throw new Error(err);
  });

  let nextCursor: QueryInfo<"getUserPosts">["input"]["cursor"] = undefined;
  if (posts.length === 10) {
    nextCursor = 10;
  }

  const queryInfo: QueryInfo<"getUserPosts"> = {
    procedure: "getUserPosts",
    input: {
      currentUserId: userId,
      userId: user.id,
      username: params.username,
      filter: searchParams.filter,
      sort: searchParams.sort,
    },
  };

  return (
    <>
      <UserNavigation
        username={params.username}
        filter={searchParams.filter}
        isCurrentUser={user.id === userId}
      />

      <div className="container mx-auto grid grid-cols-1 grid-rows-[auto,minmax(0,1fr)] gap-6 px-2 py-4 lg:grid-cols-[minmax(0,1fr),20rem] lg:pb-12 xl:max-w-6xl">
        <div className="flex flex-col gap-2.5">
          {user.id === userId && <FeedInput user={user} />}
          <FeedSort searchParams={searchParams} />
        </div>

        <div className="row-span-2 hidden max-w-80 flex-col gap-4 text-sm lg:flex">
          <UserInfo user={user} />
          <ModeratedCommunities communities={user.communities} />
          <ScrollToTop />
        </div>

        {posts.length === 0 ? (
          <InfiniteQueryPostsEmpty
            params={params}
            searchParams={searchParams}
          />
        ) : (
          <InfiniteQueryUserPosts
            key={searchParams.sort}
            currentUserId={userId}
            initialPosts={{ posts, nextCursor }}
            queryInfo={queryInfo}
          />
        )}
      </div>
    </>
  );
}
