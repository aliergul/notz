"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { User } from "next-auth";
import {
  Home,
  NotebookPen,
  CheckSquare,
  Trash2,
  LogOut,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Shadcn'in yardımcı fonksiyonu
import { useTranslations } from "next-intl";

interface SidebarProps {
  user: User;
  // Mobil için (ileride eklenecek)
  // onLinkClick?: () => void;
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslations("sidebar_navbar");

  const navItems = [
    { href: "/dashboard", label: t("home_page"), icon: Home },
    { href: "/dashboard/notes", label: t("notes_page"), icon: NotebookPen },
    { href: "/dashboard/todos", label: t("todos_page"), icon: CheckSquare },
    { href: "/dashboard/tags", label: t("tags_page"), icon: Tag },
    { href: "/dashboard/trash", label: t("trash_page"), icon: Trash2 },
  ];

  console.log("user", user);

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <NotebookPen className="h-6 w-6" />
            <span className="">Notz</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname === item.href && "bg-muted text-primary"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button
            onClick={() => signOut()}
            variant="secondary"
            className="w-full cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t("logout")}
          </Button>
        </div>
      </div>
    </div>
  );
}
