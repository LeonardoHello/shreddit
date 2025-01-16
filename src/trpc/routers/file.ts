import sharp from "sharp";
import * as thumbhash from "thumbhash";

import { PostFileSchema } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "../init";

export const fileRouter = createTRPCRouter({
  createThumbHash: protectedProcedure
    .input(PostFileSchema.pick({ key: true, url: true, name: true }).array())
    .mutation(({ input }) => {
      return Promise.all(
        input.map(async (file) => {
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
    }),
});
