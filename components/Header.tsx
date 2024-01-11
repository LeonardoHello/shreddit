import dynamic from "next/dynamic";

import { auth } from "@clerk/nextjs";

import Logo from "@/components/Logo";
import Search from "@/components/Search";
import {
  getFavoriteCommunities,
  getJoinedCommunities,
  getModeratedCommunities,
} from "@/lib/api/getCommunities";
import { User } from "@/lib/db/schema";
import cn from "@/lib/utils/cn";

import Menu from "./Menu";
import MenuDropdown from "./MenuDropdown";
import SignInButton from "./SignInButton";
import UserProfile from "./UserProfile";

const YourCommunities = dynamic(() => import("./YourCommunities"));

export default function Header() {
  const { userId } = auth();

  return (
    <header
      className={cn(
        "flex h-12 gap-5 border-b border-zinc-700/70 bg-zinc-900 px-5 py-1",
        { "justify-between": userId === null },
      )}
    >
      <Logo />
      <Search />

      {userId ? (
        <HeaderAuthenticated currentUserId={userId} />
      ) : (
        <SignInButton />
      )}
    </header>
  );
}

async function HeaderAuthenticated({
  currentUserId,
}: {
  currentUserId: User["id"];
}) {
  const favoriteCommunitiesData = getFavoriteCommunities(currentUserId);
  const moderatedCommunitiesData = getModeratedCommunities(currentUserId);
  const joinedCommunitiesData = getJoinedCommunities(currentUserId);

  const [favoriteCommunities, moderatedCommunities, joinedCommunities] =
    await Promise.all([
      favoriteCommunitiesData,
      moderatedCommunitiesData,
      joinedCommunitiesData,
    ]).catch(() => {
      throw new Error("There was a problem with loading user information.");
    });

  return (
    <>
      <Menu>
        <MenuDropdown>
          <YourCommunities
            initialFavoriteCommunities={favoriteCommunities}
            initialModeratedCommunities={moderatedCommunities}
            initialJoinedCommunities={joinedCommunities}
          />
        </MenuDropdown>
      </Menu>
      <UserProfile />
    </>
  );
}
