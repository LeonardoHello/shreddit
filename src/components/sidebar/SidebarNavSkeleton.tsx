"use client";

import { ChevronDown, Star } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export default function SidebarNavSkeleton({
  itemCount = 3,
  canFavorite = true,
}: {
  itemCount: number;
  canFavorite?: boolean;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="group/label">
        <Skeleton className="h-3 max-w-22 flex-1" />
        <ChevronDown className="text-muted ml-auto" />
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {Array.from({ length: itemCount }).map((_, index) => (
            <SidebarMenuItem key={index}>
              <div className="flex h-8 w-full items-center gap-2 rounded-md p-2">
                <Skeleton className="size-7 flex-shrink-0 rounded-full" />
                <div className="flex w-full min-w-0 items-center justify-between">
                  <Skeleton
                    style={{ width: `${80 + ((index * 30) % 40)}px` }}
                    className="h-4"
                  />
                  {canFavorite && (
                    <Star className="fill-muted text-muted size-4" />
                  )}
                </div>
              </div>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
