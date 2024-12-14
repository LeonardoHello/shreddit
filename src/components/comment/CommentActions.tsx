import {
  ChatBubbleLeftIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";

import { useCommentContext } from "@/context/CommentContextProvider";
import type { User } from "@/db/schema";
import useDropdown from "@/hooks/useDropdown";
import CommentVote from "./CommentVote";

export default function CommentActions({
  currentUserId,
  children,
}: {
  currentUserId: User["id"] | null;
  children: React.ReactNode;
}) {
  const { dropdownRef, isOpen, setIsOpen } = useDropdown();

  const { comment, setReply } = useCommentContext();

  return (
    <div className="flex items-center gap-1 text-xs font-bold text-zinc-500">
      <CommentVote currentUserId={currentUserId} />
      <div
        className="flex cursor-pointer items-center gap-1 rounded px-1 py-0.5 transition-colors hover:bg-zinc-700/50"
        onClick={() => setReply((prev) => !prev)}
      >
        <ChatBubbleLeftIcon className="h-6 w-6" />
        <span className="hidden sm:block">Relpy</span>
      </div>
      {comment.authorId === currentUserId && (
        <div
          ref={dropdownRef}
          className="cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <EllipsisHorizontalIcon className="h-6 w-6 rounded hover:bg-zinc-700/50" />
          {isOpen && children}
        </div>
      )}
    </div>
  );
}
