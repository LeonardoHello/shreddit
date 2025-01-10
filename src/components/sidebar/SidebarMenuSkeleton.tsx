import { Skeleton } from "../ui/skeleton";

export default function SidebarMenuSkeleton({
  length = 3,
}: {
  length?: number;
}) {
  return (
    <menu>
      {Array.from({ length }).map((_, index) => (
        <li key={index} className="flex h-10 items-center gap-2 px-4">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton
            className="h-4"
            style={{ width: `${60 + ((index * 20) % 60)}px` }}
          />
        </li>
      ))}
    </menu>
  );
}
