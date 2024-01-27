import { auth } from "@clerk/nextjs";
import { type FileRouter, createUploadthing } from "uploadthing/next";

import { setFile } from "@/lib/api/setFile";
import { FileSchema } from "@/lib/db/schema";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(() => {
      // This code runs on your server before upload
      const { userId } = auth();

      // If you throw, the user will not be able to upload
      if (!userId) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      // await setFile({
      //   key: file.key,
      //   name: file.name,
      //   url: file.url,
      //   postId: metadata.postId,
      // });

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { file };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
