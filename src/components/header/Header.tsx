import dynamic from "next/dynamic";

import { auth } from "@clerk/nextjs/server";

import {
  getFavoriteCommunities,
  getJoinedCommunities,
  getModeratedCommunities,
} from "@/api/getCommunities";
import Logo from "@/components/header/Logo";
import Search from "@/components/header/Search";
import { User } from "@/db/schema";
import cn from "@/utils/cn";
import Menu from "../menu/Menu";
import MenuDropdown from "../menu/MenuDropdown";
import UserProfile from "../user/UserProfile";
import SignInButton from "./SignInButton";

const MenuCommunities = dynamic(() => import("../menu/MenuCommunities"));

export default async function Header() {
  const { userId } = await auth();

  return (
    <header
      className={cn(
        "z-20 flex min-h-12 gap-5 border-b border-zinc-700/70 bg-zinc-900 px-5 py-1",
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
  const favoriteCommunitiesPromise = getFavoriteCommunities.execute({
    currentUserId,
  });
  const moderatedCommunitiesPromise = getModeratedCommunities.execute({
    currentUserId,
  });
  const joinedCommunitiesPromise = getJoinedCommunities.execute({
    currentUserId,
  });

  const [favoriteCommunities, moderatedCommunities, joinedCommunities] =
    await Promise.all([
      favoriteCommunitiesPromise,
      moderatedCommunitiesPromise,
      joinedCommunitiesPromise,
    ]);

  return (
    <>
      <Menu>
        <MenuDropdown>
          <MenuCommunities
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
