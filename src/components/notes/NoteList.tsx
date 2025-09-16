"use client";

import { useState, useTransition, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Note, Tag } from "@prisma/client";
import {
  fetchNotes,
  softDeleteNote,
  permanentDeleteNote,
} from "@/actions/notes";
import NoteCard from "./NoteCard";
import { Button } from "@/components/ui/button";
import ButtonSpinner from "../spinner";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { AnimatePresence } from "framer-motion";

type NoteWithTags = Note & { tags: Tag[] };

interface NoteListProps {
  initialNotes: NoteWithTags[];
  totalNotes: number;
  allTags: Tag[];
}

export default function NoteList({
  initialNotes,
  totalNotes,
  allTags,
}: NoteListProps) {
  const t = useTranslations("notes");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [notes, setNotes] = useState(initialNotes);
  const [page, setPage] = useState(1);
  const [isLoading, startTransition] = useTransition();
  const [pendingDeletionNoteIds, setPendingDeletionNoteIds] = useState<
    string[]
  >([]);

  useEffect(() => {
    setNotes(initialNotes);
    setPage(1);
    setPendingDeletionNoteIds([]);
    window.scrollTo(0, 0);
  }, [initialNotes]);

  const hasMoreNotes = notes.length < totalNotes;

  const loadMoreNotes = () => {
    startTransition(async () => {
      const nextPage = page + 1;
      const query = searchParams.get("q") || undefined;
      const tagId = searchParams.get("tag") || undefined;
      const result = await fetchNotes({ page: nextPage, query, tagId });
      if (result && Array.isArray(result.notes)) {
        setNotes((prevNotes) => [
          ...prevNotes,
          ...(result.notes as NoteWithTags[]),
        ]);
        setPage(nextPage);
      }
    });
  };

  const handleOptimisticDelete = async (
    noteId: string,
    isPermanent: boolean
  ) => {
    setPendingDeletionNoteIds((prev) => [...prev, noteId]);

    const action = isPermanent ? permanentDeleteNote : softDeleteNote;
    await action(noteId);

    router.refresh();
  };

  if (notes.length === 0) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed shadow-sm p-4">
        <p className="text-muted-foreground">{t("empty_page")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              allTags={allTags}
              onDelete={handleOptimisticDelete}
              isPendingDeletion={pendingDeletionNoteIds.includes(note.id)}
            />
          ))}
        </AnimatePresence>
      </div>
      {hasMoreNotes && (
        <div className="flex justify-start mt-2">
          <Button
            onClick={loadMoreNotes}
            disabled={isLoading}
            variant="ghost"
            size="sm"
            className="text-muted-foreground cursor-pointer"
          >
            {isLoading ? (
              <ButtonSpinner className="text-muted-foreground" />
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                {t("load_more_button")}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
