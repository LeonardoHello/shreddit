import { currentUser } from "@clerk/nextjs/server";
import { ChevronDown, CircleDashed } from "lucide-react";

import SubmitCommunity from "@/components/submit/SubmitCommunity";
import { Button } from "@/components/ui/button";
import { HydrateClient } from "@/trpc/server";

export default async function SubmitPage() {
  const user = await currentUser();

  if (!user) throw new Error("Cannot read current user information.");

  return (
    <>
      <HydrateClient>
        <SubmitCommunity username={user.username} imageUrl={user.imageUrl}>
          <Button
            variant={"outline"}
            className="h-10 w-60 border-border sm:w-72"
          >
            <CircleDashed className="size-6 text-muted-foreground" />
            <span>Choose a community</span>
            <ChevronDown className="ml-auto size-5 text-muted-foreground" />
          </Button>
        </SubmitCommunity>
      </HydrateClient>

      <Button className="order-2 cursor-not-allowed self-end rounded-full">
        Post
      </Button>
    </>
  );
}
