import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="bg-background min-h-screen">
      {/* Main Content Skeleton */}
      <main className="container mx-auto max-w-4xl space-y-8 p-6">
        {/* Profile Information Card Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Manage your account details and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture Section Skeleton */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="absolute -right-2 -bottom-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>

            {/* Separator */}
            <div className="border-t" />

            {/* Form Fields Skeleton */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Username Field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-3" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* Social Provider Section Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>

            {/* Save Button Skeleton */}
            <div className="flex justify-end">
              <Skeleton className="h-10 w-28" />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone Card Skeleton */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-destructive/20 flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
              <div className="space-y-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-80" />
              </div>
              <Skeleton className="h-9 w-32" />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
