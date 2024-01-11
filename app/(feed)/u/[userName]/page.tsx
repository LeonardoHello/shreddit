import { notFound, permanentRedirect } from "next/navigation";

import { auth } from "@clerk/nextjs";

import FeedSort from "@/components/FeedSort";
import PostsInfiniteQuery from "@/components/PostsInfiniteQuery";
import UserCommunities from "@/components/UserCommunities";
import UserInfo from "@/components/UserInfo";
import UserNavigation from "@/components/UserNavigation";
import { getUserByName } from "@/lib/api/getUser";
import type { QueryInfo } from "@/lib/types";
import getUserPosts from "@/lib/utils/getUserPosts";

export const runtime = "edge";

export default async function UserPage({
  params: { userName },
  searchParams: { filter, sort },
}: {
  params: { userName: string };
  searchParams: { filter: string | undefined; sort: string | undefined };
}) {
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
    <main className="flex grow flex-col">
      <UserNavigation
        userName={userName}
        filter={filter}
        isCurrentUser={user.id === userId}
      />

      <div className="flex grow justify-center gap-6 p-2 py-4 lg:w-full lg:max-w-5xl lg:self-center">
        <div className="flex basis-full flex-col gap-4 lg:basis-2/3">
          <FeedSort />
          <PostsInfiniteQuery<"getUserPosts">
            currentUserId={userId}
            initialPosts={{ posts, nextCursor }}
            queryInfo={queryInfo}
          />
        </div>
        <div className="hidden basis-1/3 text-sm lg:flex lg:flex-col lg:gap-4">
          <UserInfo user={user} />
          <UserCommunities communities={user.communities} />
        </div>
      </div>
    </main>
  );
}
