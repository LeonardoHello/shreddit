import {
  generateReactHelpers,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
export const { useUploadThing, getRouteConfig } =
  generateReactHelpers<OurFileRouter>();
