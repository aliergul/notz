"use client";

import { Menu, Settings, SunMoon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import LanguageSwitcher from "@/components/language-switcher";
import { User } from "next-auth";
import UserNav from "./UserNav";

interface HeaderProps {
  user: User;
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      {/* Mobil Hamburger Menü */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          {/* Buraya mobil için sidebar bileşeni gelecek */}
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1"></div>

      <Button variant="outline" size="icon" disabled className="cursor-pointer">
        <SunMoon className="h-5 w-5" />
      </Button>
      <Button variant="outline" size="icon" disabled className="cursor-pointer">
        <Settings className="h-5 w-5" />
      </Button>
      <LanguageSwitcher />
      <UserNav user={user} />
    </header>
  );
}
