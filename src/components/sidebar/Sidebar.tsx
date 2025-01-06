import { auth } from "@clerk/nextjs/server";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SidebarMenuJoined from "./SidebarMenuJoined";
import SidebarMenuMain from "./SidebarMenuMain";
import SidebarMenuModerated from "./SidebarMenuModerated";
import SidebarMenuRecent from "./SidebarMenuRecent";

export default async function Sidebar() {
  const { userId } = await auth();

  return (
    <div
      style={{ scrollbarWidth: "thin", colorScheme: "dark" }}
      className="sticky top-14 h-[calc(100vh-3.5rem)] w-72 gap-3 overflow-y-auto border-r bg-card p-4"
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
                <SidebarMenuModerated />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="px-4 text-xs font-light uppercase tracking-widest text-muted-foreground hover:no-underline">
                communities
              </AccordionTrigger>
              <AccordionContent>
                <SidebarMenuJoined />
              </AccordionContent>
            </AccordionItem>
          </>
        )}
      </Accordion>
    </div>
  );
}
