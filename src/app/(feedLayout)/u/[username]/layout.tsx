import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import UserHeader from "@/components/user/UserHeader";
import UserSidebar from "@/components/user/UserSidebar";
import { getQueryClient, trpc } from "@/trpc/server";

export default async function UserLayout(props: {
  children: React.ReactNode;
  params: Promise<{ username: string; sort: string }>;
}) {
  const params = await props.params;

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.user.getUserByName.queryOptions(params.username),
  );

  return (
    <div className="container flex grow flex-col gap-4 p-2 pb-6 lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UserHeader username={params.username} />

        <div className="flex justify-center gap-4">
          {props.children}

          <UserSidebar username={params.username} />
        </div>
      </HydrationBoundary>
    </div>
  );
}
