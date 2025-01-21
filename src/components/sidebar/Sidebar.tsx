import { Suspense } from "react";

import { auth } from "@clerk/nextjs/server";

import { Accordion } from "@/components/ui/accordion";
import { HydrateClient, trpc } from "@/trpc/server";
import SidebarMenuJoined from "./SidebarMenuJoined";
import SidebarMenuMain from "./SidebarMenuMain";
import SidebarMenuModerated from "./SidebarMenuModerated";
import SidebarMenuRecent from "./SidebarMenuRecent";
import SidebarMenuSkeleton from "./SidebarMenuSkeleton";

export default async function Sidebar({ className }: { className?: string }) {
  const { userId } = await auth();

  if (userId) {
    void trpc.community.getModeratedCommunities.prefetch();
    void trpc.community.getJoinedCommunities.prefetch();
  }

  return (
    <div
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "hsl(var(--muted-foreground)/0.4) transparent",
      }}
      className={className}
    >
      <SidebarMenuMain userId={userId} />

      <Accordion type="multiple" defaultValue={["item-1", "item-2", "item-3"]}>
        <SidebarMenuRecent />

        {userId && (
          <>
            <HydrateClient>
              <Suspense fallback={<SidebarMenuSkeleton length={2} favorite />}>
                <SidebarMenuModerated />
              </Suspense>
            </HydrateClient>

            <HydrateClient>
              <Suspense fallback={<SidebarMenuSkeleton length={4} favorite />}>
                <SidebarMenuJoined />
              </Suspense>
            </HydrateClient>
          </>
        )}
      </Accordion>
    </div>
  );
}
