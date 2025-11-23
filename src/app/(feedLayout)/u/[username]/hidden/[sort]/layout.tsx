import { notFound } from "next/navigation";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import * as z from "zod/mini";

import { client } from "@/hono/client";
import { getQueryClient } from "@/tanstack-query/getQueryClient";
import { PostFeed, PostSort } from "@/types/enums";

export default async function UserHiddenLayout(
  props: LayoutProps<"/u/[username]/hidden/[sort]">,
) {
  const params = await props.params;

  const { data: sort, success } = z.enum(PostSort).safeParse(params.sort);

  if (!success) notFound();

  const queryClient = getQueryClient();

  queryClient.prefetchInfiniteQuery({
    queryKey: ["posts", PostFeed.HIDDEN, params.username, sort],
    queryFn: async ({ pageParam }) => {
      const res = await client.posts.users[":username"].hidden.$get({
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
