import { NextResponse } from "next/server";

import sharp from "sharp";
import * as thumbhash from "thumbhash";

import { PostFileSchema } from "@/db/schema";

const postFileSchema = PostFileSchema.pick({
  key: true,
  url: true,
  name: true,
}).array();

export async function POST(req: Request) {
  const input = await req.json();
  const parsedInput = postFileSchema.parse(input);

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

  return NextResponse.json(thumbHashes, { status: 200 });
}
