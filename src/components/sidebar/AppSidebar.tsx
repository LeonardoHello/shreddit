import { Suspense } from "react";

import { auth } from "@clerk/nextjs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { getQueryClient, trpc } from "@/trpc/server";
import { Accordion } from "../ui/accordion";
import SidebarLogo from "./SidebarLogo";
import SidebarNavJoined from "./SidebarNavJoined";
import SidebarMenuMain from "./SidebarNavMain";
import SidebarNavModerated from "./SidebarNavModerated";
import SidebarNavMuted from "./SidebarNavMuted";
import SidebarNavRecent from "./SidebarNavRecent";
import SidebarNavSkeleton from "./SidebarNavSkeleton";

export async function AppSidebar() {
  const { userId } = await auth();

  const queryClient = getQueryClient();

  if (userId) {
    void queryClient.prefetchQuery(
      trpc.community.getModeratedCommunities.queryOptions(),
    );
    void queryClient.prefetchQuery(
      trpc.community.getJoinedCommunities.queryOptions(),
    );
    void queryClient.prefetchQuery(
      trpc.community.getMutedCommunities.queryOptions(),
    );
  }

  return (
    <Sidebar className="z-20">
      <SidebarHeader>
        <SidebarLogo />
        <SidebarMenuMain isSignedIn={!!userId} />
      </SidebarHeader>

      <SidebarSeparator />
      <SidebarContent
        style={{
          scrollbarWidth: "thin",
          colorScheme: "dark",
          scrollbarColor: "hsl(var(--muted-foreground)/0.4) transparent",
        }}
      >
        <Accordion
          type="multiple"
          defaultValue={["recent", "moderated", "joined"]}
        >
          <SidebarNavRecent />

          <SidebarSeparator />

          {userId && (
            <HydrationBoundary state={dehydrate(queryClient)}>
              <Suspense
                fallback={<SidebarNavSkeleton length={2} canFavorite />}
              >
                <SidebarNavModerated />
              </Suspense>

              <SidebarSeparator />

              <Suspense
                fallback={<SidebarNavSkeleton length={4} canFavorite />}
              >
                <SidebarNavJoined />
              </Suspense>

              <SidebarSeparator />

              <Suspense
                fallback={<SidebarNavSkeleton length={3} canFavorite />}
              >
                <SidebarNavMuted />
              </Suspense>

              <SidebarSeparator />
            </HydrationBoundary>
          )}
        </Accordion>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
