import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="grid grow place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <Badge variant="secondary" className="mb-2">
          404
        </Badge>

        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          PAGE NOT FOUND
        </h1>

        <p className="text-muted-foreground mt-6 leading-7 font-semibold sm:text-lg">
          The page you are looking for does not exist.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          <Button variant="link" asChild className="group">
            <Link href="/">
              Go back home{" "}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
