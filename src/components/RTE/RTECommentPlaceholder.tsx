"use client";

import { useClerk } from "@clerk/nextjs";
import { Plus } from "lucide-react";

import { Button } from "../ui/button";

export default function RTECommentPlaceholder() {
  const clerk = useClerk();

  return (
    <Button
      variant={"outline"}
      className="self-start rounded-full"
      onClick={() => {
        clerk.openSignIn();
      }}
    >
      <Plus className="size-5 stroke-1" viewBox="4 4 16 16" />
      Add a comment
    </Button>
  );
}
