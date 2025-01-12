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

export default async function Sidebar({ sheet = false }: { sheet?: boolean }) {
  const { userId } = await auth();

  void trpc.community.getModeratedCommunities.prefetch();
  void trpc.community.getJoinedCommunities.prefetch();

  return (
    <div
      style={{ scrollbarWidth: "thin", colorScheme: "dark" }}
      className={
        !sheet
          ? "sticky top-14 hidden h-[calc(100vh-3.5rem)] w-[274px] gap-3 overflow-y-auto border-r bg-card p-4 xl:block"
          : undefined
      }
    >
      <SidebarMenuMain userId={userId} />

      <Accordion type="multiple" defaultValue={["item-1", "item-2", "item-3"]}>
        <AccordionItem value="item-1">
          <AccordionTrigger className="px-4 text-xs font-light uppercase tracking-widest text-muted-foreground hover:no-underline">
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
