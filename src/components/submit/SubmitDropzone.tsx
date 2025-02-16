"use client";

import { toast } from "sonner";

import {
  ReducerAction,
  useSubmitContext,
  useSubmitDispatchContext,
} from "@/context/SubmitContext";
import { PostFileSchema } from "@/db/schema/posts";
import { UploadDropzone } from "@/utils/uploadthing";

const postFileSchema = PostFileSchema.pick({
  key: true,
  url: true,
  name: true,
  thumbHash: true,
}).array();

export default function SubmitDropzone() {
  const state = useSubmitContext();
  const dispatch = useSubmitDispatchContext();

  return (
    <UploadDropzone
      endpoint="imageUploader"
      onBeforeUploadBegin={(files) => {
        dispatch({ type: ReducerAction.DISABLE_SUBMIT });

        return files;
      }}
      content={{
        label: () => {
          return (
            <div>
              <p>Choose files or drag and drop</p>
              {state.files.length > 0 && (
                <p className="text-gray-400">
                  Uploaded {state.files.length} File(s)
                </p>
              )}
            </div>
          );
        },
      }}
      className="mt-0 min-h-[18rem] rounded border border-zinc-700/70"
      onClientUploadComplete={async (res) => {
        const files = res.map((file) => ({
          name: file.name,
          key: file.key,
          url: file.appUrl,
        }));

        const response = await fetch("/api/thumbHash", {
          method: "POST",
          body: JSON.stringify(files),
        });

        const data = await response.json();

        const parsedFiles = postFileSchema.parse(data);

        dispatch({
          type: ReducerAction.SET_FILES,
          nextFiles: parsedFiles,
        });
        dispatch({ type: ReducerAction.ENABLE_SUBMIT });
      }}
      onUploadError={(e) => {
        toast.error(e.message);
      }}
    />
  );
}
