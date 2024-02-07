import { UTApi } from "uploadthing/server";

import { getFiles } from "@/lib/api/getFiles";

export const runtime = "edge";
export const preferredRegion = ["fra1"];

export async function DELETE() {
  const utapi = new UTApi();
  const files = await getFiles;

  const destructuredFiles = files.map(({ key }) => key);
  const uploadthingFiles = await utapi.listFiles({});

  const filesToDelete = [];

  for (const file of uploadthingFiles) {
    if (!destructuredFiles.includes(file.key)) {
      filesToDelete.push(file.key);
    }
  }

  await utapi.deleteFiles(filesToDelete);

  return new Response("", { status: 200 });
}
