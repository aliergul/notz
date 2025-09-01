import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import NewTodoDialog from "@/components/todos/NewTodoDialog";
import TodoBoard from "@/components/todos/TodoBoard";
import TodoFilters from "@/components/todos/TodoFilters";
import { Prisma, TodoStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

interface TodosPageProps {
  searchParams: Promise<{ q?: string; tag?: string }>;
}

export default async function TodosPage({ searchParams }: TodosPageProps) {
  const t = await getTranslations("todos");
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/");
  }

  const { q, tag } = await searchParams;

  const baseWhereCondition: Prisma.TodoWhereInput = {
    userId: session.user.id,
    softDelete: false,
  };
  if (q) {
    baseWhereCondition.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }
  if (tag) {
    baseWhereCondition.tags = { some: { id: tag } };
  }

  const [notStartedTasks, inProgressTasks, doneTasks, statusCounts, allTags] =
    await Promise.all([
      prisma.todo.findMany({
        where: { ...baseWhereCondition, status: TodoStatus.NOT_STARTED },
        include: { tags: { where: { softDelete: false } } },
        orderBy: { updatedAt: "desc" },
        take: 10,
      }),
      prisma.todo.findMany({
        where: { ...baseWhereCondition, status: TodoStatus.IN_PROGRESS },
        include: { tags: { where: { softDelete: false } } },
        orderBy: { updatedAt: "desc" },
        take: 10,
      }),
      prisma.todo.findMany({
        where: { ...baseWhereCondition, status: TodoStatus.DONE },
        include: { tags: { where: { softDelete: false } } },
        orderBy: { updatedAt: "desc" },
        take: 10,
      }),
      prisma.todo.groupBy({
        by: ["status"],
        where: baseWhereCondition,
        _count: {
          status: true,
        },
      }),
      prisma.tag.findMany({
        where: { userId: session.user.id, softDelete: false },
        orderBy: { createdAt: "desc" },
      }),
    ]);

  const getCount = (status: TodoStatus) =>
    statusCounts.find((item) => item.status === status)?._count.status || 0;

  const initialColumnsData = {
    [TodoStatus.NOT_STARTED]: {
      tasks: notStartedTasks,
      total: getCount(TodoStatus.NOT_STARTED),
    },
    [TodoStatus.IN_PROGRESS]: {
      tasks: inProgressTasks,
      total: getCount(TodoStatus.IN_PROGRESS),
    },
    [TodoStatus.DONE]: {
      tasks: doneTasks,
      total: getCount(TodoStatus.DONE),
    },
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">{t("title")}</h1>
        <div className="ml-auto">
          <NewTodoDialog allTags={allTags} />
        </div>
      </div>

      <div className="py-4">
        <TodoFilters allTags={allTags} />
      </div>

      <TodoBoard initialColumnsData={initialColumnsData} allTags={allTags} />
    </div>
  );
}
