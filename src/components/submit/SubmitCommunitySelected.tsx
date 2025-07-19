"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import CommunityIcon from "../community/CommunityIcon";

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
      <CommunityIcon
        icon={selectedCommunity.icon}
        iconPlaceholder={selectedCommunity.iconPlaceholder}
        communtiyName={selectedCommunity.name}
        size={24}
        className="aspect-square rounded-full object-cover select-none"
      />

      <span className="truncate">r/{selectedCommunity.name}</span>

      <ChevronDown className="text-muted-foreground ml-auto size-5" />
    </>
  );
}
