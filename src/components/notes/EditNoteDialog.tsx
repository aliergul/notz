"use client";

import { useState, useRef } from "react";
import type { Note, Tag } from "@prisma/client";
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
import { updateNote } from "@/actions/notes";
import ButtonSpinner from "../spinner";
import TagSelector from "../tags/TagSelector";
import MarkdownToolbar from "./MarkdownToolbar";

type NoteWithTags = Note & { tags: Tag[] };

interface EditNoteDialogProps {
  note: NoteWithTags;
  allTags: Tag[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditNoteDialog({
  note,
  allTags,
  open,
  onOpenChange,
}: EditNoteDialogProps) {
  const t_notes = useTranslations("notes");
  const t_notify = useTranslations("notifications");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLTextAreaElement>(
    null
  ) as React.RefObject<HTMLTextAreaElement>;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await updateNote(note.id, formData);

    setIsLoading(false);

    if (result?.error) {
      setError(t_notify(result.error as string));
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t_notes("edit_note_dialog_title")}</DialogTitle>
          <DialogDescription>
            {t_notes("edit_note_dialog_desc")}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          id="edit-note-form"
          className="grid gap-4 py-4"
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              {t_notes("note_title")}
            </Label>
            <Input
              id="title"
              name="title"
              defaultValue={note.title || ""}
              className="col-span-3"
            />
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
                defaultValue={note.content}
                required
                ref={contentRef}
                className="rounded-t-none border-t-0"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">{t_notes("tags_label")}</Label>
            <div className="col-span-3">
              <TagSelector
                allTags={allTags}
                initialSelectedTagIds={note.tags.map((tag) => tag.id)}
              />
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
            form="edit-note-form"
            disabled={isLoading}
            className="w-full cursor-pointer"
          >
            {isLoading && <ButtonSpinner />}
            {t_notes("save_changes")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
