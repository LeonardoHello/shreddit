"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";

import { client } from "@/hono/client";
import SidebarCollapsible from "./SidebarCollapsible";

export default function SidebarNavJoined() {
  const { data: joinedCommunities } = useSuspenseQuery({
    queryKey: ["communities", "joined"],
    queryFn: async () => {
      const res = await client.communities.joined.$get();

      return await res.json();
    },
  });

  return (
    <SidebarCollapsible
      communities={joinedCommunities}
      title="Communities you're a member of"
      label="joined"
      empty={{
        icon: Users,
        title: "You're not a member of any community",
        description: "Join a community to see it here",
      }}
    />
  );
}
