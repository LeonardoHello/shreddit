"use client";

import Link from "next/link";

import { Plus } from "lucide-react";

import { trpc } from "@/trpc/client";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import SidebarMenuItemFavorite from "./SidebarMenuItemFavorite";

export default function SidebarMenuModerated() {
  const [moderatedCommunities] =
    trpc.community.getModeratedCommunities.useSuspenseQuery();

  return (
    <AccordionItem value="item-2">
      <AccordionTrigger className="px-4 text-xs font-light uppercase tracking-widest text-muted-foreground hover:no-underline">
        moderated
      </AccordionTrigger>
      <AccordionContent>
        <menu>
          <li>
            <Button
              variant="ghost"
              size="lg"
              className="w-full justify-start px-4 text-sm font-normal hover:bg-accent/40"
              asChild
            >
              <Link href={{ query: { submit: "community" } }} scroll={false}>
                <Plus className="size-8 stroke-1" />
                <h2>Create Community</h2>
              </Link>
            </Button>
          </li>

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
                <SidebarMenuItemFavorite
                  key={communityRelation.communityId}
                  communityRelation={communityRelation}
                />
              ))}
        </menu>
      </AccordionContent>
    </AccordionItem>
  );
}
