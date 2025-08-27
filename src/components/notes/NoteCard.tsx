"use client";

import { useState } from "react";
import type { Note, Tag } from "@prisma/client";
import Link from "next/link";
import { Pencil, Trash2, Tag as TagIcon } from "lucide-react";
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
import { softDeleteNote, permanentDeleteNote } from "@/actions/notes";
import ButtonSpinner from "../spinner";
import EditNoteDialog from "./EditNoteDialog";
import clsx from "clsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

type NoteWithTags = Note & { tags: Tag[] };

interface NoteCardProps {
  note: NoteWithTags;
  allTags: Tag[];
}

export default function NoteCard({ note, allTags }: NoteCardProps) {
  const t = useTranslations("notes");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    if (isPermanentDelete) {
      await permanentDeleteNote(note.id);
    } else {
      await softDeleteNote(note.id);
    }
    setIsDeleting(false);
    setIsAlertOpen(false);
  };

  const handleAlertOpenChange = (open: boolean) => {
    if (!open) {
      setIsPermanentDelete(false);
    }
    setIsAlertOpen(open);
  };

  return (
    <>
      <TooltipProvider>
        <div className="group relative flex items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:bg-muted/50 w-full">
          <div className="flex-1 min-w-0">
            <div className="truncate font-medium">
              {note.title || t("unnamed_note")}
            </div>
            <div className="flex items-center gap-1 flex-wrap mt-2 min-h-6">
              {note.tags.length > 0 ? (
                <>
                  {note.tags.slice(0, 4).map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className="text-xs"
                      style={{
                        borderColor: tag.color || undefined,
                        color: tag.color || undefined,
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                  {note.tags.length > 4 && (
                    <Badge variant="secondary" className="text-xs">
                      +{note.tags.length - 4}
                    </Badge>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TagIcon className="h-3 w-3" />
                  <span>0</span>
                </div>
              )}
            </div>
          </div>

          <div className="relative z-20 flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 cursor-pointer text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setIsEditOpen(true)}
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <AlertDialog
              open={isAlertOpen}
              onOpenChange={handleAlertOpenChange}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 cursor-pointer text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("delete_note_confirmation_title")}
                  </AlertDialogTitle>
                  <AlertDialogDescription
                    className={clsx(isPermanentDelete ? "line-through" : "")}
                  >
                    {t("delete_note_confirmation_desc")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex items-center space-x-2 my-4">
                  <Checkbox
                    id={`permanent-delete-${note.id}`}
                    className="cursor-pointer"
                    checked={isPermanentDelete}
                    onCheckedChange={(checked) =>
                      setIsPermanentDelete(Boolean(checked))
                    }
                  />
                  <Label
                    htmlFor={`permanent-delete-${note.id}`}
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

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/dashboard/notes/${note.id}`}
                className="absolute inset-0 z-10 rounded-lg"
              >
                <span className="sr-only">View note</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("view_note_details")}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      <EditNoteDialog
        note={note}
        allTags={allTags}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </>
  );
}
