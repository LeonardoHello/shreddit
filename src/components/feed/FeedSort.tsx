"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Flame, MessageSquareText, Rocket, Tag } from "lucide-react";

import { PostSort } from "@/types";
import { Button } from "../ui/button";

export default function FeedSort({ sort }: { sort: PostSort }) {
  const pathname = usePathname();

  const isBest = sort === PostSort.BEST;
  const isHot = sort === PostSort.HOT;
  const isNew = sort === PostSort.NEW;
  const isControversial = sort === PostSort.CONTROVERSIAL;

  return (
    <nav className="rounded border bg-card p-2">
      <ul className="flex justify-around gap-2 font-bold text-muted-foreground">
        <li>
          <Button
            variant={isBest ? "default" : "ghost"}
            className="rounded-full"
            disabled={isBest}
            asChild
          >
            <Link href={{ pathname, query: { sort: PostSort.BEST } }}>
              <Rocket className="size-6" />
              <span className="hidden sm:inline-block">Best</span>
            </Link>
          </Button>
        </li>

        <li>
          <Button
            variant={isHot ? "default" : "ghost"}
            className="rounded-full"
            disabled={isHot}
            asChild
          >
            <Link href={{ pathname, query: { sort: PostSort.HOT } }}>
              <Flame className="size-6" />
              <span className="hidden sm:inline-block">Hot</span>
            </Link>
          </Button>
        </li>

        <li>
          <Button
            variant={isNew ? "default" : "ghost"}
            className="rounded-full"
            disabled={isNew}
            asChild
          >
            <Link href={{ pathname, query: { sort: PostSort.NEW } }}>
              <Tag className="size-6" />
              <span className="hidden sm:inline-block">New</span>
            </Link>
          </Button>
        </li>

        <li>
          <Button
            variant={isControversial ? "default" : "ghost"}
            className="rounded-full"
            disabled={isControversial}
            asChild
          >
            <Link href={{ pathname, query: { sort: PostSort.CONTROVERSIAL } }}>
              <MessageSquareText className="size-6" />
              <span className="hidden sm:inline-block">Controversial</span>
            </Link>
          </Button>
        </li>
      </ul>
    </nav>
  );
}
