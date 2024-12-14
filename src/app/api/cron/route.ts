import { UTApi } from "uploadthing/server";

import { getFiles } from "@/api/getFiles";

export const runtime = "edge";
export const preferredRegion = ["fra1"];

export async function GET() {
  const utapi = new UTApi();
  const files = await getFiles;

  const destructuredFiles = files.map(({ key }) => key);
  // default opts.limit 500
  // default opts.offset 0
  const uploadthingFiles = await utapi.listFiles();

  const filesToDelete = [];

  for (const file of uploadthingFiles.files) {
    if (!destructuredFiles.includes(file.key)) {
      filesToDelete.push(file.key);
    }
  }

  await utapi.deleteFiles(filesToDelete);

  return new Response("", { status: 200 });
}
