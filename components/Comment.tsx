import { ArrElement, InfiniteQueryPost } from "@/lib/types";

export default function Comment({
  comment,
}: {
  comment: ArrElement<InfiniteQueryPost["comments"]>;
}) {
  return (
    <div>
      <div>{comment.text}</div>
    </div>
  );
}
