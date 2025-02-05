"use client";

import { ChevronDown } from "lucide-react";

import { trpc } from "@/trpc/client";
import CommunityImage from "../community/CommunityImage";

export default function SubmitCommunitySelected({
  communityName,
}: {
  communityName: string;
}) {
  const [selectedCommunity] =
    trpc.community.getSelectedCommunity.useSuspenseQuery(communityName);

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
