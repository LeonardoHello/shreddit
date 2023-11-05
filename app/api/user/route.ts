import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import db from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const { data, type }: WebhookEvent = await req.json();

  switch (type) {
    case "user.created":
      await db.insert(users).values({
        id: data.id,
        name: data.username as string,
        imageUrl: data.image_url,
      });

      break;

    case "user.updated":
      await db
        .update(users)
        .set({
          name: data.username as string,
          imageUrl: data.image_url,
        })
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
