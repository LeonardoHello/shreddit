"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Shield } from "lucide-react";

import { client } from "@/hono/client";
import SidebarCollapsible from "./SidebarCollapsible";

export default function SidebarNavModerated() {
  const { data: moderatedCommunities } = useSuspenseQuery({
    queryKey: ["users", "me", "communities", "moderated"],
    queryFn: async () => {
      const res = await client.users.me.communities.moderated.$get();

      return res.json();
    },
  });

  return (
    <SidebarCollapsible
      communities={moderatedCommunities}
      title="Communities you moderate or created"
      label="moderated"
      empty={{
        icon: Shield,
        title: "No moderated communities",
        description: "Create a community to see it here",
      }}
    />
  );
}
