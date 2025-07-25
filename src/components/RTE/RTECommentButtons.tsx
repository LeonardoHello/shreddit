import { BubbleMenu, Editor, FloatingMenu } from "@tiptap/react";

import { Separator } from "../ui/separator";
import RTEMarks from "./RTEMarks";
import RTENodes from "./RTENodes";

export default function RTECommentButtons({ editor }: { editor: Editor }) {
  return (
    <>
      <BubbleMenu
        editor={editor}
        className="bg-card rounded-lg border p-1 sm:hidden"
      >
        <RTEMarks editor={editor} />
      </BubbleMenu>

      <FloatingMenu
        editor={editor}
        className="bg-card overflow-x-auto rounded-lg border p-1 sm:hidden"
        tippyOptions={{ maxWidth: 200 }}
      >
        <RTENodes editor={editor} />
      </FloatingMenu>

      <div className="hidden items-center gap-2 p-1 sm:flex">
        <RTEMarks editor={editor} />
        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4"
        />
        <RTENodes editor={editor} />
      </div>
    </>
  );
}
