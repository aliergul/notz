"use client";

import { useState } from "react";
import type { Tag } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createNote } from "@/actions/notes";
import ButtonSpinner from "../spinner";
import { PlusCircle } from "lucide-react";
import TagSelector from "../tags/TagSelector";

interface NewNoteDialogProps {
  allTags: Tag[];
}

export default function NewNoteDialog({ allTags }: NewNoteDialogProps) {
  const t_notes = useTranslations("notes");
  const t_notify = useTranslations("notifications");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await createNote(formData);

    setIsLoading(false);

    if (result?.error) {
      setError(t_notify(result.error as string));
    } else {
      setOpen(false);
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1 cursor-pointer">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            {t_notes("create_note_button")}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t_notes("create_note_dialog_title")}</DialogTitle>
          <DialogDescription>
            {t_notes("create_note_dialog_desc")}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          id="new-note-form"
          className="grid gap-4 py-4"
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              {t_notes("note_title")}
            </Label>
            <Input id="title" name="title" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content" className="text-right">
              {t_notes("note_content")}
            </Label>
            <Textarea
              id="content"
              name="content"
              required
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              {t_notes("tags_label")}
            </Label>
            <div className="col-span-3">
              <TagSelector allTags={allTags} />
            </div>
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
            form="new-note-form"
            disabled={isLoading}
            className="w-full cursor-pointer"
          >
            {isLoading && <ButtonSpinner />}
            {t_notes("note_save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
