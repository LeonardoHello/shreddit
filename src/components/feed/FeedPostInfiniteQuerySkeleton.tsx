import { Flame, MessageSquareText, Rocket, Tag } from "lucide-react";

import PostSkeleton from "../post/PostSkeleton";
import { Button } from "../ui/button";

export default function FeedPostInfiniteQuerySkeleton() {
  return (
    <div className="flex grow flex-col gap-2">
      <nav className="rounded-lg border bg-card p-2">
        <ul className="flex justify-around gap-1 font-bold text-muted-foreground">
          <li>
            <Button variant={"ghost"} className="rounded-full" disabled>
              <Rocket className="size-5 stroke-[1.5] sm:size-6" />
              <span className="sr-only sm:not-sr-only">Best</span>
            </Button>
          </li>
          <li>
            <Button variant={"ghost"} className="rounded-full" disabled>
              <Flame className="size-5 stroke-[1.5] sm:size-6" />
              <span className="sr-only sm:not-sr-only">Hot</span>
            </Button>
          </li>
          <li>
            <Button variant={"ghost"} className="rounded-full" disabled>
              <Tag className="size-5 stroke-[1.5] sm:size-6" />
              <span className="sr-only sm:not-sr-only">New</span>
            </Button>
          </li>
          <li>
            <Button variant={"ghost"} className="rounded-full" disabled>
              <MessageSquareText className="size-5 stroke-[1.5] sm:size-6" />
              <span className="sr-only sm:not-sr-only">Controversial</span>
            </Button>
          </li>
        </ul>
      </nav>

      {Array.from({ length: 3 }).map((_, index) => (
        <PostSkeleton key={index} postContentHeight={(index + 2) * 100} />
      ))}
    </div>
  );
}
