import { notFound, permanentRedirect } from "next/navigation";

import { auth } from "@clerk/nextjs";

import FeedSort from "@/components/FeedSort";
import Posts from "@/components/Posts";
import UserCommunities from "@/components/UserCommunities";
import UserInfo from "@/components/UserInfo";
import UserNavigation from "@/components/UserNavigation";
import { getUser } from "@/lib/api/getUser";
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
  const user = await getUser.execute({
    userName,
  });

  if (user === undefined) notFound();

  const { userId } = auth();

  const posts = await getUserPosts({ userId: user.id, userName, filter, sort });

  const isCurrentUser = user.id === userId;

  if (!isCurrentUser && filter === "hidden")
    permanentRedirect(`/u/${userName}`);

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
        isCurrentUser={isCurrentUser}
      />

      <div className="flex grow justify-center gap-6 p-2 py-4 lg:w-full lg:max-w-5xl lg:self-center">
        <div className="flex basis-full flex-col gap-4 lg:basis-2/3">
          <FeedSort />
          <Posts<"getUserPosts">
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
