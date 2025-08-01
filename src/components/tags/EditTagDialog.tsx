"use client";

import { useState } from "react";
import type { Tag } from "@prisma/client";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateTag } from "@/actions/tags";
import ButtonSpinner from "../spinner";

interface EditTagDialogProps {
  tag: Tag;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditTagDialog({
  tag,
  open,
  onOpenChange,
}: EditTagDialogProps) {
  const t = useTranslations("tags");
  const t_notify = useTranslations("notifications");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await updateTag(tag.id, formData);
    setIsLoading(false);

    if (result.error) {
      setError(t_notify(result.error as string));
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("edit_tag_dialog_title")}</DialogTitle>
          <DialogDescription>{t("edit_tag_dialog_desc")}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          id="edit-tag-form"
          className="grid gap-4 py-4"
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              {t("name_label")}
            </Label>
            <Input
              id="name"
              name="name"
              defaultValue={tag.name}
              required
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              {t("description_label")}
            </Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={tag.description || ""}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="color" className="text-right">
              {t("color_label")}
            </Label>
            <Input
              id="color"
              name="color"
              type="color"
              defaultValue={tag.color || "#888888"}
              className="col-span-3 p-1"
            />
          </div>
          {error && (
            <p className="col-span-4 text-center text-sm font-medium text-red-500">
              {error}
            </p>
          )}
        </form>
        <DialogFooter>
          <Button
            type="submit"
            form="edit-tag-form"
            disabled={isLoading}
            className="w-full cursor-pointer"
          >
            {isLoading && <ButtonSpinner />}
            {t("save_changes_button")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
