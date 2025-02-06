import { BubbleMenu, Editor, FloatingMenu } from "@tiptap/react";

import { Separator } from "../ui/separator";
import RTEMarks from "./RTEMarks";
import RTENodes from "./RTENodes";

export default function RTECommentButtons({ editor }: { editor: Editor }) {
  return (
    <>
      <BubbleMenu
        editor={editor}
        className="rounded-lg border bg-card p-1 sm:hidden"
      >
        <RTEMarks editor={editor} />
      </BubbleMenu>

      <FloatingMenu
        editor={editor}
        className="overflow-x-auto rounded-lg border bg-card p-1 sm:hidden"
        tippyOptions={{ maxWidth: 200 }}
      >
        <RTENodes editor={editor} />
      </FloatingMenu>

      <div className="hidden items-center gap-2 p-1 sm:flex">
        <RTEMarks editor={editor} />
        <Separator orientation="vertical" className="h-5" />
        <RTENodes editor={editor} />
      </div>
    </>
  );
}
