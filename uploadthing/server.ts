import type { FileRouter } from "uploadthing/next";
import { createUploadthing } from "uploadthing/next";
import { UTApi } from "uploadthing/server";

import { FileSchema } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const uploadRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 12 } })
    .input(FileSchema.shape.id)
    // Set permissions and file types for this FileRoute
    .middleware(({ input }) => {
      // This code runs on your server before upload
      const { userId } = auth();

      // If you throw, the user will not be able to upload
      if (!userId) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId, postId: input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export const utapi = new UTApi();

export type OurFileRouter = typeof uploadRouter;
