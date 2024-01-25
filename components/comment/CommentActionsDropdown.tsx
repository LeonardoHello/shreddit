import { useTransition } from "react";

import { useRouter } from "next/navigation";

import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

import { useCommentContext } from "@/lib/context/CommentContextProvider";
import cn from "@/lib/utils/cn";
import { trpc } from "@/trpc/react";

export default function CommentActionsDropdown({
  toggleEdit,
}: {
  toggleEdit: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const comment = useCommentContext();

  const deleteComment = trpc.deleteComment.useMutation({
    onError: async ({ message }: { message: string }) => {
      toast.error(message);
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      toast.success("Comment deleted successfully.");
    },
  });

  const isMutating = isPending || deleteComment.isLoading;

  return (
    <div
      className={cn(
        "absolute right-0 z-10 flex w-48 flex-col border border-zinc-700/70 bg-zinc-900 text-sm font-medium shadow-[0_2px_4px_0] shadow-zinc-300/20 md:left-0",
        { "pointer-events-none opacity-40": isMutating },
      )}
    >
      <div
        className="flex items-center gap-2 border-b border-zinc-700/70 px-1.5 py-2 hover:bg-zinc-700/50"
        onClick={toggleEdit}
      >
        <PencilSquareIcon className="h-5 w-5" /> Edit
      </div>

      <div
        className="flex items-center gap-2 px-1.5 py-2 hover:bg-zinc-700/50"
        onClick={() => {
          if (isMutating) return;

          deleteComment.mutate(comment.id);
        }}
      >
        <TrashIcon className="h-5 w-5" /> Delete
      </div>
    </div>
  );
}
