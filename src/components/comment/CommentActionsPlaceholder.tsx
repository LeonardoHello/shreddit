import { ClerkLoaded, ClerkLoading, SignInButton } from "@clerk/nextjs";
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";

import { useCommentContext } from "@/context/CommentContext";

export default function CommentActionsPlaceholder() {
  const state = useCommentContext();

  return (
    <div className="flex items-center gap-1 text-xs font-bold text-zinc-500">
      <div className="flex select-none items-center gap-1 text-zinc-500">
        <ClerkLoading>
          <ArrowUpCircleIcon className="order-1 h-7 w-7 cursor-pointer rounded transition-colors hover:bg-zinc-700/50" />
          <ArrowDownCircleIcon className="order-3 h-7 w-7 cursor-pointer rounded transition-colors hover:bg-zinc-700/50" />
        </ClerkLoading>

        <ClerkLoaded>
          <SignInButton mode="modal">
            <ArrowUpCircleIcon className="order-1 h-7 w-7 cursor-pointer rounded transition-colors hover:bg-zinc-700/50" />
          </SignInButton>
          <SignInButton mode="modal">
            <ArrowDownCircleIcon className="order-3 h-7 w-7 cursor-pointer rounded transition-colors hover:bg-zinc-700/50" />
          </SignInButton>
        </ClerkLoaded>

        <div className="order-2 text-xs font-bold text-zinc-300 transition-colors">
          {new Intl.NumberFormat("en-US", {
            notation: "compact",
            maximumFractionDigits: 1,
          }).format(state.voteCount)}
        </div>
      </div>

      <ClerkLoading>
        <div className="flex cursor-pointer items-center gap-1 rounded px-1 py-0.5 transition-colors hover:bg-zinc-700/50">
          <ChatBubbleLeftIcon className="h-6 w-6" />
          <span className="hidden sm:block">Relpy</span>
        </div>
      </ClerkLoading>

      <ClerkLoaded>
        <SignInButton mode="modal">
          <div className="flex cursor-pointer items-center gap-1 rounded px-1 py-0.5 transition-colors hover:bg-zinc-700/50">
            <ChatBubbleLeftIcon className="h-6 w-6" />
            <span className="hidden sm:block">Relpy</span>
          </div>
        </SignInButton>
      </ClerkLoaded>
    </div>
  );
}
