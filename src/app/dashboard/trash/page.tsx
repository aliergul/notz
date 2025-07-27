import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Note, Tag, Todo } from "@prisma/client";
import { useFormatter, useTranslations } from "next-intl";

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

  const allItems = [...deletedNotes, ...deletedTags, ...deletedTodos];

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">{t("title")}</h1>
      </div>

      {allItems.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <p className="text-muted-foreground">{t("empty_trash")}</p>
        </div>
      ) : (
        <Tabs defaultValue="notes" className="flex-1">
          <TabsList>
            <TabsTrigger value="notes">
              {t("notes")} ({deletedNotes.length})
            </TabsTrigger>
            <TabsTrigger value="todos">
              {t("todos")} ({deletedTodos.length})
            </TabsTrigger>
            <TabsTrigger value="tags">
              {t("tags")} ({deletedTags.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notes" className="mt-4">
            <div className="grid gap-4">
              {deletedNotes.map((note) => (
                <TrashItemCard key={note.id} item={note} type="note" />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="todos" className="mt-4">
            <div className="grid gap-4">
              {deletedTodos.map((todo) => (
                <TrashItemCard key={todo.id} item={todo} type="todo" />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="tags" className="mt-4">
            <div className="grid gap-4">
              {deletedTags.map((tag) => (
                <TrashItemCard key={tag.id} item={tag} type="tag" />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </>
  );
}

function TrashItemCard({
  item,
}: {
  item: Note | Todo | Tag;
  type: "note" | "todo" | "tag";
}) {
  const displayName = "title" in item ? item.title : item.name;
  const t = useTranslations("trash");
  const format = useFormatter();
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div>
        <p className="font-semibold">{displayName}</p>
        <p className="text-sm text-muted-foreground">
          {t("delete_date")}:{" "}
          {format.dateTime(new Date(item.updatedAt), {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
      <div className="flex gap-2">
        <button className="text-sm text-blue-500 cursor-pointer">
          {t("restore")}
        </button>
        <button className="text-sm text-red-500 cursor-pointer">
          {t("delete_permanently")}
        </button>
      </div>
    </div>
  );
}
