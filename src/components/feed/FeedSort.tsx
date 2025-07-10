"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/cn";
import { PostSort } from "@/types/enums";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function FeedSort({ sort }: { sort: PostSort }) {
  const pathname = usePathname();

  function getHref() {
    // Prioritize most specific routes first
    if (/^\/home/.test(pathname)) return "/home";
    if (/^\/all/.test(pathname)) return "/all";

    // Match /r/:communityName
    const rMatch = pathname.match(/^\/r\/[^/]+/);
    if (rMatch) return rMatch[0];

    // Match /u/:username routes
    const uMatch = pathname.match(
      /^\/u\/[^/]+(?:\/(saved|hidden|upvoted|downvoted))?/,
    );
    if (uMatch) return uMatch[0];

    return "/all"; // Fallback
  }

  const baseHref = getHref();

  const tabs = [
    {
      label: "Best",
      href: `${baseHref}/${PostSort.BEST}`,
      isActive: sort === PostSort.BEST,
    },
    {
      label: "Hot",
      href: `${baseHref}/${PostSort.HOT}`,
      isActive: sort === PostSort.HOT,
    },
    {
      label: "New",
      href: `${baseHref}/${PostSort.NEW}`,
      isActive: sort === PostSort.NEW,
    },
    {
      label: "Controversial",
      href: `${baseHref}/${PostSort.CONTROVERSIAL}`,
      isActive: sort === PostSort.CONTROVERSIAL,
    },
  ];

  const currentTab = tabs.find((tab) => tab.isActive);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} className="border-border self-start">
          {currentTab ? currentTab.label : tabs[0].label}
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {tabs.map((tab) => (
          <DropdownMenuItem
            key={tab.label}
            asChild
            className={cn(tab.isActive && "bg-accent text-accent-foreground")}
          >
            <Link href={tab.href}>{tab.label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
