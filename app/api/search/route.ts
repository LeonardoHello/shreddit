import { getSearchedCommunities, getSearchedUsers } from "@/lib/api";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {
    const search = z.string().parse(searchParams.get("search"));

    const searchedUsersData = getSearchedUsers(search);
    const searchedCommunitiesData = getSearchedCommunities(search);

    const [searchedUsers, searchedCommunities] = await Promise.all([
      searchedUsersData,
      searchedCommunitiesData,
    ]);

    return NextResponse.json(
      {
        searchedUsers,
        searchedCommunities: searchedCommunities.slice(
          0,
          5 - searchedUsers.length,
        ),
      },
      { status: 200 },
    );
  } catch (error) {
    if (!(error instanceof Error)) return NextResponse.error();

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
