"use client";

import { useState } from "react";
import type { Note, Tag, Todo } from "@prisma/client";
import { useFormatter, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { restoreItem, deleteItemPermanently } from "@/actions/trash";
import { RotateCw, Trash2 } from "lucide-react";
import ButtonSpinner from "../spinner";

type ItemType = "note" | "todo" | "tag";

interface TrashItemCardProps {
  item: Note | Todo | Tag;
  type: ItemType;
}

export default function TrashItemCard({ item, type }: TrashItemCardProps) {
  const t = useTranslations("trash");
  const format = useFormatter();
  const [isRestoring, setIsRestoring] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const displayName = "title" in item ? item.title : item.name;

  const handleRestore = async () => {
    setIsRestoring(true);
    await restoreItem(item.id, type);
    setIsRestoring(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteItemPermanently(item.id, type);
    setIsDeleting(false);
  };

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
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
          variant="outline"
          size="sm"
          onClick={handleRestore}
          disabled={isRestoring}
          className="cursor-pointer"
        >
          <RotateCw className="mr-2 h-4 w-4" />
          {t("restore")}
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="cursor-pointer">
              <Trash2 className="mr-2 h-4 w-4" />
              {t("delete_permanently")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("permanent_delete_confirmation_title")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("permanent_delete_confirmation_desc")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                {t("cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="cursor-pointer"
              >
                {isDeleting && <ButtonSpinner />} {t("delete_permanently")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
