import { NextResponse } from "next/server";
import { toggleFavorite } from "@/lib/api";

export async function PATCH(request: Request) {
  const { userId, communityId, favorite } = await request.json();

  try {
    await toggleFavorite(userId, communityId, favorite);
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Oh No, Gremlins in the System. It seemes they stole the favorite toggle button.",
      },
      { status: 500 },
    );
  }
}
