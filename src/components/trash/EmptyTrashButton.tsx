"use client";

import { useTransition } from "react";
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
import ButtonSpinner from "../spinner";
import { ItemType, emptyTrashByType } from "@/actions/trash";

interface EmptyTrashButtonProps {
  type: ItemType;
  itemCount: number;
}

export default function EmptyTrashButton({
  type,
  itemCount,
}: EmptyTrashButtonProps) {
  const t = useTranslations("trash");
  const [isLoading, startTransition] = useTransition();

  const handleEmptyTrash = () => {
    startTransition(async () => {
      await emptyTrashByType(type);
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          disabled={itemCount === 0 || isLoading}
          className="cursor-pointer"
        >
          {t("empty_trash_button")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("empty_trash_confirmation_title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("empty_trash_confirmation_desc", { itemCount })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleEmptyTrash}
            disabled={isLoading}
            className="cursor-pointer"
          >
            {isLoading && <ButtonSpinner />} {t("delete_permanently")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
