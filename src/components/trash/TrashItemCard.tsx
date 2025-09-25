"use client";

import type { Note, Tag, Todo } from "@prisma/client";
import { useFormatter, useTranslations } from "next-intl";
import { permanentDeleteItem, restoreItem } from "@/actions/trash";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import clsx from "clsx";
import { toast } from "sonner";
import ButtonSpinner from "../spinner";
import { useState } from "react";

type ItemType = "note" | "todo" | "tag";

interface TrashItemCardProps {
  item: Note | Todo | Tag;
  type: ItemType;
  isPending: boolean;
  onActionStart: (itemId: string, action: () => Promise<void>) => void;
}

export default function TrashItemCard({
  item,
  type,
  isPending,
  onActionStart,
}: TrashItemCardProps) {
  const displayName = "title" in item ? item.title : item.name;
  const t = useTranslations("trash");
  const t_notify = useTranslations("notifications");
  const format = useFormatter();
  const [isRestore, setIsRestore] = useState(false);
  const [isPermanent, setIsPermanent] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.2 }}
      className="relative"
    >
      {isPending && (
        <div className="absolute inset-0 z-30 flex items-center justify-center rounded-lg backdrop-blur-xs"></div>
      )}
      <div
        className={clsx(
          "flex items-center justify-between rounded-lg border p-4 transition-opacity",
          isPending && "opacity-50"
        )}
      >
        <div>
          <p className="font-semibold">{displayName}</p>
          <p className="text-sm text-muted-foreground">
            {t("delete_date")}:{" "}
            {format.dateTime(new Date(item.updatedAt), {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="cursor-pointer"
            onClick={() => {
              setIsRestore(true);
              onActionStart(item.id, async () => {
                const result = await restoreItem(item.id, type);
                if (result?.error) {
                  toast.error(t_notify(result.error as string));
                  setIsRestore(false);
                } else {
                  setIsRestore(false);
                  toast.success(t_notify(result?.success as string));
                }
              });
            }}
            disabled={isPending}
          >
            {isRestore && <ButtonSpinner />}
            {t("restore")}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="cursor-pointer"
            onClick={() => {
              setIsPermanent(true);
              onActionStart(item.id, async () => {
                setIsPermanent(true);
                const result = await permanentDeleteItem(item.id, type);
                if (result?.error) {
                  setIsPermanent(false);
                  toast.error(t_notify(result.error as string));
                } else {
                  setIsPermanent(false);
                  toast.success(t_notify(result?.success as string));
                }
              });
            }}
            disabled={isPending}
          >
            {isPermanent && <ButtonSpinner />}
            {t("delete_permanently")}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
