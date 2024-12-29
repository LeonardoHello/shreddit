import {
  ChatBubbleLeftIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";

import {
  ReducerAction,
  useCommentContext,
  useCommentDispatchContext,
} from "@/context/CommentContext";
import type { User } from "@/db/schema";
import useDropdown from "@/hooks/useDropdown";
import CommentVote from "./CommentVote";

export default function CommentActions({
  currentUserId,
  children,
}: {
  currentUserId: User["id"];
  children: React.ReactNode;
}) {
  const { dropdownRef, isOpen, setIsOpen } = useDropdown();

  const state = useCommentContext();
  const dispatch = useCommentDispatchContext();

  return (
    <div className="flex items-center gap-1 text-xs font-bold text-zinc-500">
      <CommentVote />
      <div
        className="flex cursor-pointer items-center gap-1 rounded px-1 py-0.5 transition-colors hover:bg-zinc-700/50"
        onClick={() => {
          dispatch({ type: ReducerAction.TOGGLE_REPLY });
        }}
      >
        <ChatBubbleLeftIcon className="h-6 w-6" />
        <span className="hidden sm:block">Relpy</span>
      </div>

      {state.authorId === currentUserId && (
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
