import { useRouter } from "next/navigation";

import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

import { Community } from "@/db/schema";
import { trpc } from "@/trpc/client";

export default function CommunityOptions({
  communityId,
  setEdit,
}: {
  communityId: Community["id"];
  setEdit: (value: boolean) => void;
}) {
  const router = useRouter();

  const deleteCommunity = trpc.community.deleteCommunity.useMutation({
    onSuccess: (data) => {
      router.replace("/");
      toast.success(`Successfully deleted r/${data[0].name}`);
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return (
    <div className="hover:bg-zinc absolute right-0 z-10 flex w-48 flex-col rounded border border-zinc-700/70 bg-zinc-900 text-sm font-medium shadow-[0_2px_4px_0] shadow-zinc-300/20">
      <div
        className="flex items-center gap-2 border-b border-zinc-700/70 px-1.5 py-2 hover:bg-zinc-700/50"
        onClick={() => setEdit(true)}
      >
        <PencilSquareIcon className="h-5 w-5" /> Edit
      </div>
      <div
        className="flex items-center gap-2 border-b border-zinc-700/70 px-1.5 py-2 hover:bg-zinc-700/50"
        onClick={() => {
          deleteCommunity.mutate(communityId);
        }}
      >
        <TrashIcon className="h-5 w-5" /> Delete
      </div>
    </div>
  );
}
