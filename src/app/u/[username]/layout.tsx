import { Suspense } from "react";

import UserHeader from "@/components/user/UserHeader";
import UserHeaderSkeleton from "@/components/user/UserHeaderSkeleton";
import UserSidebar from "@/components/user/UserSidebar";
import UserSidebarSkeleton from "@/components/user/UserSidebarSkeleton";
import { HydrateClient, trpc } from "@/trpc/server";

export default async function UserLayout(props: {
  children: React.ReactNode;
  params: Promise<{ username: string; sort: string }>;
}) {
  const params = await props.params;

  void trpc.user.getUserByName.prefetch(params.username);

  return (
    <div className="container flex grow flex-col gap-4 p-2 pb-6 xl:max-w-[992px] 2xl:max-w-[1080px]">
      <HydrateClient>
        <div className="order-2 flex justify-center gap-4">
          {props.children}

          <Suspense fallback={<UserSidebarSkeleton />}>
            <UserSidebar username={params.username} />
          </Suspense>
        </div>

        <Suspense fallback={<UserHeaderSkeleton />}>
          <UserHeader username={params.username} />
        </Suspense>
      </HydrateClient>
    </div>
  );
}
