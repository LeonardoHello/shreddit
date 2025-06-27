import Image from "next/image";

import { LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import shrek from "@public/shrek.svg";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header with logout button */}
      <header className="bg-card flex h-16 items-center justify-between border-b px-4">
        <Image
          src={shrek}
          quality={1}
          alt="shrek icon"
          className="size-10"
          priority
        />

        <Button variant="outline" disabled>
          <LogOut />
          Log out
        </Button>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <User className="size-6 animate-pulse text-blue-600" />
            </div>
            <Skeleton className="mx-auto mb-2 h-8 w-48" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mx-auto h-4 w-3/4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="size-4 rounded-full" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>

              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
