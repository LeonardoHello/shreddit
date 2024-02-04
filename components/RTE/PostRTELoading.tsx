export default function PostRTELoading() {
  return (
    <div className="animate-pulse rounded border border-zinc-700/70">
      <div className="h-10 rounded-t bg-zinc-800" />
      <div className="prose prose-sm prose-zinc prose-invert min-h-[8rem] max-w-none px-4 py-2 focus:outline-none" />
    </div>
  );
}
