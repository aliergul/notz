"use client";

import type { Todo, Tag } from "@prisma/client";
import { useTranslations } from "next-intl";
import TodoCard from "./TodoCard";
import {
  Circle,
  CircleDotDashed,
  CircleCheck,
  type LucideIcon,
} from "lucide-react";
import { TodoStatus } from "@prisma/client";

type TodoWithTags = Todo & { tags: Tag[] };

interface TodoBoardProps {
  todos: TodoWithTags[];
  allTags: Tag[];
}

const statusConfig: Record<TodoStatus, { icon: LucideIcon; color: string }> = {
  NOT_STARTED: { icon: Circle, color: "text-muted-foreground" },
  IN_PROGRESS: { icon: CircleDotDashed, color: "text-blue-500" },
  DONE: { icon: CircleCheck, color: "text-green-500" },
};

export default function TodoBoard({ todos, allTags }: TodoBoardProps) {
  const t = useTranslations("todos");

  const notStarted = todos.filter((todo) => todo.status === "NOT_STARTED");
  const inProgress = todos.filter((todo) => todo.status === "IN_PROGRESS");
  const done = todos.filter((todo) => todo.status === "DONE");

  const columns = [
    {
      status: TodoStatus.NOT_STARTED,
      title: t("status_not_started"),
      tasks: notStarted,
    },
    {
      status: TodoStatus.IN_PROGRESS,
      title: t("status_in_progress"),
      tasks: inProgress,
    },
    { status: TodoStatus.DONE, title: t("status_done"), tasks: done },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {columns.map((column) => {
        const Icon = statusConfig[column.status].icon;
        const color = statusConfig[column.status].color;
        return (
          <div key={column.title} className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Icon className={`h-5 w-5 ${color}`} />
              <h2 className="text-lg font-semibold tracking-tight">
                {column.title} ({column.tasks.length})
              </h2>
            </div>
            <div className="flex flex-1 flex-col gap-4 rounded-lg bg-muted/50 p-2 min-h-[200px]">
              {column.tasks.length === 0 ? (
                <div className="flex flex-1 items-center justify-center text-center p-4">
                  <p className="text-sm text-muted-foreground">
                    {t("empty_column_placeholder")}
                  </p>
                </div>
              ) : (
                column.tasks.map((todo) => (
                  <TodoCard key={todo.id} todo={todo} allTags={allTags} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
