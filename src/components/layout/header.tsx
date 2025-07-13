"use client";

import Link from "next/link";
import {
  ChefHat,
  Menu,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MainNav } from "./main-nav";

export function Header() {
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 lg:hidden">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <ChefHat className="h-6 w-6 text-primary" />
        <span className="font-headline">NutriPlan AI</span>
      </Link>
      <div className="ml-auto">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <MainNav />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
