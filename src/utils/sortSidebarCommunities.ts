import type { InferResponseType } from "hono";

import type { client } from "@/hono/client";

type ModeratedCommunites = InferResponseType<
  typeof client.communities.moderated.$get,
  200
>;

export default function sortSidebarCommunities(
  communities: ModeratedCommunites,
) {
  return communities.sort((a, b) => {
    if (a.favorited && !b.favorited) return -1;
    if (!a.favorited && b.favorited) return 1;

    if (a.favorited && b.favorited) {
      if (a.favoritedAt > b.favoritedAt) return -1;
      if (a.favoritedAt < b.favoritedAt) return 1;
      return 0;
    }

    const communityNameA = a.community.name.toLowerCase();
    const communityNameB = b.community.name.toLowerCase();

    if (communityNameA < communityNameB) return -1;
    if (communityNameA > communityNameB) return 1;

    return 0;
  });
}
