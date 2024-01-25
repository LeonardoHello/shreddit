import { notFound, permanentRedirect } from "next/navigation";

import { auth } from "@clerk/nextjs";

import CommunityCreate from "@/components/community/CommunityCreate";
import PostsInfiniteQuery from "@/components/post/PostsInfiniteQuery";
import FeedSort from "@/components/shared/FeedSort";
import Modal from "@/components/shared/Modal";
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

  const user = await getUserByName
    .execute({
      userName,
    })
    .catch(() => {
      throw new Error("There was a problem with loading user information.");
    });

  if (user === undefined) notFound();

  const { userId } = auth();

  const { filter, sort } = searchParams;

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
      {searchParams.submit === "community" && (
        <Modal>
          <CommunityCreate />
        </Modal>
      )}
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
              params={params}
              searchParams={searchParams}
            />
          </div>
          <div className="hidden basis-1/3 text-sm lg:flex lg:flex-col lg:gap-4">
            <UserInfo user={user} />
            <ModeratedCommunities communities={user.communities} />
          </div>
        </div>
      </main>
    </>
  );
}
