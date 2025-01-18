"use client";

import { ClerkLoaded, ClerkLoading, SignInButton } from "@clerk/nextjs";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";

import { useCommentContext } from "@/context/CommentContext";
import { Button } from "../ui/button";

export default function CommentVotePlaceholder() {
  const state = useCommentContext();

  return (
    <div
      className="flex items-center gap-0.5"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <ClerkLoading>
        <Button
          variant="ghost"
          className="size-8 rounded-full hover:text-rose-600"
        >
          <ArrowBigUp className="stroke-[1.2]" />
        </Button>
      </ClerkLoading>
      <ClerkLoaded>
        <SignInButton mode="modal">
          <Button
            variant="ghost"
            className="size-8 rounded-full hover:text-rose-600"
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
        <Button
          variant="ghost"
          className="size-8 rounded-full hover:text-indigo-500"
        >
          <ArrowBigDown className="stroke-[1.2]" />
        </Button>
      </ClerkLoading>
      <ClerkLoaded>
        <SignInButton mode="modal">
          <Button
            variant="ghost"
            className="size-8 rounded-full hover:text-indigo-500"
          >
            <ArrowBigDown className="stroke-[1.2]" />
          </Button>
        </SignInButton>
      </ClerkLoaded>
    </div>
  );
}
