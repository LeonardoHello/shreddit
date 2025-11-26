import { headers as nextHeaders } from "next/headers";
import { notFound } from "next/navigation";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import * as v from "valibot";

import { getSession } from "@/app/actions";
import { createClient } from "@/hono/client";
import { getQueryClient } from "@/tanstack-query/getQueryClient";
import { PostSort } from "@/types/enums";

export default async function HomeSortLayout(
  props: LayoutProps<"/home/[sort]">,
) {
  const [params, headers, session] = await Promise.all([
    props.params,
    nextHeaders(),
    getSession(),
  ]);

  if (!session) throw new Error("401 unauthenticated");

  const { output: sort, success } = v.safeParse(v.enum(PostSort), params.sort);

  if (!success) notFound();

  const client = createClient(headers);
  const queryClient = getQueryClient();

  queryClient.prefetchInfiniteQuery({
    queryKey: ["users", "me", "posts", sort],
    queryFn: async ({ pageParam }) => {
      const res = await client.users.me.posts.$get({
        query: { sort, cursor: pageParam },
      });
      return res.json();
    },
    initialPageParam: undefined,
  });

  return (
    <div className="container flex grow gap-4 p-2 pb-6 lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
      <HydrationBoundary state={dehydrate(queryClient)}>
        {props.children}
      </HydrationBoundary>
      <div className="hidden w-80 xl:block" />
    </div>
  );
}
