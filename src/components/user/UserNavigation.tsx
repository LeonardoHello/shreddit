"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Ellipsis } from "lucide-react";

import { cn } from "@/utils/cn";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function UserNavigation({ username }: { username: string }) {
  const pathname = usePathname();

  const tabs = [
    {
      label: "Posts",
      href: `/u/${username}`,
      isActive:
        pathname.startsWith(`/u/${username}`) &&
        !pathname.startsWith(`/u/${username}/saved`) &&
        !pathname.startsWith(`/u/${username}/hidden`) &&
        !pathname.startsWith(`/u/${username}/upvoted`) &&
        !pathname.startsWith(`/u/${username}/downvoted`),
    },
    {
      label: "Saved",
      href: `/u/${username}/saved`,
      isActive: pathname.startsWith(`/u/${username}/saved`),
    },
    {
      label: "Hidden",
      href: `/u/${username}/hidden`,
      isActive: pathname.startsWith(`/u/${username}/hidden`),
    },
    {
      label: "Upvoted",
      href: `/u/${username}/upvoted`,
      isActive: pathname.startsWith(`/u/${username}/upvoted`),
    },
    {
      label: "Downvoted",
      href: `/u/${username}/downvoted`,
      isActive: pathname.startsWith(`/u/${username}/downvoted`),
    },
  ];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="min-w-9 rounded-full lg:hidden"
          >
            <Ellipsis className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded bg-card">
          {tabs.map((tab) => (
            <DropdownMenuItem
              key={tab.label}
              className={cn(tab.isActive && "bg-accent text-accent-foreground")}
              asChild
            >
              <Link href={tab.href}>{tab.label}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <nav className="hidden lg:block">
        <ul className="flex gap-2">
          {tabs.map((tab) => (
            <li key={tab.label}>
              <Button
                variant={tab.isActive ? "default" : "outline"}
                asChild
                className="rounded-full"
              >
                <Link href={tab.href}>{tab.label}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
