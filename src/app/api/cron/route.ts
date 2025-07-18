import { UTApi } from "uploadthing/server";

import db from "@/db";

export const preferredRegion = ["fra1"];
export const runtime = "edge";

const urlOrigin = "https://8t3elu199k.ufs.sh/f";

export async function GET() {
  const utapi = new UTApi();
  const [files, posts, users] = await Promise.all([
    db.query.postFiles.findMany({
      columns: { key: true },
    }),
    db.query.posts.findMany({
      where: (posts, { isNotNull }) => isNotNull(posts.text),
      columns: { text: true },
    }),
    db.query.users.findMany({
      columns: { image: true },
    }),
  ]);

  const destructuredFiles = files.map(({ key }) => key);
  const destructuredPosts = posts.map(({ text }) => text);
  const destructuredUsers = users.map(({ image }) => image);

  // default opts.limit 500
  // default opts.offset 0
  const uploadthingFiles = await utapi.listFiles();

  const filesToDelete = [];

  for (const file of uploadthingFiles.files) {
    if (
      // Check if the file is not in the files table
      !destructuredFiles.includes(file.key) &&
      // Check if the file is not referenced in any post text
      !destructuredPosts.some((text) =>
        text?.includes(
          `<img src="${urlOrigin}/${file.key}" alt="${file.name}">`,
        ),
      ) &&
      // Check if the file is not a user image
      !destructuredUsers.some((image) => image === `${urlOrigin}/${file.key}`)
    ) {
      filesToDelete.push(file.key);
    }
  }

  await utapi.deleteFiles(filesToDelete);

  return new Response("", { status: 200 });
}
