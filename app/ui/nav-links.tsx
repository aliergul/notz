"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  NewspaperIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Notlar", href: "/notes", icon: NewspaperIcon },
  { name: "Yapılacaklar", href: "/todos", icon: ListBulletIcon },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="flex space-x-6">
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <li key={link.name}>
            <Link
              href={link.href}
              className={clsx(
                "flex items-center gap-2 text-lg font-medium transition-colors",
                {
                  "text-blue-600 hover:text-blue-700": pathname === link.href,
                  "text-gray-700 hover:text-blue-600": pathname !== link.href,
                }
              )}
            >
              <LinkIcon className="w-6 h-6" />
              <span>{link.name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
