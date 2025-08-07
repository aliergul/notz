"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";

export default function TagFilters() {
  const t = useTranslations("tags");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const currentQueryInUrl = searchParams.get("q") || "";
    if (searchQuery === currentQueryInUrl) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set("q", searchQuery);
    } else {
      params.delete("q");
    }

    const timeoutId = setTimeout(() => {
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchParams, pathname, router]);

  return (
    <div className="flex items-center gap-4">
      <Input
        placeholder={t("search_placeholder")}
        className="max-w-sm"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        disabled={isPending}
      />
    </div>
  );
}
