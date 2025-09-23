"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { emptyTrashByType } from "@/actions/trash";
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
import ButtonSpinner from "@/components/spinner";
import { Trash2 } from "lucide-react";

type ItemType = "note" | "todo" | "tag";

interface EmptyTrashButtonProps {
  type: ItemType;
  itemCount: number;
  onActionStart: (action: () => Promise<void>) => void;
}

export default function EmptyTrashButton({
  type,
  itemCount,
  onActionStart,
}: EmptyTrashButtonProps) {
  const t = useTranslations("trash");
  const t_notify = useTranslations("notifications");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmptyTrash = async () => {
    setError(null);
    setIsSubmitting(true);

    onActionStart(async () => {
      try {
        const result = await emptyTrashByType(type);
        if (result?.error) {
          setError(t_notify(result.error as string));
          setIsSubmitting(false);
          throw new Error(result.error);
        }
      } catch {}
    });
  };

  if (itemCount === 0) {
    return null;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="gap-1 cursor-pointer w-fit"
        >
          <Trash2 className="h-4 w-4" />
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
        {error && (
          <p className="text-center text-sm font-medium text-red-500">
            {error}
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleEmptyTrash}
            disabled={isSubmitting}
            className="cursor-pointer"
          >
            {isSubmitting && <ButtonSpinner />}
            {t("delete_permanently")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
