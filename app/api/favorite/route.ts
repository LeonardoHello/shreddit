import { toggleFavorite } from "@/lib/api";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  userId: z.string(),
  communityId: z.string().uuid(),
  favorite: z.boolean(),
});

export async function PATCH(request: Request) {
  const body = await request.json();

  try {
    const { userId, communityId, favorite } = schema.parse(body);

    await toggleFavorite(userId, communityId, favorite);
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    if (!(error instanceof Error)) return NextResponse.error();

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
