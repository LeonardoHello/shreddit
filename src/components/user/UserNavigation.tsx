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
      label: "overview",
      href: `/u/${username}`,
    },
    {
      label: "saved",
      href: `/u/${username}/saved`,
    },
    {
      label: "hidden",
      href: `/u/${username}/hidden`,
    },
    {
      label: "upvoted",
      href: `/u/${username}/upvoted`,
    },
    {
      label: "downvoted",
      href: `/u/${username}/downvoted`,
    },
  ];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full lg:hidden"
          >
            <Ellipsis className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded bg-card">
          {tabs.map((tab) => (
            <DropdownMenuItem
              key={tab.label}
              className={cn(
                pathname === tab.href && "bg-accent text-accent-foreground",
              )}
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
                variant={pathname === tab.href ? "default" : "outline"}
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
