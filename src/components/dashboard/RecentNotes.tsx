"use client";

import { Note, Tag } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

type NoteWithTags = Note & { tags: Tag[] };

interface RecentNotesProps {
  initialNotes: NoteWithTags[];
}

export default function RecentNotes({ initialNotes }: RecentNotesProps) {
  const t = useTranslations("notes");
  const t_dashboard = useTranslations("dashboard");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t_dashboard("last_notes")}</CardTitle>
        <CardDescription>{t_dashboard("last_notes_info")}</CardDescription>
      </CardHeader>
      <CardContent>
        {initialNotes.length > 0 ? (
          <div className="space-y-4">
            {initialNotes.map((note) => (
              <div key={note.id} className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium leading-none truncate">
                    {note.title || t("unnamed_note")}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/notes/${note.id}`}>
                    {t_dashboard("view_details")}
                    <ArrowUpRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t_dashboard("no_notes_yet")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
