"use client";

import Link from "next/link";

import { useRecentCommunityContext } from "@/context/RecentCommunityContext";
import CommunityImage from "../community/CommunityImage";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import SidebarMenuSkeleton from "./SidebarMenuSkeleton";

export default function SidebarMenuRecent() {
  const state = useRecentCommunityContext();

  if (state.isLoading) {
    return <SidebarMenuSkeleton length={4} favorite={false} />;
  }

  if (state.communities.length === 0) {
    return null;
  }

  return (
    <AccordionItem value="item-1">
      <AccordionTrigger className="px-4 text-xs font-light uppercase tracking-widest text-muted-foreground hover:no-underline">
        recent
      </AccordionTrigger>
      <AccordionContent>
        <menu>
          {state.communities.map((community) => (
            <li key={community.id} className="flex">
              <Button
                variant="ghost"
                size="lg"
                className="w-full justify-start px-4 text-sm font-normal tracking-wide hover:bg-accent/40"
                asChild
              >
                <Link href={`/r/${community.name}`}>
                  <CommunityImage icon={community.icon} size={32} />
                  <h2 className="truncate">r/{community.name}</h2>
                </Link>
              </Button>
            </li>
          ))}
        </menu>
      </AccordionContent>
    </AccordionItem>
  );
}
