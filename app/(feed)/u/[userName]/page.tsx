import { notFound, permanentRedirect } from "next/navigation";

import { auth } from "@clerk/nextjs";

import FeedInput from "@/components/feed/FeedInput";
import FeedSort from "@/components/feed/FeedSort";
import PostsInfiniteQuery from "@/components/post/PostsInfiniteQuery";
import ModeratedCommunities from "@/components/user/ModeratedCommunities";
import UserInfo from "@/components/user/UserInfo";
import UserNavigation from "@/components/user/UserNavigation";
import { getUserByName } from "@/lib/api/getUser";
import type { QueryInfo } from "@/lib/types";
import getUserPosts from "@/lib/utils/getUserPosts";

export const runtime = "edge";
export const preferredRegion = ["fra1"];

export default async function UserPage({
  params,
  searchParams,
}: {
  params: { userName: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { userName } = params;
  const { filter, sort } = searchParams;

  const user = await getUserByName
    .execute({
      userName,
    })
    .catch(() => {
      throw new Error("There was a problem with loading user information.");
    });

  if (user === undefined) notFound();

  const { userId } = auth();

  if (user.id !== userId && filter === "hidden")
    permanentRedirect(`/u/${userName}`);

  const posts = await getUserPosts({
    userId: user.id,
    userName,
    filter,
    sort,
  }).catch(() => {
    throw new Error("There was a problem with loading post information.");
  });

  let nextCursor: QueryInfo<"getUserPosts">["input"]["cursor"] = null;
  if (posts.length === 10) {
    nextCursor = 10;
  }

  const queryInfo: QueryInfo<"getUserPosts"> = {
    procedure: "getUserPosts",
    input: { userId: user.id, userName, filter, sort },
  };

  return (
    <>
      <UserNavigation
        userName={userName}
        filter={filter}
        isCurrentUser={user.id === userId}
      />

      <main className="grid w-full max-w-5xl grow grid-flow-col grid-rows-[auto,1fr] gap-6 self-center p-2 py-4 lg:grid-cols-[2fr,1fr]">
        <div className="flex flex-col gap-2.5">
          {user.id === userId && <FeedInput user={user} />}
          <FeedSort searchParams={searchParams} />
        </div>

        <PostsInfiniteQuery<"getUserPosts">
          currentUserId={userId}
          initialPosts={{ posts, nextCursor }}
          queryInfo={queryInfo}
          params={params}
          searchParams={searchParams}
        />
        <div className="row-span-2 hidden flex-col gap-4 text-sm lg:flex">
          <UserInfo user={user} />
          <ModeratedCommunities communities={user.communities} />
        </div>
      </main>
    </>
  );
}
