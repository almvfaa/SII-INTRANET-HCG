"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users2, BookOpen, Package, ClipboardList, UtensilsCrossed } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const topLevelNavItems = [
  { href: "/", label: "Panel Principal", icon: LayoutDashboard },
  { href: "/profiles", label: "Perfiles", icon: Users2 },
];

const dietAndNutritionNavItems = [
  { href: "/catalog", label: "Catálogo", icon: BookOpen },
  { href: "/ingredients", label: "Ingredientes", icon: Package },
  { href: "/orders", label: "Pedidos", icon: ClipboardList },
];

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col items-start gap-2 p-2", className)} {...props}>
      <TooltipProvider>
        {topLevelNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Tooltip key={item.href} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary w-full",
                    isActive && "bg-accent text-accent-foreground hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="truncate">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
        
        <Accordion type="single" collapsible className="w-full"
          defaultValue={dietAndNutritionNavItems.some(item => pathname.startsWith(item.href)) ? "diet-nutrition" : undefined}
        >
          <AccordionItem value="diet-nutrition" className="border-b-0">
            <AccordionTrigger className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:no-underline w-full">
              <UtensilsCrossed className="h-5 w-5" />
              <span className="truncate">Departamento de Dietología y Nutrición</span>
            </AccordionTrigger>
            <AccordionContent className="pl-4">
              {dietAndNutritionNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Tooltip key={item.href} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary w-full",
                          isActive && "bg-accent text-accent-foreground hover:text-accent-foreground"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

      </TooltipProvider>
    </nav>
  );
}
