"use client";

import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trpc } from "@/trpc/client";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import SidebarNavItem from "./SidebarNavItem";

export default function SidebarNavModerated() {
  const [moderatedCommunities] =
    trpc.community.getModeratedCommunities.useSuspenseQuery();

  return (
    <AccordionItem value="item-2">
      <AccordionTrigger className="px-4 text-xs font-light uppercase tracking-widest text-muted-foreground hover:no-underline">
        moderated
      </AccordionTrigger>
      <AccordionContent>
        <nav>
          <ul>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full justify-start px-4 text-sm font-normal hover:bg-accent/40"
                >
                  <Plus className="size-8 stroke-1" />
                  Create Community
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            {moderatedCommunities &&
              moderatedCommunities.length > 0 &&
              moderatedCommunities
                .sort((a, b) => {
                  if (a.favorited !== b.favorited) {
                    return b.favorited ? 1 : -1;
                  }
                  return a.community.name.localeCompare(b.community.name);
                })
                .map((communityRelation) => (
                  <SidebarNavItem
                    key={communityRelation.communityId}
                    communityRelation={communityRelation}
                  />
                ))}
          </ul>
        </nav>
      </AccordionContent>
    </AccordionItem>
  );
}
