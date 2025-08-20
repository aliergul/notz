"use client";

import { useState } from "react";
import type { Note, Tag } from "@prisma/client";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { softDeleteNote, permanentDeleteNote } from "@/actions/notes";
import ButtonSpinner from "../spinner";
import EditNoteDialog from "./EditNoteDialog";
import clsx from "clsx";
import { Badge } from "../ui/badge";
import TruncateWithTooltip from "@/components/truncate-with-tooltip";

type NoteWithTags = Note & { tags: Tag[] };

interface NoteCardProps {
  note: NoteWithTags;
  allTags: Tag[];
}

export default function NoteCard({ note, allTags }: NoteCardProps) {
  const t = useTranslations("notes");
  const format = useFormatter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    if (isPermanentDelete) {
      await permanentDeleteNote(note.id);
    } else {
      await softDeleteNote(note.id);
    }
    setIsDeleting(false);
  };

  return (
    <>
      <Card className="flex h-64 flex-col">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="truncate">
                <TruncateWithTooltip
                  text={note.title || t("unnamed_note")}
                  maxLength={50}
                />
              </CardTitle>
            </div>
            <AlertDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer"
                  >
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
                    {t("delete_note_confirmation_title")}
                  </AlertDialogTitle>
                  <AlertDialogDescription
                    className={clsx(
                      "cursor-pointer",
                      isPermanentDelete ? "line-through" : ""
                    )}
                  >
                    {t("delete_note_confirmation_desc")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex items-center space-x-2 my-4">
                  <Checkbox
                    id="permanent-delete"
                    className="cursor-pointer"
                    onCheckedChange={(checked) =>
                      setIsPermanentDelete(Boolean(checked))
                    }
                  />
                  <Label
                    htmlFor="permanent-delete"
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
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden">
          <p className="text-sm text-muted-foreground text-left">
            <TruncateWithTooltip text={note.content} maxLength={220} />
          </p>
        </CardContent>

        <CardFooter className="flex flex-col items-start gap-2 pt-2">
          <CardDescription className="text-xs">
            {t("last_update")}:{" "}
            {format.dateTime(new Date(note.updatedAt), {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </CardDescription>
          <div className="flex flex-wrap gap-1">
            {note.tags.length > 0 ? (
              note.tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  style={{
                    borderColor: tag.color || undefined,
                    color: tag.color || undefined,
                  }}
                >
                  {tag.name}
                </Badge>
              ))
            ) : (
              <p className="text-xs text-muted-foreground italic">
                {t("no_tags_placeholder")}
              </p>
            )}
          </div>
        </CardFooter>
      </Card>

      <EditNoteDialog
        note={note}
        allTags={allTags}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </>
  );
}
