import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import NewNoteDialog from "@/components/notes/NewNoteDialog";
import NoteCard from "@/components/notes/NoteCard";

export default async function NotesPage() {
  const t = await getTranslations("notes");
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/");
  }

  const [notes, allTags] = await Promise.all([
    prisma.note.findMany({
      where: {
        userId: session.user.id,
        softDelete: false,
      },
      include: {
        tags: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    }),
    prisma.tag.findMany({
      where: {
        userId: session.user.id,
        softDelete: false,
      },
      orderBy: {
        createdAt: "desc",
      },
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

      <div className="flex-1">
        {notes.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed shadow-sm p-4">
            <p className="text-muted-foreground">{t("empty_page")}</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} allTags={allTags} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
