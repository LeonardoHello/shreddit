"use client";

import { ClerkLoaded, ClerkLoading, SignInButton } from "@clerk/nextjs";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";

import { usePostContext } from "@/context/PostContext";
import { Button } from "../ui/button";

export default function PostVotePlaceholder() {
  const state = usePostContext();

  return (
    <div
      className="flex items-center gap-0.5 rounded-full bg-secondary"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <ClerkLoading>
        <Button
          variant="secondary"
          className="size-8 rounded-full bg-inherit transition"
        >
          <ArrowBigUp className="stroke-[1.2]" />
        </Button>
      </ClerkLoading>
      <ClerkLoaded>
        <SignInButton mode="modal">
          <Button
            variant="secondary"
            className="size-8 rounded-full bg-inherit transition"
          >
            <ArrowBigUp className="stroke-[1.2]" />
          </Button>
        </SignInButton>
      </ClerkLoaded>

      <div className="text-xs font-bold">
        {new Intl.NumberFormat("en-US", {
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(state.voteCount)}
      </div>

      <ClerkLoading>
        <Button variant="secondary" className="size-8 rounded-full bg-inherit">
          <ArrowBigDown className="stroke-[1.2]" />
        </Button>
      </ClerkLoading>
      <ClerkLoaded>
        <SignInButton mode="modal">
          <Button
            variant="secondary"
            className="size-8 rounded-full bg-inherit"
          >
            <ArrowBigDown className="stroke-[1.2]" />
          </Button>
        </SignInButton>
      </ClerkLoaded>
    </div>
  );
}
