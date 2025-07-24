import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import NewNoteDialog from "@/components/notes/NewNoteDialog";
import { getTranslations } from "next-intl/server";

export default async function NotesPage() {
  const t = await getTranslations("notes");
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/");
  }

  const notes = await prisma.note.findMany({
    where: {
      userId: session.user.id,
      softDelete: false,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">{t("my_notes")}</h1>
        <div className="ml-auto">
          <NewNoteDialog />
        </div>
      </div>

      <div className="flex-1 rounded-lg border border-dashed shadow-sm p-4">
        {notes.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">{t("empty_page")}</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <div key={note.id} className="rounded-lg border bg-card p-4">
                <h3 className="font-semibold">
                  {note.title || "Başlıksız Not"}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
