import { headers } from "next/headers";

import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import { eq } from "drizzle-orm";
import { Webhook } from "svix";

import db from "@/lib/db";
import { users } from "@/lib/db/schema";

export const runtime = "edge";
export const preferredRegion = ["fra1"];

export async function POST(req: Request) {
  // https://clerk.com/docs/users/sync-data#sync-clerk-data-to-your-backend-with-webhooks

  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!CLERK_WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(CLERK_WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const { data, type } = evt;

  switch (type) {
    case "user.created":
      await db.insert(users).values({
        id: data.id,
        name: data.username ?? data.id,
        imageUrl: data.image_url,
      });
      break;

    case "user.updated":
      await db
        .update(users)
        .set({
          name: data.username ?? data.id,
          imageUrl: data.image_url,
        })
        .where(eq(users.id, data.id));
      break;

    default:
      if (data.id) {
        await db.delete(users).where(eq(users.id, data.id));
      }
  }

  return new Response("", { status: 200 });
}
