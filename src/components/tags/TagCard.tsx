"use client";

import { useState } from "react";
import type { Tag } from "@prisma/client";
import { useTranslations } from "next-intl";
import { Pencil, Trash2 } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { softDeleteTag, permanentDeleteTag } from "@/actions/tags";
import EditTagDialog from "./EditTagDialog";
import ButtonSpinner from "../spinner";
import clsx from "clsx";

interface TagCardProps {
  tag: Tag;
}

export default function TagCard({ tag }: TagCardProps) {
  const t = useTranslations("tags");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    if (isPermanentDelete) {
      await permanentDeleteTag(tag.id);
    } else {
      await softDeleteTag(tag.id);
    }
    setIsDeleting(false);
  };

  return (
    <>
      <div className="flex items-center justify-between rounded-lg border bg-card p-4">
        <div className="flex items-center gap-3">
          <div
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: tag.color || "#888888" }}
          />
          <div>
            <p className="font-semibold">{tag.name}</p>
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
            className="cursor-pointer"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-600 cursor-pointer"
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

      <EditTagDialog tag={tag} open={isEditOpen} onOpenChange={setIsEditOpen} />
    </>
  );
}
