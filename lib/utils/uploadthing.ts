import { generateComponents } from "@uploadthing/react";

import type { OurFileRouter } from "@/uploadthing/server";

export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<OurFileRouter>();
