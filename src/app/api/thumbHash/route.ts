import sharp from "sharp";
import * as thumbhash from "thumbhash";
import * as v from "valibot";

import { PostFileSchema } from "@/db/schema/posts";

export async function POST(req: Request) {
  const input = await req.json();

  const parsedInput = v.parse(
    v.array(v.pick(PostFileSchema, ["key", "url", "name"])),
    input,
  );

  const thumbHashes = await Promise.all(
    parsedInput.map(async (file) => {
      const imgArrayBuffer = await fetch(file.url);

      const arrayBuffer = await imgArrayBuffer.arrayBuffer();

      const imageFile = sharp(arrayBuffer).resize(100, 100, {
        fit: "inside",
      });

      const { data, info } = await imageFile
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      const binaryThumbHash = thumbhash.rgbaToThumbHash(
        info.width,
        info.height,
        data,
      );

      return {
        ...file,
        thumbHash: Buffer.from(binaryThumbHash).toString("base64"),
      };
    }),
  );

  return Response.json(thumbHashes, { status: 200 });
}
