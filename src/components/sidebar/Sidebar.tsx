import { Suspense } from "react";

import { auth } from "@clerk/nextjs/server";

import { Accordion } from "@/components/ui/accordion";
import { HydrateClient, trpc } from "@/trpc/server";
import SidebarNavJoined from "./SidebarNavJoined";
import SidebarNavMain from "./SidebarNavMain";
import SidebarNavModerated from "./SidebarNavModerated";
import SidebarNavMuted from "./SidebarNavMuted";
import SidebarNavRecent from "./SidebarNavRecent";
import SidebarNavSkeleton from "./SidebarNavSkeleton";

export default async function Sidebar({ isSheet }: { isSheet?: boolean }) {
  const { userId } = await auth();

  if (userId) {
    void trpc.community.getModeratedCommunities.prefetch();
    void trpc.community.getJoinedCommunities.prefetch();
    void trpc.community.getMutedCommunities.prefetch();
  }

  return (
    <div
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "hsl(var(--muted-foreground)/0.4) transparent",
      }}
      className={
        !isSheet
          ? "sticky top-14 hidden h-[calc(100vh-3.5rem)] w-72 min-w-72 gap-3 overflow-y-auto border-r bg-card p-4 xl:block"
          : undefined
      }
    >
      <SidebarNavMain userId={userId} />

      <Accordion type="multiple" defaultValue={["item-1", "item-2", "item-3"]}>
        <SidebarNavRecent />

        {userId && (
          <>
            <HydrateClient>
              <Suspense
                fallback={<SidebarNavSkeleton length={2} canFavorite />}
              >
                <SidebarNavModerated />
              </Suspense>
            </HydrateClient>

            <HydrateClient>
              <Suspense
                fallback={<SidebarNavSkeleton length={4} canFavorite />}
              >
                <SidebarNavJoined />
              </Suspense>
            </HydrateClient>

            <HydrateClient>
              <Suspense fallback={<SidebarNavSkeleton length={3} />}>
                <SidebarNavMuted />
              </Suspense>
            </HydrateClient>
          </>
        )}
      </Accordion>
    </div>
  );
}
