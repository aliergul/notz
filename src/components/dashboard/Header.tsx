"use client";

import { User } from "next-auth";
import UserNav from "./UserNav"; // Değişiklik: Import yolu göreceli yapıldı
import LanguageSwitcher from "../language-switcher"; // Değişiklik: Import yolu göreceli yapıldı
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import { useState } from "react";

interface HeaderProps {
  user: User;
}

export default function Header({ user }: HeaderProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden cursor-pointer"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <Sidebar user={user} onLinkClick={() => setIsSheetOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1" />
      <LanguageSwitcher />
      <UserNav user={user} />
    </header>
  );
}
