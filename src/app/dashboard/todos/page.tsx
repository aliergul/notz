import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import NewTodoDialog from "@/components/todos/NewTodoDialog";
import TodoBoard from "@/components/todos/TodoBoard";

export default async function TodosPage() {
  const t = await getTranslations("todos");
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/");
  }

  const [todos, allTags] = await Promise.all([
    prisma.todo.findMany({
      where: { userId: session.user.id, softDelete: false },
      include: { tags: { where: { softDelete: false } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.tag.findMany({
      where: { userId: session.user.id, softDelete: false },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">{t("title")}</h1>
        <div className="ml-auto">
          <NewTodoDialog allTags={allTags} />
        </div>
      </div>

      {todos.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed shadow-sm p-4">
          <h3 className="text-2xl font-bold tracking-tight">
            {t("empty_title")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("empty_description")}
          </p>
        </div>
      ) : (
        <TodoBoard todos={todos} allTags={allTags} />
      )}
    </div>
  );
}
