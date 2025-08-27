import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NoteDetailPageProps {
  params: Promise<{ noteId: string }>;
}

export default async function NoteDetailPage({ params }: NoteDetailPageProps) {
  const t = await getTranslations("notes");
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/");
  }
  const { noteId } = await params;
  const note = await prisma.note.findFirst({
    where: {
      id: noteId,
      userId: session.user.id,
    },
    include: {
      tags: {
        where: { softDelete: false },
      },
    },
  });

  if (!note) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <Link href="/dashboard/notes">
        <Button variant="outline" size="sm" className="gap-1 cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
          {t("back_to_notes")}
        </Button>
      </Link>

      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          {note.title || t("unnamed_note")}
        </h1>

        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {note.tags.map((tag) => (
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
            ))}
          </div>
        )}

        <div className="prose dark:prose-invert max-w-none">
          <p>{note.content}</p>
        </div>
      </div>
    </div>
  );
}
