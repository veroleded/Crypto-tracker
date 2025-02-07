"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@acme/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@acme/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@acme/ui/sheet";
import { cn } from "@acme/ui/utils";
import { LogoutButton } from "~/components/logout-button";

const navigation = [
  { name: "Top 100 Coins", href: "/" },
  { name: "Favorites", href: "/favorites" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const Logo = () => (
    <Link
      href="/"
      className="flex items-center transition-colors hover:opacity-90"
    >
      <span className="font-bold text-xl bg-gradient-to-r from-blue-500 to-blue-600/80 bg-clip-text text-transparent">
        Crypto Tracker
      </span>
    </Link>
  );

  const NavLink = ({ item, mobile }: { item: typeof navigation[number]; mobile?: boolean; }) => (
    <Button
      variant="ghost"
      className={cn(
        "transition-colors",
        mobile && "w-full justify-start h-11",
        pathname === item.href && "text-blue-500 font-medium"
      )}
    >
      {item.name}
    </Button>
  );

  const DesktopNav = () => (
    <NavigationMenu>
      <NavigationMenuList className="flex flex-row gap-2">
        {navigation.map((item) => (
          <NavigationMenuItem key={item.name}>
            <Link href={item.href}>
              <NavLink item={item} />
            </Link>
          </NavigationMenuItem>
        ))}
        <NavigationMenuItem>
          <LogoutButton
            className={cn(
              "h-9",
              "font-normal",
              "text-muted-foreground hover:text-foreground",
              "transition-all duration-200"
            )}
          />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );

  const MobileNav = () => (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-accent/50 transition-colors"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[350px] p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="text-left font-bold text-xl bg-gradient-to-r from-blue-500 to-blue-600/80 bg-clip-text text-transparent">
            Crypto Tracker
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col p-4">
          <div className="flex flex-col gap-2">
            {navigation.map((item) => (
              <SheetClose key={item.name} asChild>
                <Link href={item.href} className="w-full">
                  <NavLink item={item} mobile />
                </Link>
              </SheetClose>
            ))}
          </div>
          <div className="h-px bg-border my-6" />
          <SheetClose asChild>
            <LogoutButton
              className={cn(
                "w-full h-11",
                "justify-start font-normal",
                "text-muted-foreground hover:text-foreground",
                "transition-all duration-200"
              )}
            />
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <div className="hidden md:block">
          <DesktopNav />
        </div>
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}