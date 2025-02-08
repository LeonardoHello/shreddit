"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { Flame, MessageSquareText, Rocket, Tag } from "lucide-react";

import { PostSort } from "@/types";
import { Button } from "../ui/button";

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
    if (pathname.startsWith("/r")) {
      return `/r/${communityName}`;
    } else if (pathname.startsWith("/u")) {
      return `/u/${username}`;
    } else if (pathname.startsWith("/home")) {
      return "/home";
    } else if (pathname.startsWith("/all")) {
      return "/all";
    } else {
      return isAuthenticated ? "/home" : "/";
    }
  }

  const links = [
    {
      label: "Best",
      href: `${getHref()}/${PostSort.BEST}`,
      icon: Rocket,
      isActive: sort === PostSort.BEST,
    },
    {
      label: "Hot",
      href: `${getHref()}/${PostSort.HOT}`,
      icon: Flame,
      isActive: sort === PostSort.HOT,
    },
    {
      label: "New",
      href: `${getHref()}/${PostSort.NEW}`,
      icon: Tag,
      isActive: sort === PostSort.NEW,
    },

    {
      label: "Controversial",
      href: `${getHref()}/${PostSort.CONTROVERSIAL}`,
      icon: MessageSquareText,
      isActive: sort === PostSort.CONTROVERSIAL,
    },
  ];

  return (
    <nav className="rounded-lg border bg-card p-2">
      <ul className="flex justify-around gap-1 font-bold text-muted-foreground">
        {links.map((link) => (
          <li key={link.label}>
            <Button
              variant={link.isActive ? "default" : "ghost"}
              disabled={link.isActive}
              className="rounded-full"
              asChild
            >
              <Link href={link.href}>
                <link.icon className="size-5 stroke-[1.5] sm:size-6" />
                <span className="sr-only sm:not-sr-only">{link.label}</span>
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
