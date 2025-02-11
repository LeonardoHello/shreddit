import { Suspense } from "react";

import { auth } from "@clerk/nextjs/server";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { HydrateClient, trpc } from "@/trpc/server";
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

  if (userId) {
    void trpc.community.getModeratedCommunities.prefetch();
    void trpc.community.getJoinedCommunities.prefetch();
    void trpc.community.getMutedCommunities.prefetch();
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
            <HydrateClient>
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
            </HydrateClient>
          )}
        </Accordion>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
