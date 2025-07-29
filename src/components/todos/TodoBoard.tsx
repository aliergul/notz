"use client";

import type { Todo } from "@prisma/client";
import { useTranslations } from "next-intl";
import TodoCard from "./TodoCard";

interface TodoBoardProps {
  todos: Todo[];
}

export default function TodoBoard({ todos }: TodoBoardProps) {
  const t = useTranslations("todos");

  const notStarted = todos.filter((todo) => todo.status === "NOT_STARTED");
  const inProgress = todos.filter((todo) => todo.status === "IN_PROGRESS");
  const done = todos.filter((todo) => todo.status === "DONE");

  const columns = [
    { title: t("status_not_started"), tasks: notStarted },
    { title: t("status_in_progress"), tasks: inProgress },
    { title: t("status_done"), tasks: done },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {columns.map((column) => (
        <div key={column.title} className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold tracking-tight">
            {column.title} ({column.tasks.length})
          </h2>
          <div className="flex flex-col gap-4 rounded-lg border p-2 min-h-[200px]">
            {column.tasks.map((todo) => (
              <TodoCard key={todo.id} todo={todo} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
