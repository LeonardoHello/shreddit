import { toast } from "sonner";

import {
  REDUCER_ACTION_TYPE,
  useSubmitContext,
} from "@/lib/context/SubmitContextProvider";
import { UploadDropzone } from "@/lib/utils/uploadthing";

export default function SubmitDropzone() {
  const { state, dispatch } = useSubmitContext();

  return (
    <UploadDropzone
      endpoint="imageUploader"
      content={{
        label: () => {
          return (
            <div>
              <p>Choose files or drag and drop</p>
              {state.files.length > 0 && (
                <p className="text-gray-400">
                  Uploaded {state.files.length} files
                </p>
              )}
            </div>
          );
        },
      }}
      className="mt-0 min-h-[18rem] rounded border border-zinc-700/70"
      onClientUploadComplete={(res) => {
        const files = res.map(({ size, serverData, ...rest }) => rest);

        dispatch({
          type: REDUCER_ACTION_TYPE.CHANGED_FILES,
          nextFiles: files,
        });
      }}
      onUploadError={(e) => {
        toast.error(e.message);
      }}
    />
  );
}
