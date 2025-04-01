import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

export default function FeedEmpty() {
  return (
    <div className="border-border/50 relative flex grow flex-col rounded border">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-card flex gap-2 p-2 opacity-20">
          <div className="text-muted-foreground flex flex-col items-center gap-4 select-none">
            <ArrowUpCircle className="h-8 w-8 rounded" />
            <ArrowDownCircle className="h-8 w-8 rounded" />
          </div>
          <div className="bg-muted-foreground/25 min-h-full w-32 rounded" />
          <div className="flex grow flex-col gap-2">
            <div className="bg-muted-foreground/25 h-6 w-2/3 rounded" />
            <div className="bg-muted-foreground/25 h-3 w-2/3 rounded" />
            <div className="mt-auto flex h-3 w-1/3 gap-2">
              <div className="bg-muted-foreground/25 w-6 rounded" />
              <div className="bg-muted-foreground/25 grow rounded" />
            </div>
          </div>
        </div>
      ))}
      <div className="absolute top-1/4 flex flex-col items-center gap-2 self-center p-12 text-center">
        <h1 className="text-lg font-medium">
          hmm... looks like nothing has been posted yet
        </h1>
      </div>
    </div>
  );
}
