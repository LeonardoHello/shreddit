import { Suspense } from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { client } from "@/hono/client";
import { UserId } from "@/lib/auth";
import { getQueryClient } from "@/tanstack-query/getQueryClient";
import SidebarDialog from "./SidebarDialog";
import SidebarLogo from "./SidebarLogo";
import SidebarNavJoined from "./SidebarNavJoined";
import SidebarMenuMain from "./SidebarNavMain";
import SidebarNavModerated from "./SidebarNavModerated";
import SidebarNavMuted from "./SidebarNavMuted";
import SidebarNavRecent from "./SidebarNavRecent";
import SidebarNavSkeleton from "./SidebarNavSkeleton";

export async function AppSidebarAuth({
  currentUserId,
}: {
  currentUserId: NonNullable<UserId>;
}) {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["users", currentUserId, "communities", "moderated"],
    queryFn: async () => {
      const res = await client.users.me.communities.moderated.$get({
        query: { currentUserId },
      });
      return res.json();
    },
  });
  queryClient.prefetchQuery({
    queryKey: ["users", currentUserId, "communities", "joined"],
    queryFn: async () => {
      const res = await client.users.me.communities.joined.$get({
        query: { currentUserId },
      });
      return res.json();
    },
  });
  queryClient.prefetchQuery({
    queryKey: ["users", currentUserId, "communities", "muted"],
    queryFn: async () => {
      const res = await client.users.me.communities.muted.$get({
        query: { currentUserId },
      });
      return res.json();
    },
  });

  return (
    <Sidebar className="z-20">
      <SidebarHeader>
        <SidebarLogo />
        <SidebarMenuMain isSignedIn={true} />
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent
        style={{
          scrollbarWidth: "thin",
          colorScheme: "dark",
          scrollbarColor: "hsl(var(--muted-foreground)/0.4) transparent",
        }}
        className="gap-0"
      >
        <SidebarNavRecent />

        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<SidebarNavSkeleton itemCount={1} />}>
            <SidebarNavModerated currentUserId={currentUserId} />
          </Suspense>

          <Suspense fallback={<SidebarNavSkeleton itemCount={4} />}>
            <SidebarNavJoined currentUserId={currentUserId} />
          </Suspense>

          <Suspense fallback={<SidebarNavSkeleton itemCount={2} />}>
            <SidebarNavMuted currentUserId={currentUserId} />
          </Suspense>
        </HydrationBoundary>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarDialog currentUserId={currentUserId}>
              <SidebarMenuButton className="[&>svg]:size-7">
                <Plus className="stroke-[1.25]" />
                Create Community
              </SidebarMenuButton>
            </SidebarDialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
