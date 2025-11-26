import { UTApi } from "uploadthing/server";

import db from "@/db";

export const preferredRegion = ["fra1"];
export const runtime = "edge";

const urlOrigin = "https://8t3elu199k.ufs.sh/f";

export async function GET() {
  const utapi = new UTApi();
  const [files, posts, communities, users] = await Promise.all([
    db.query.postFiles.findMany({
      columns: { key: true },
    }),
    db.query.posts.findMany({
      where: (posts, { isNotNull }) => isNotNull(posts.text),
      columns: { text: true },
    }),
    db.query.communities.findMany({
      columns: { icon: true, banner: true },
    }),
    db.query.users.findMany({
      columns: { image: true },
    }),
  ]);

  const destructuredKeys = files.map(({ key }) => key);
  const destructuredPostTexts = posts.map(({ text }) => text);
  const destructuredCommunityIcons = communities.map(({ icon }) => icon);
  const destructuredCommunityBanners = communities.map(({ banner }) => banner);
  const destructuredUserImages = users.map(({ image }) => image);

  const destructuredUrls = destructuredUserImages.concat(
    destructuredCommunityIcons,
    destructuredCommunityBanners,
  );

  // default opts.limit 500
  // default opts.offset 0
  const uploadthingFiles = await utapi.listFiles();

  const filesToDelete = [];

  for (const file of uploadthingFiles.files) {
    if (
      // Check if the file is not in the files table
      !destructuredKeys.includes(file.key) &&
      // Check if the file is not referenced in any post text
      !destructuredPostTexts.some((text) =>
        text?.includes(
          `<img src="${urlOrigin}/${file.key}" alt="${file.name}">`,
        ),
      ) &&
      !destructuredUrls.some((url) => url === `${urlOrigin}/${file.key}`)
    ) {
      filesToDelete.push(file.key);
    }
  }

  await utapi.deleteFiles(filesToDelete);

  return Response.json({ message: "sucess" }, { status: 200 });
}
