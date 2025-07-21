import { Suspense } from "react";
import Link from "next/link";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { getSession } from "@/app/actions";
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
import { getQueryClient, trpc } from "@/trpc/server";
import SidebarDialog from "./SidebarDialog";
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
        className="gap-0"
      >
        <SidebarNavRecent />

        {session && (
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
        )}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {session && (
              <SidebarDialog>
                <SidebarMenuButton className="[&>svg]:size-7">
                  <Plus className="stroke-[1.25]" />
                  Create Community
                </SidebarMenuButton>
              </SidebarDialog>
            )}
            {!session && (
              <Link href={"/sign-in"}>
                <SidebarMenuButton className="[&>svg]:size-7">
                  <Plus className="stroke-[1.25]" />
                  Create Community
                </SidebarMenuButton>
              </Link>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
