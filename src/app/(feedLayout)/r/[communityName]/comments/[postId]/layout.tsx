import { headers as nextHeaders } from "next/headers";
import { notFound } from "next/navigation";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import * as z from "zod/mini";

import { createClient } from "@/hono/client";
import { getQueryClient } from "@/tanstack-query/getQueryClient";
import { uuidv4PathRegex as reg } from "@/utils/hono";

export default async function PostLayout(
  props: LayoutProps<"/r/[communityName]/comments/[postId]">,
) {
  const [params, headers] = await Promise.all([props.params, nextHeaders()]);

  const { success } = z.uuid().safeParse(params.postId);

  if (!success) notFound();

  const client = createClient(headers);
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["posts", params.postId],
    queryFn: async () => {
      const res = await client.posts[`:postId{${reg}}`].$get({
        param: { postId: params.postId },
      });

      return res.json();
    },
  });
  queryClient.prefetchQuery({
    queryKey: ["posts", params.postId, "comments"],
    queryFn: async () => {
      const res = await client.posts[`:postId{${reg}}`].comments.$get({
        param: { postId: params.postId },
      });

      return res.json();
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}
