"use client";

import { toast } from "sonner";

import {
  ReducerAction,
  useSubmitContext,
  useSubmitDispatchContext,
} from "@/context/SubmitContext";
import { trpc } from "@/trpc/client";
import { UploadDropzone } from "@/utils/uploadthing";

export default function SubmitDropzone() {
  const state = useSubmitContext();
  const dispatch = useSubmitDispatchContext();

  const createThumbHash = trpc.file.createThumbHash.useMutation({
    onSuccess: (data) => {
      dispatch({
        type: ReducerAction.SET_FILES,
        nextFiles: data,
      });
      dispatch({ type: ReducerAction.ENABLE_SUBMIT });
    },
  });

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
      onClientUploadComplete={(res) => {
        createThumbHash.mutate(
          res.map((file) => ({
            name: file.name,
            key: file.key,
            url: file.url,
          })),
        );
      }}
      onUploadError={(e) => {
        toast.error(e.message);
      }}
    />
  );
}
