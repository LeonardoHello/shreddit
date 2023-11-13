import CurrentFeed from "@/components/CurrentFeed";
import {
  getFavoriteCommunities,
  getJoinedCommunities,
  getOwnedCommunities,
} from "@/lib/api/getUsersCommunities";

import Menu from "./Menu";
import UserProfile from "./UserProfile";

export default async function UserInfo({ userId }: { userId: string }) {
  const favoriteCommunitiesData = getFavoriteCommunities(userId);
  const ownedCommunitiesData = getOwnedCommunities(userId);
  const joinedCommunitiesData = getJoinedCommunities(userId);

  const [favoriteCommunities, ownedCommunities, joinedCommunities] =
    await Promise.all([
      favoriteCommunitiesData,
      ownedCommunitiesData,
      joinedCommunitiesData,
    ]).catch(() => {
      throw new Error("Could not load users information.");
    });

  return (
    <>
      <CurrentFeed>
        <Menu
          favoriteCommunities={favoriteCommunities}
          ownedCommunities={ownedCommunities}
          joinedCommunities={joinedCommunities}
        />
      </CurrentFeed>
      <UserProfile />
    </>
  );
}
