import { notFound, permanentRedirect } from "next/navigation";

import { auth } from "@clerk/nextjs/server";

import { getUserByName } from "@/api/getUser";
import FeedInput from "@/components/feed/FeedInput";
import FeedSort from "@/components/feed/FeedSort";
import ScrollToTop from "@/components/feed/ScrollToTop";
import InfiniteQueryPostsEmpty from "@/components/post/InfiniteQueryPostsEmpty";
import InfiniteQueryUserPosts from "@/components/post/InfiniteQueryUserPosts";
import ModeratedCommunities from "@/components/user/ModeratedCommunities";
import UserInfo from "@/components/user/UserInfo";
import UserNavigation from "@/components/user/UserNavigation";
import type { FilterPosts, QueryInfo, SortPosts } from "@/types";
import getUserPosts from "@/utils/getUserPosts";

export const runtime = "edge";
export const preferredRegion = ["fra1"];

export default async function UserPage(props: {
  params: Promise<{ userName: string }>;
  searchParams: Promise<{ sort: SortPosts; filter: FilterPosts }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const user = await getUserByName
    .execute({
      userName: params.userName,
    })
    .catch(() => {
      throw new Error("There was a problem with loading user information.");
    });

  if (user === undefined) notFound();

  const { userId } = await auth();

  if (user.id !== userId && searchParams.filter === "hidden")
    permanentRedirect(`/u/${params.userName}`);

  const posts = await getUserPosts({
    userId: user.id,
    userName: params.userName,
    filter: searchParams.filter,
    sort: searchParams.sort,
  }).catch(() => {
    throw new Error("There was a problem with loading post information.");
  });

  let nextCursor: QueryInfo<"getUserPosts">["input"]["cursor"] = null;
  if (posts.length === 10) {
    nextCursor = 10;
  }

  const queryInfo: QueryInfo<"getUserPosts"> = {
    procedure: "getUserPosts",
    input: {
      userId: user.id,
      userName: params.userName,
      filter: searchParams.filter,
      sort: searchParams.sort,
    },
  };

  return (
    <>
      <UserNavigation
        userName={params.userName}
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
            currentUserId={userId}
            initialPosts={{ posts, nextCursor }}
            queryInfo={queryInfo}
            searchParams={searchParams}
          />
        )}
      </div>
    </>
  );
}
