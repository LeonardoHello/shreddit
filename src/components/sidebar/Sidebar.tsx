import { Suspense } from "react";

import { auth } from "@clerk/nextjs/server";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
        <AccordionItem value="item-1">
          <AccordionTrigger className="px-4 text-xs font-light uppercase text-muted-foreground hover:no-underline">
            recent
          </AccordionTrigger>
          <AccordionContent>
            <SidebarMenuRecent />
          </AccordionContent>
        </AccordionItem>

        {userId && (
          <>
            <AccordionItem value="item-2">
              <AccordionTrigger className="px-4 text-xs font-light uppercase tracking-widest text-muted-foreground hover:no-underline">
                moderated
              </AccordionTrigger>
              <AccordionContent>
                <HydrateClient>
                  <Suspense fallback={<SidebarMenuSkeleton length={2} />}>
                    <SidebarMenuModerated />
                  </Suspense>
                </HydrateClient>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="px-4 text-xs font-light uppercase tracking-widest text-muted-foreground hover:no-underline">
                communities
              </AccordionTrigger>
              <AccordionContent>
                <HydrateClient>
                  <Suspense fallback={<SidebarMenuSkeleton length={6} />}>
                    <SidebarMenuJoined />
                  </Suspense>
                </HydrateClient>
              </AccordionContent>
            </AccordionItem>
          </>
        )}
      </Accordion>
    </div>
  );
}
