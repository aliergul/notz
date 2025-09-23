"use client";

import { useState } from "react";
import type { Tag } from "@prisma/client";
import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import EditTagDialog from "./EditTagDialog";
import clsx from "clsx";
import { motion } from "framer-motion";
import ButtonSpinner from "@/components/spinner";

interface TagCardProps {
  tag: Tag;
  onDelete: (tagId: string, isPermanent: boolean) => void;
  onActionStart: (action: () => Promise<void>) => void;
  isPendingDeletion?: boolean;
}

export default function TagCard({
  tag,
  onDelete,
  onActionStart,
  isPendingDeletion,
}: TagCardProps) {
  const t = useTranslations("tags");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(tag.id, isPermanentDelete);
  };

  const handleAlertOpenChange = (open: boolean) => {
    if (!open) {
      setIsPermanentDelete(false);
    }
    setIsAlertOpen(open);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        height: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
        border: 0,
      }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {isPendingDeletion && (
        <div className="absolute inset-0 z-30 flex items-center justify-center rounded-lg backdrop-blur-xs"></div>
      )}
      <div className="flex items-center justify-between rounded-lg border bg-card p-4">
        <div className="flex items-center gap-4">
          <div
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: tag.color || "#888888" }}
          />
          <div className="flex flex-col">
            <h3 className="font-semibold">{tag.name}</h3>
            {tag.description && (
              <p className="text-sm text-muted-foreground">{tag.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditOpen(true)}
            className="h-8 w-8 cursor-pointer"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog open={isAlertOpen} onOpenChange={handleAlertOpenChange}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 cursor-pointer hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("delete_tag_confirmation_title")}
                </AlertDialogTitle>
                <AlertDialogDescription
                  className={clsx(isPermanentDelete ? "line-through" : "")}
                >
                  {t("delete_tag_confirmation_desc")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex items-center space-x-2 my-4">
                <Checkbox
                  id={`permanent-delete-${tag.id}`}
                  onCheckedChange={(checked) =>
                    setIsPermanentDelete(Boolean(checked))
                  }
                />
                <Label
                  htmlFor={`permanent-delete-${tag.id}`}
                  className="text-sm font-medium leading-none text-red-600 cursor-pointer"
                >
                  {t("permanent_delete_checkbox")}
                </Label>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">
                  {t("cancel")}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="cursor-pointer"
                >
                  {isDeleting && <ButtonSpinner />} {t("delete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <EditTagDialog
        tag={tag}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onActionStart={onActionStart}
      />
    </motion.div>
  );
}
