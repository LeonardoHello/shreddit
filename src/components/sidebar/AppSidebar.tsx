import { Suspense } from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getSession } from "@/app/actions";
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
  const session = await getSession();

  const queryClient = getQueryClient();

  if (session) {
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
        <SidebarMenuMain isSignedIn={!!session} />
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

          {session && (
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
