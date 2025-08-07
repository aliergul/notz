"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import type { Tag } from "@prisma/client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NoteFiltersProps {
  allTags: Tag[];
}

export default function NoteFilters({ allTags }: NoteFiltersProps) {
  const t = useTranslations("notes");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const handleTagChange = (tagId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tagId && tagId !== "all_tags") {
      params.set("tag", tagId);
    } else {
      params.delete("tag");
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

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
      <Select
        onValueChange={handleTagChange}
        defaultValue={searchParams.get("tag") || "all_tags"}
        disabled={isPending}
      >
        <SelectTrigger className="w-[180px] cursor-pointer">
          <SelectValue placeholder={t("filter_by_tag")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all_tags" className="cursor-pointer">
            {t("all_tags")}
          </SelectItem>
          {allTags.map((tag) => (
            <SelectItem key={tag.id} value={tag.id} className="cursor-pointer">
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: tag.color || "#888888" }}
                />
                <span>{tag.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
