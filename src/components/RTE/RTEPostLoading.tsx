import { Post } from "@/db/schema";
import cn from "@/utils/cn";

export default function RTEPostLoading({
  content,
}: {
  content?: Post["text"];
}) {
  return (
    <div className="animate-pulse rounded border border-zinc-700/70">
      <div
        className={cn("h-10 rounded-t bg-zinc-800", {
          "hidden lg:block": !content,
        })}
      />
      {content && (
        <div
          className="prose prose-sm prose-zinc prose-invert min-h-[8rem] max-w-none px-4 py-2 focus:outline-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
      {!content && (
        <div className="prose prose-sm prose-zinc prose-invert min-h-[8rem] max-w-none px-4 py-2 focus:outline-none" />
      )}
    </div>
  );
}
