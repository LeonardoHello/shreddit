import type { NextRequest } from "next/server";
import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { data, type }: WebhookEvent = await req.json();

  switch (type) {
    case "user.created":
      await db.insert(users).values({
        id: data.id,
        username: data.username ?? data.first_name,
      });
      break;

    case "user.updated":
      await db
        .update(users)
        .set({ username: data.username ?? data.first_name })
        .where(eq(users.id, data.id));
      break;

    default:
      if (data.id) {
        await db.delete(users).where(eq(users.id, data.id));
      }
  }

  return new Response(null, {
    status: 200,
  });
}
