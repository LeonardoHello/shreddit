import { auth } from "@clerk/nextjs";
import { type FileRouter, createUploadthing } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 12 } })
    // Set permissions and file types for this FileRoute
    .middleware(() => {
      // This code runs on your server before upload
      const { userId } = auth();

      // If you throw, the user will not be able to upload
      if (!userId) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return {};
    })
    .onUploadComplete(({ file }) => {
      // This code RUNS ON YOUR SERVER after upload

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { file };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
