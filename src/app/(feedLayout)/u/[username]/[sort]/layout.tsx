import { headers as nextHeaders } from "next/headers";
import { notFound } from "next/navigation";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import * as v from "valibot";

import { createClient } from "@/hono/client";
import { getQueryClient } from "@/tanstack-query/getQueryClient";
import { PostSort } from "@/types/enums";

export default async function UserLayout(
  props: LayoutProps<"/u/[username]/[sort]">,
) {
  const [params, headers] = await Promise.all([props.params, nextHeaders()]);

  const { output: sort, success } = v.safeParse(v.enum(PostSort), params.sort);

  if (!success) notFound();

  const client = createClient(headers);
  const queryClient = getQueryClient();

  queryClient.prefetchInfiniteQuery({
    queryKey: ["users", params.username, "posts", sort],
    queryFn: async ({ pageParam }) => {
      const res = await client.users[":username"].posts.$get({
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
