"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { VolumeX } from "lucide-react";

import { client } from "@/hono/client";
import SidebarCollapsible from "./SidebarCollapsible";

export default function SidebarNavMuted() {
  const { data: mutedCommunities } = useSuspenseQuery({
    queryKey: ["communities", "muted"],
    queryFn: async () => {
      const res = await client.communities.muted.$get();

      return res.json();
    },
  });

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
