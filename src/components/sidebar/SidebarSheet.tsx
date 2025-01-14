"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";

export default function SidebarSheet({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full xl:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={"left"}
        style={{ scrollbarWidth: "thin", colorScheme: "dark" }}
        className="overflow-y-auto bg-card"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Navigate through communities and access your personalized menus
          </SheetDescription>
        </SheetHeader>

        {children}
      </SheetContent>
    </Sheet>
  );
}
