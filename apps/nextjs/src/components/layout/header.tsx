"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu } from "lucide-react";

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

import { logout } from "~/actions/auth";

const navigation = [
  { name: "Top 100 Coins", href: "/" },
  { name: "Favorites", href: "/favorites" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isAuthPage =
    pathname === "/sign-in" ||
    pathname === "/sign-up" ||
    pathname === "/error" ||
    pathname.startsWith("/auth");

  const Logo = () => (
    <Link
      href="/"
      className="flex items-center transition-colors hover:opacity-90"
    >
      <span className="bg-gradient-to-r from-blue-500 to-blue-600/80 bg-clip-text text-xl font-bold text-transparent">
        Crypto Tracker
      </span>
    </Link>
  );

  const NavLink = ({
    item,
    mobile,
  }: {
    item: (typeof navigation)[number];
    mobile?: boolean;
  }) => (
    <Button
      variant="ghost"
      className={cn(
        "transition-colors",
        mobile && "h-11 w-full justify-start",
        pathname === item.href && "font-medium text-blue-500",
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
          <Button
            variant="ghost"
            className="text-red-500 hover:text-red-600"
            onClick={() => void logout()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
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
          className="transition-colors hover:bg-accent/50"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] p-0 sm:w-[350px]">
        <SheetHeader className="border-b p-6 pb-4">
          <SheetTitle className="bg-gradient-to-r from-blue-500 to-blue-600/80 bg-clip-text text-left text-xl font-bold text-transparent">
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
          <div className="my-6 h-px bg-border" />
          <Button
            variant="ghost"
            className="h-11 w-full justify-start font-normal text-red-500 hover:text-red-600"
            onClick={() => {
              void logout();
              setOpen(false);
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        {!isAuthPage && (
          <>
            <div className="hidden md:block">
              <DesktopNav />
            </div>
            <div className="md:hidden">
              <MobileNav />
            </div>
          </>
        )}
      </div>
    </header>
  );
}