import { Skeleton } from "../ui/skeleton";

export default function SidebarMenuSkeleton({
  length = 4,
}: {
  length?: number;
}) {
  return (
    <menu className="flex flex-col gap-2.5">
      {Array.from({ length }).map((_, index) => (
        <li key={index}>
          <Skeleton className="h-8" />
        </li>
      ))}
    </menu>
  );
}
