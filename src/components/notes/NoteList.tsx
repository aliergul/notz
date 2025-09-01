"use client";

import { useState, useTransition, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { Note, Tag } from "@prisma/client";
import { fetchNotes } from "@/actions/notes";
import NoteCard from "./NoteCard";
import { Button } from "@/components/ui/button";
import ButtonSpinner from "../spinner";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";

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
  const searchParams = useSearchParams();
  const [notes, setNotes] = useState(initialNotes);
  const [page, setPage] = useState(1);
  const [isLoading, startTransition] = useTransition();

  useEffect(() => {
    setNotes(initialNotes);
    setPage(1);
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
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} allTags={allTags} />
        ))}
      </div>
      {hasMoreNotes && (
        <div className="flex justify-center mt-4">
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
