import { authOptions } from "../../../lib/auth";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import prisma from "../../../lib/prisma";
import TrashList from "../../../components/trash/TrashList";

export default async function TrashPage() {
  const t = await getTranslations("trash");
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/");
  }

  const [deletedNotes, deletedTags, deletedTodos] = await Promise.all([
    prisma.note.findMany({
      where: { userId: session.user.id, softDelete: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.tag.findMany({
      where: { userId: session.user.id, softDelete: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.todo.findMany({
      where: { userId: session.user.id, softDelete: true },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">{t("title")}</h1>
      </div>
      <TrashList
        initialDeletedNotes={deletedNotes}
        initialDeletedTodos={deletedTodos}
        initialDeletedTags={deletedTags}
      />
    </>
  );
}
