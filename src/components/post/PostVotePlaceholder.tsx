"use client";

import { ClerkLoaded, ClerkLoading, SignInButton } from "@clerk/nextjs";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

import { usePostContext } from "@/context/PostContext";

export default function PostVotePlaceholder() {
  const state = usePostContext();

  return (
    <div className="flex select-none flex-col gap-0.5 text-center text-zinc-500">
      <ClerkLoading>
        <ArrowUpCircle
          className="order-1 h-6 w-6 cursor-pointer rounded transition-colors hover:bg-zinc-700/50"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
        <ArrowDownCircle
          className="order-3 h-6 w-6 cursor-pointer rounded transition-colors hover:bg-zinc-700/50"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      </ClerkLoading>

      <ClerkLoaded>
        <SignInButton mode="modal">
          <ArrowUpCircle
            className="order-1 h-6 w-6 cursor-pointer rounded transition-colors hover:bg-zinc-700/50"
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </SignInButton>
        <SignInButton mode="modal">
          <ArrowDownCircle
            className="order-3 h-6 w-6 cursor-pointer rounded transition-colors hover:bg-zinc-700/50"
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </SignInButton>
      </ClerkLoaded>

      <div className="order-2 text-xs font-bold text-zinc-300 transition-colors">
        {new Intl.NumberFormat("en-US", {
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(state.voteCount)}
      </div>
    </div>
  );
}
