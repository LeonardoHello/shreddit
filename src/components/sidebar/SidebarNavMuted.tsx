"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { VolumeX } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import SidebarCollapsible from "./SidebarCollapsible";

export default function SidebarNavMuted() {
  const trpc = useTRPC();

  const { data: mutedCommunities } = useSuspenseQuery(
    trpc.community.getMutedCommunities.queryOptions(),
  );

  return (
    <SidebarCollapsible
      communities={mutedCommunities}
      defaultOpen={false}
      title="Communities you've silenced"
      label="muted"
      empty={{
        icon: VolumeX,
        title: "You haven't muted any community",
        description: "Mute a community to see it here",
      }}
    />
  );
}
