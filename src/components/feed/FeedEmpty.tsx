import Link from "next/link";

import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

import { Button } from "../ui/button";

export default function FeedEmpty({ username }: { username?: string }) {
  return (
    <div className="relative flex grow flex-col rounded border border-border/50">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex gap-2 bg-card p-2 opacity-20">
          <div className="flex select-none flex-col items-center gap-4 text-muted-foreground">
            <ArrowUpCircle className="h-8 w-8 rounded" />
            <ArrowDownCircle className="h-8 w-8 rounded" />
          </div>
          <div className="min-h-full w-32 rounded bg-muted-foreground/25" />
          <div className="flex grow flex-col gap-2">
            <div className="h-6 w-2/3 rounded bg-muted-foreground/25" />
            <div className="h-3 w-2/3 rounded bg-muted-foreground/25" />
            <div className="mt-auto flex h-3 w-1/3 gap-2">
              <div className="w-6 rounded bg-muted-foreground/25" />
              <div className="grow rounded bg-muted-foreground/25" />
            </div>
          </div>
        </div>
      ))}
      <div className="absolute top-1/4 flex flex-col items-center gap-2 self-center p-12 text-center">
        <h1 className="text-lg font-medium">
          hmm... looks like nothing has been posted yet
        </h1>
        {/* TODO */}
        {username && (
          <>
            <h2 className="text-sm">
              Be the first to till this fertile swamp.
            </h2>
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/submit" className="rounded-full">
                Create Post
              </Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
