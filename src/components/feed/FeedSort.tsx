"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { ChevronDown } from "lucide-react";

import { PostSort } from "@/types/enums";
import { cn } from "@/utils/cn";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function FeedSort({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const pathname = usePathname();
  const {
    sort = PostSort.BEST,
    username = "",
    communityName = "",
  } = useParams();

  function getHref() {
    if (pathname.startsWith("/home")) {
      return "/home";
    } else if (pathname.startsWith("/all")) {
      return "/all";
    } else if (pathname.startsWith("/r")) {
      return `/r/${communityName}`;
    } else if (
      pathname.startsWith(`/u/${username}`) &&
      !pathname.startsWith(`/u/${username}/saved`) &&
      !pathname.startsWith(`/u/${username}/hidden`) &&
      !pathname.startsWith(`/u/${username}/upvoted`) &&
      !pathname.startsWith(`/u/${username}/downvoted`)
    ) {
      return `/u/${username}`;
    } else if (pathname.startsWith(`/u/${username}/saved`)) {
      return `/u/${username}/saved`;
    } else if (pathname.startsWith(`/u/${username}/hidden`)) {
      return `/u/${username}/hidden`;
    } else if (pathname.startsWith(`/u/${username}/upvoted`)) {
      return `/u/${username}/upvoted`;
    } else if (pathname.startsWith(`/u/${username}/downvoted`)) {
      return `/u/${username}/downvoted`;
    } else {
      // in case of root path
      return isAuthenticated ? "/home" : "/all";
    }
  }

  const tabs = [
    {
      label: "Best",
      href: `${getHref()}/${PostSort.BEST}`,
      isActive: sort === PostSort.BEST,
    },
    {
      label: "Hot",
      href: `${getHref()}/${PostSort.HOT}`,
      isActive: sort === PostSort.HOT,
    },
    {
      label: "New",
      href: `${getHref()}/${PostSort.NEW}`,
      isActive: sort === PostSort.NEW,
    },

    {
      label: "Controversial",
      href: `${getHref()}/${PostSort.CONTROVERSIAL}`,
      isActive: sort === PostSort.CONTROVERSIAL,
    },
  ];

  const currentTab = tabs.find((tab) => tab.isActive);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} className="self-start border-border">
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
