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
        className="bg-card rounded-lg border p-1 sm:hidden"
      >
        <RTEMarkButtons editor={editor} />
      </BubbleMenu>

      <FloatingMenu
        editor={editor}
        className="bg-card flex items-center gap-2 overflow-x-auto rounded-lg border p-1 sm:hidden"
        tippyOptions={{ maxWidth: 200 }}
      >
        <RTENodeButtons editor={editor} />
        <Separator orientation="vertical" />
        {children}
      </FloatingMenu>

      <div className="hidden items-center gap-2 p-1 sm:flex">
        <RTEMarkButtons editor={editor} />
        <Separator orientation="vertical" />
        <RTENodeButtons editor={editor} />
        <Separator orientation="vertical" />
        {children}
      </div>
    </>
  );
}
