import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import NewNoteDialog from "@/components/notes/NewNoteDialog";
import NoteFilters from "@/components/notes/NoteFilters";
import NoteList from "@/components/notes/NoteList";

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
      { title: { contains: q, mode: "insensitive" } },
      { content: { contains: q, mode: "insensitive" } },
    ];
  }
  if (tag) {
    whereCondition.tags = { some: { id: tag } };
  }

  const [initialNotes, totalNotes, allTags] = await Promise.all([
    prisma.note.findMany({
      where: whereCondition,
      include: { tags: { where: { softDelete: false } } },
      orderBy: { updatedAt: "desc" },
      take: 10,
    }),
    prisma.note.count({ where: whereCondition }),
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
        <NoteList
          initialNotes={initialNotes}
          totalNotes={totalNotes}
          allTags={allTags}
        />
      </div>
    </>
  );
}
