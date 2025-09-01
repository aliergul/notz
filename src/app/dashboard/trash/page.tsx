import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TrashItemCard from "@/components/trash/TrashItemCard";
import EmptyTrashButton from "@/components/trash/EmptyTrashButton";

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
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">{t("title")}</h1>
      </div>

      {allItems.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <p className="text-muted-foreground">{t("empty_trash")}</p>
        </div>
      ) : (
        <Tabs defaultValue="notes" className="flex-1 mt-4">
          <TabsList>
            <TabsTrigger value="notes" className="cursor-pointer">
              {t("notes")} ({deletedNotes.length})
            </TabsTrigger>
            <TabsTrigger value="todos" className="cursor-pointer">
              {t("todos")} ({deletedTodos.length})
            </TabsTrigger>
            <TabsTrigger value="tags" className="cursor-pointer">
              {t("tags")} ({deletedTags.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notes" className="mt-4">
            <div className="flex flex-col gap-4">
              <div>
                <EmptyTrashButton type="note" itemCount={deletedNotes.length} />
              </div>
              {deletedNotes.length > 0 ? (
                deletedNotes.map((note) => (
                  <TrashItemCard key={note.id} item={note} type="note" />
                ))
              ) : (
                <div className="text-center text-muted-foreground p-8">
                  {t("empty_tab_placeholder")}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="todos" className="mt-4">
            <div className="flex flex-col gap-4">
              <div>
                <EmptyTrashButton type="todo" itemCount={deletedTodos.length} />
              </div>
              {deletedTodos.length > 0 ? (
                deletedTodos.map((todo) => (
                  <TrashItemCard key={todo.id} item={todo} type="todo" />
                ))
              ) : (
                <div className="text-center text-muted-foreground p-8">
                  {t("empty_tab_placeholder")}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tags" className="mt-4">
            <div className="flex flex-col gap-4">
              <div>
                <EmptyTrashButton type="tag" itemCount={deletedTags.length} />
              </div>
              {deletedTags.length > 0 ? (
                deletedTags.map((tag) => (
                  <TrashItemCard key={tag.id} item={tag} type="tag" />
                ))
              ) : (
                <div className="text-center text-muted-foreground p-8">
                  {t("empty_tab_placeholder")}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </>
  );
}
