import { cn } from "@/utils/cn";
import { Skeleton } from "../ui/skeleton";

export default function RTESkeleton({
  content,
}: {
  content?: string | TrustedHTML;
}) {
  return (
    <div className="rounded border bg-card">
      <Skeleton
        className={cn("h-10 rounded-none rounded-t", {
          "hidden lg:block": !content,
        })}
      />
      <div
        className="prose prose-sm prose-zinc prose-invert min-h-[8rem] max-w-none px-4 py-2 focus:outline-none"
        dangerouslySetInnerHTML={{ __html: content ?? "" }}
      />

      <div className="flex h-10 justify-end gap-2 rounded-t p-1.5">
        <Skeleton className="w-16 rounded-full" />

        <Skeleton className="w-[88px] rounded-full" />
      </div>
    </div>
  );
}
