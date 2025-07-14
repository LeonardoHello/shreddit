"use client";

import { Loader2 } from "lucide-react";

import { useSubmitContext } from "@/context/SubmitContext";
import { Button } from "../ui/button";

export default function SubmitButtonFake() {
  const state = useSubmitContext();

  return (
    <Button className="order-2 self-end rounded-full" disabled>
      {state.isUploading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Uploading...
        </>
      ) : (
        "Post"
      )}
    </Button>
  );
}
