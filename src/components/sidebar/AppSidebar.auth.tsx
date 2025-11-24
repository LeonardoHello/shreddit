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
import { getQueryClient } from "@/tanstack-query/getQueryClient";
import SidebarDialog from "./SidebarDialog";
import SidebarLogo from "./SidebarLogo";
import SidebarNavJoined from "./SidebarNavJoined";
import SidebarMenuMain from "./SidebarNavMain";
import SidebarNavModerated from "./SidebarNavModerated";
import SidebarNavMuted from "./SidebarNavMuted";
import SidebarNavRecent from "./SidebarNavRecent";
import SidebarNavSkeleton from "./SidebarNavSkeleton";

export function AppSidebarAuth() {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["users", "me", "communities", "moderated"],
    queryFn: async () => {
      const res = await client.users.me.communities.moderated.$get();
      return res.json();
    },
  });
  queryClient.prefetchQuery({
    queryKey: ["users", "me", "communities", "joined"],
    queryFn: async () => {
      const res = await client.users.me.communities.joined.$get();
      return res.json();
    },
  });
  queryClient.prefetchQuery({
    queryKey: ["users", "me", "communities", "muted"],
    queryFn: async () => {
      const res = await client.users.me.communities.muted.$get();
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
            <SidebarNavModerated />
          </Suspense>

          <Suspense fallback={<SidebarNavSkeleton itemCount={4} />}>
            <SidebarNavJoined />
          </Suspense>

          <Suspense fallback={<SidebarNavSkeleton itemCount={2} />}>
            <SidebarNavMuted />
          </Suspense>
        </HydrationBoundary>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarDialog>
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
