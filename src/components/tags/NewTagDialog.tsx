"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createTag } from "@/actions/tags";
import ButtonSpinner from "../spinner";

export default function NewTagDialog() {
  const t = useTranslations("tags");
  const t_notify = useTranslations("notifications");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await createTag(formData);
    setIsLoading(false);

    if (result.error) {
      setError(t_notify(result.error as string));
    } else {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="ml-auto gap-1 cursor-pointer">
          <PlusCircle className="h-4 w-4" />
          {t("new_tag_button")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("new_tag_dialog_title")}</DialogTitle>
          <DialogDescription>{t("new_tag_dialog_desc")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} id="tag-form" className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              {t("name_label")}
            </Label>
            <Input id="name" name="name" required className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              {t("description_label")}
            </Label>
            <Textarea
              id="description"
              name="description"
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
              defaultValue="#888888"
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
            form="tag-form"
            disabled={isLoading}
            className="w-full cursor-pointer"
          >
            {isLoading && <ButtonSpinner />}
            {t("save_button")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
