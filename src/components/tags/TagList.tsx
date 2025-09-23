"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Tag } from "@prisma/client";
import { softDeleteTag, permanentDeleteTag } from "../../actions/tags";
import { useTranslations } from "next-intl";
import { AnimatePresence } from "framer-motion";
import TagCard from "./TagCard";
import NewTagDialog from "./NewTagDialog";
import TagFilters from "./TagFilters";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface TagListProps {
  initialTags: Tag[];
}

export default function TagList({ initialTags }: TagListProps) {
  const t = useTranslations("tags");
  const router = useRouter();
  const [tags, setTags] = useState(initialTags);
  const [isPending, startTransition] = useTransition();
  const [pendingDeletionTagIds, setPendingDeletionTagIds] = useState<string[]>(
    []
  );

  useEffect(() => {
    setTags(initialTags);
    setPendingDeletionTagIds([]);
  }, [initialTags]);

  const handleAction = (action: () => Promise<void>) => {
    startTransition(async () => {
      await action();
      router.refresh();
    });
  };

  const handleOptimisticDelete = (tagId: string, isPermanent: boolean) => {
    startTransition(async () => {
      setPendingDeletionTagIds((prev) => [...prev, tagId]);
      const action = isPermanent ? permanentDeleteTag : softDeleteTag;
      await action(tagId);
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center ">
        <div className="py-4">
          <TagFilters />
        </div>
        <div className="ml-auto">
          <NewTagDialog onActionStart={handleAction} />
        </div>
      </div>

      <div className="relative flex-1">
        {isPending && (
          <div className="absolute top-0 right-0 z-20 p-2">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
        <div
          className={cn(
            "transition-opacity",
            isPending && "opacity-75 pointer-events-none"
          )}
        >
          {tags.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-lg border border-dashed shadow-sm p-4">
              <p className="text-muted-foreground">{t("empty_page")}</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {tags.map((tag) => (
                  <TagCard
                    key={tag.id}
                    tag={tag}
                    onDelete={handleOptimisticDelete}
                    isPendingDeletion={pendingDeletionTagIds.includes(tag.id)}
                    onActionStart={handleAction}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
