"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import CommunityImage from "../community/CommunityImage";

export default function SubmitCommunitySelected({
  communityName,
}: {
  communityName: string;
}) {
  const trpc = useTRPC();

  const { data: selectedCommunity } = useSuspenseQuery(
    trpc.community.getSelectedCommunity.queryOptions(communityName),
  );

  if (!selectedCommunity)
    throw new Error("There was a problem with a community selection.");

  return (
    <>
      <CommunityImage
        size={24}
        icon={selectedCommunity.icon}
        className="size-6"
      />

      <span className="truncate">r/{selectedCommunity.name}</span>

      <ChevronDown className="ml-auto size-5 text-muted-foreground" />
    </>
  );
}
