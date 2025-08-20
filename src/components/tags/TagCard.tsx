"use client";

import { useState } from "react";
import type { Tag } from "@prisma/client";
import { useTranslations } from "next-intl";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="cursor-pointer">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onSelect={() => setIsEditOpen(true)}
                className="cursor-pointer"
              >
                <Pencil className="mr-2 h-4 w-4" />
                <span>{t("edit")}</span>
              </DropdownMenuItem>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-red-500 cursor-pointer">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>{t("delete")}</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("delete_tag_confirmation_title")}
              </AlertDialogTitle>
              <AlertDialogDescription
                className={clsx(
                  "cursor-pointer",
                  isPermanentDelete ? "line-through" : ""
                )}
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

      <EditTagDialog tag={tag} open={isEditOpen} onOpenChange={setIsEditOpen} />
    </>
  );
}
