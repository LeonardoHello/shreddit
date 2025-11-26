import { headers as nextHeaders } from "next/headers";
import { notFound } from "next/navigation";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import * as v from "valibot";

import { createClient } from "@/hono/client";
import { getQueryClient } from "@/tanstack-query/getQueryClient";
import { uuidv4PathRegex as reg } from "@/utils/hono";

export default async function PostLayout(
  props: LayoutProps<"/r/[communityName]/comments/[postId]">,
) {
  const [params, headers] = await Promise.all([props.params, nextHeaders()]);

  const { output: postId, success } = v.safeParse(
    v.pipe(v.string(), v.uuid()),
    params.postId,
  );

  if (!success) notFound();

  const client = createClient(headers);
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["posts", postId],
    queryFn: async () => {
      const res = await client.posts[`:postId{${reg}}`].$get({
        param: { postId },
      });

      return res.json();
    },
  });
  queryClient.prefetchQuery({
    queryKey: ["posts", postId, "comments"],
    queryFn: async () => {
      const res = await client.posts[`:postId{${reg}}`].comments.$get({
        param: { postId },
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
