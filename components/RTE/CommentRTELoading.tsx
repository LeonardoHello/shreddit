export default function CommentRTELoading() {
  return (
    <div className="animate-pulse rounded border border-zinc-700/70">
      <div className="prose prose-sm prose-zinc prose-invert min-h-[8rem] max-w-none px-4 py-2 focus:outline-none" />
      <div className="h-10 rounded-b bg-zinc-800" />
    </div>
  );
}
