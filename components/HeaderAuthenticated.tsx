import dynamic from "next/dynamic";

import {
  getFavoriteCommunities,
  getJoinedCommunities,
  getModeratedCommunities,
} from "@/lib/api/communities";

import Menu from "./Menu";
import MenuDropdown from "./MenuDropdown";
import UserProfile from "./UserProfile";

const YourCommunities = dynamic(() => import("./YourCommunities"));

export default async function HeaderAuthenticated({
  userId,
}: {
  userId: string;
}) {
  const favoriteCommunitiesData = getFavoriteCommunities(userId);
  const moderatedCommunitiesData = getModeratedCommunities(userId);
  const joinedCommunitiesData = getJoinedCommunities(userId);

  const [favoriteCommunities, moderatedCommunities, joinedCommunities] =
    await Promise.all([
      favoriteCommunitiesData,
      moderatedCommunitiesData,
      joinedCommunitiesData,
    ]).catch(() => {
      throw new Error("Could not load users information.");
    });

  return (
    <>
      <Menu>
        <MenuDropdown>
          <YourCommunities
            userId={userId}
            favoriteCommunities={favoriteCommunities}
            moderatedCommunities={moderatedCommunities}
            joinedCommunities={joinedCommunities}
          />
        </MenuDropdown>
      </Menu>
      <UserProfile />
    </>
  );
}
