"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { Tag } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createNote } from "@/actions/notes";
import ButtonSpinner from "@/components/spinner";
import TagSelector from "@/components/tags/TagSelector";
import { PlusCircle } from "lucide-react";
import MarkdownToolbar from "./MarkdownToolbar";
import { toast } from "sonner";

interface NewNoteDialogProps {
  allTags: Tag[];
}

export default function NewNoteDialog({ allTags }: NewNoteDialogProps) {
  const t_notes = useTranslations("notes");
  const t_notify = useTranslations("notifications");
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const contentRef = useRef<HTMLTextAreaElement>(
    null
  ) as React.RefObject<HTMLTextAreaElement>;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      const formData = new FormData(event.currentTarget);
      const result = await createNote(formData);

      if (result?.error) {
        toast.error(t_notify(result.error as string));
      } else {
        toast.success(t_notify(result.success as string));
        setOpen(false);
        router.refresh();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="ml-auto gap-1 cursor-pointer">
          <PlusCircle className="h-4 w-4" />
          {t_notes("create_note_button")}
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
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="content" className="text-right pt-2">
              {t_notes("note_content")}
            </Label>
            <div className="col-span-3">
              <MarkdownToolbar textareaRef={contentRef} />
              <Textarea
                id="content"
                name="content"
                required
                ref={contentRef}
                className="rounded-t-none border-t-0"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              {t_notes("tags_label")}
            </Label>
            <div className="col-span-3">
              <TagSelector allTags={allTags} />
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button
            type="submit"
            form="new-note-form"
            disabled={isPending}
            className="w-full cursor-pointer"
          >
            {isPending && <ButtonSpinner />}
            {t_notes("note_save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
