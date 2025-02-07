import UserHeader from "@/components/user/UserHeader";
import UserSidebar from "@/components/user/UserSidebar";
import { HydrateClient, trpc } from "@/trpc/server";
import { PostSort } from "@/types";

export default async function UserLayout(props: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  const params = await props.params;

  void trpc.user.getUserByName.prefetch(params.username);
  void trpc.postFeed.getUserPosts.prefetchInfinite({
    sort: PostSort.BEST,
    username: params.username,
  });

  return (
    <main className="container flex grow flex-col gap-4 p-2 pb-6 xl:max-w-[992px] 2xl:max-w-[1080px]">
      <HydrateClient>
        <UserHeader username={params.username} />

        <div className="flex justify-center gap-4">
          {props.children}

          <UserSidebar username={params.username} />
        </div>
      </HydrateClient>
    </main>
  );
}
