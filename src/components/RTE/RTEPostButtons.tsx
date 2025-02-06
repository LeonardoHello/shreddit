import React from "react";

import { BubbleMenu, Editor, FloatingMenu } from "@tiptap/react";

import { Separator } from "../ui/separator";
import RTEMarkButtons from "./RTEMarks";
import RTENodeButtons from "./RTENodes";

export default function RTEPostButtons({
  children,
  editor,
}: {
  children: React.ReactNode;
  editor: Editor;
}) {
  return (
    <>
      <BubbleMenu
        editor={editor}
        className="rounded-lg border bg-card p-1 sm:hidden"
      >
        <RTEMarkButtons editor={editor} />
      </BubbleMenu>

      <FloatingMenu
        editor={editor}
        className="flex items-center gap-2 overflow-x-auto rounded-lg border bg-card p-1 sm:hidden"
        tippyOptions={{ maxWidth: 200 }}
      >
        <RTENodeButtons editor={editor} />
        <Separator orientation="vertical" className="h-5" />
        {children}
      </FloatingMenu>

      <div className="hidden items-center gap-2 p-1 sm:flex">
        <RTEMarkButtons editor={editor} />
        <Separator orientation="vertical" className="h-5" />
        <RTENodeButtons editor={editor} />
        <Separator orientation="vertical" className="h-5" />
        {children}
      </div>
    </>
  );
}
