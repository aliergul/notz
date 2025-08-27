import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import NewNoteDialog from "@/components/notes/NewNoteDialog";
import NoteCard from "@/components/notes/NoteCard";
import NoteFilters from "@/components/notes/NoteFilters";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

interface NotesPageProps {
  searchParams: Promise<{ q?: string; tag?: string }>;
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const t = await getTranslations("notes");
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/");

  const { q, tag } = await searchParams;

  const whereCondition: Prisma.NoteWhereInput = {
    userId: session.user.id,
    softDelete: false,
  };

  if (q) {
    whereCondition.OR = [
      {
        title: {
          contains: q,
          mode: "insensitive",
        },
      },
      {
        content: {
          contains: q,
          mode: "insensitive",
        },
      },
    ];
  }

  if (tag) {
    whereCondition.tags = {
      some: { id: tag },
    };
  }

  const [notes, allTags] = await Promise.all([
    prisma.note.findMany({
      where: whereCondition,
      include: { tags: { where: { softDelete: false } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.tag.findMany({
      where: { userId: session.user.id, softDelete: false },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">{t("my_notes")}</h1>
        <div className="ml-auto">
          <NewNoteDialog allTags={allTags} />
        </div>
      </div>

      <div className="py-4">
        <NoteFilters allTags={allTags} />
      </div>

      <div className="flex-1">
        {notes.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed shadow-sm p-4">
            <p className="text-muted-foreground">{t("empty_page")}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} allTags={allTags} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
