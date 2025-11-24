"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { VolumeX } from "lucide-react";

import { client } from "@/hono/client";
import type { UserId } from "@/lib/auth";
import SidebarCollapsible from "./SidebarCollapsible";

export default function SidebarNavMuted({
  currentUserId,
}: {
  currentUserId: NonNullable<UserId>;
}) {
  const { data: mutedCommunities } = useSuspenseQuery({
    queryKey: ["users", currentUserId, "communities", "muted"],
    queryFn: async () => {
      const res = await client.users.me.communities.muted.$get({
        query: { currentUserId },
      });
      return res.json();
    },
  });

  return (
    <SidebarCollapsible
      currentUserId={currentUserId}
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
