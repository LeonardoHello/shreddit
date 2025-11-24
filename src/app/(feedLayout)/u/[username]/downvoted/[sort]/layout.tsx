import { notFound } from "next/navigation";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import * as z from "zod/mini";

import { client } from "@/hono/client";
import { getQueryClient } from "@/tanstack-query/getQueryClient";
import { PostFeed, PostSort } from "@/types/enums";

export default async function UserDownvotedLayout(
  props: LayoutProps<"/u/[username]/downvoted/[sort]">,
) {
  const params = await props.params;

  const { data: sort, success } = z.enum(PostSort).safeParse(params.sort);

  if (!success) notFound();

  const queryClient = getQueryClient();

  queryClient.prefetchInfiniteQuery({
    queryKey: ["users", params.username, "posts", PostFeed.DOWNVOTED, sort],
    queryFn: async ({ pageParam }) => {
      const res = await client.users[":username"].posts.downvoted.$get({
        param: { username: params.username },
        query: { sort, cursor: pageParam },
      });
      return res.json();
    },
    initialPageParam: undefined,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}
