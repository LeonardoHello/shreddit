import { notFound, permanentRedirect } from "next/navigation";

import { auth } from "@clerk/nextjs/server";

import { getUserByName } from "@/api/getUser";
import FeedEmpty from "@/components/feed/FeedEmpty";
import FeedSort from "@/components/feed/FeedSort";
import FeedUserPosts from "@/components/feed/FeedUserPosts";
import ScrollToTop from "@/components/sidebar/ScrollToTop";
import ModeratedCommunities from "@/components/user/ModeratedCommunities";
import UserInfo from "@/components/user/UserInfo";
import UserNavigation from "@/components/user/UserNavigation";
import type { PostFilter, PostSort, QueryInfo } from "@/types";
import getUserPosts from "@/utils/getUserPosts";

export const runtime = "edge";
export const preferredRegion = ["fra1"];

export default async function UserPage(props: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ sort?: PostSort; filter?: PostFilter }>;
}) {
  const paramsPromise = props.params;
  const searchParamsPromise = props.searchParams;
  const currentAuthPromise = auth();

  const [params, searchParams, currentAuth] = await Promise.all([
    paramsPromise,
    searchParamsPromise,
    currentAuthPromise,
  ]);

  const user = await getUserByName.execute({
    username: params.username,
  });

  if (user === undefined) notFound();

  if (user.id !== currentAuth.userId && searchParams.filter === "hidden")
    permanentRedirect(`/u/${params.username}`);

  const posts = await getUserPosts({
    currentUserId: currentAuth.userId,
    userId: user.id,
    username: params.username,
    filter: searchParams.filter,
    sort: searchParams.sort,
  });

  let nextCursor: QueryInfo<"getUserPosts">["input"]["cursor"] = undefined;
  if (posts.length === 10) {
    nextCursor = 10;
  }

  const queryInfo: QueryInfo<"getUserPosts"> = {
    procedure: "getUserPosts",
    input: {
      currentUserId: currentAuth.userId,
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
        isCurrentUser={user.id === currentAuth.userId}
        searchParams={searchParams}
      />

      <div className="container mx-auto grid grid-cols-1 grid-rows-[auto,minmax(0,1fr)] gap-6 px-2 py-4 lg:grid-cols-[minmax(0,1fr),20rem] lg:pb-12 xl:max-w-6xl">
        <div className="flex flex-col gap-2.5">
          <FeedSort searchParams={searchParams} />
        </div>

        <div className="row-span-2 hidden max-w-80 flex-col gap-4 text-sm lg:flex">
          <UserInfo user={user} />
          <ModeratedCommunities communities={user.communities} />
          <ScrollToTop />
        </div>

        {posts.length === 0 ? (
          <FeedEmpty params={params} searchParams={searchParams} />
        ) : (
          <FeedUserPosts
            key={searchParams.sort}
            currentUserId={currentAuth.userId}
            initialPosts={{ posts, nextCursor }}
            queryInfo={queryInfo}
            username={params.username}
            filter={searchParams.filter}
          />
        )}
      </div>
    </>
  );
}
