import {
  getFavoriteCommunities,
  getJoinedCommunities,
  getModeratedCommunities,
} from "@/lib/api/communities";

import Menu from "./Menu";
import MenuDropdown from "./MenuDropdown";
import UserProfile from "./UserProfile";

export default async function HeaderAuthenticated({
  userId,
}: {
  userId: string;
}) {
  const moderatedCommunitiesData = getModeratedCommunities(userId);
  const favoriteCommunitiesData = getFavoriteCommunities(userId);
  const joinedCommunitiesData = getJoinedCommunities(userId);

  const [moderatedCommunities, favoriteCommunities, joinedCommunities] =
    await Promise.all([
      moderatedCommunitiesData,
      favoriteCommunitiesData,
      joinedCommunitiesData,
    ]).catch(() => {
      throw new Error("Could not load users information.");
    });

  return (
    <>
      <Menu>
        <MenuDropdown
          moderatedCommunityList={moderatedCommunities}
          favoriteCommunityList={favoriteCommunities}
          joinedCommunityList={joinedCommunities}
        />
      </Menu>
      <UserProfile />
    </>
  );
}
