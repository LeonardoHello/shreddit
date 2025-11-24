import { notFound } from "next/navigation";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import * as z from "zod/mini";

import { getSession } from "@/app/actions";
import { client } from "@/hono/client";
import { getQueryClient } from "@/tanstack-query/getQueryClient";
import { PostSort } from "@/types/enums";

export default async function HomeSortLayout(
  props: LayoutProps<"/home/[sort]">,
) {
  const [params, session] = await Promise.all([props.params, getSession()]);

  if (!session) throw new Error("Could not load home page information.");

  const { data: sort, success } = z.enum(PostSort).safeParse(params.sort);

  if (!success) notFound();

  const queryClient = getQueryClient();

  queryClient.prefetchInfiniteQuery({
    queryKey: ["users", session.session.userId, "posts", sort],
    queryFn: async ({ pageParam }) => {
      const res = await client.users.me.posts.$get({
        query: {
          sort,
          currentUserId: session.session.userId,
          cursor: pageParam,
        },
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
