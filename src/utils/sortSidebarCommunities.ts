import { RouterOutput } from "@/trpc/routers/_app";

export default function sortSidebarCommunities(
  communities: RouterOutput["community"]["getModeratedCommunities"],
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
