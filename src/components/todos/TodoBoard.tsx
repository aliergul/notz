"use client";

import { useState, useTransition, useEffect } from "react";
import { type Todo, type Tag, TodoStatus } from "@prisma/client";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  fetchTodos,
  softDeleteTodo,
  permanentDeleteTodo,
  updateTodoStatusByDrag,
} from "@/actions/todos";
import TodoCard from "./TodoCard";
import {
  Circle,
  CircleDotDashed,
  CircleCheck,
  type LucideIcon,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ButtonSpinner from "../spinner";
import { AnimatePresence } from "framer-motion";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

type TodoWithTags = Todo & { tags: Tag[] };

type ColumnData = {
  tasks: TodoWithTags[];
  total: number;
};

interface TodoBoardProps {
  initialColumnsData: Record<TodoStatus, ColumnData>;
  allTags: Tag[];
}

const statusConfig: Record<
  TodoStatus,
  { icon: LucideIcon; color: string; bgColor: string }
> = {
  NOT_STARTED: {
    icon: Circle,
    color: "text-muted-foreground",
    bgColor: "bg-muted/50",
  },
  IN_PROGRESS: {
    icon: CircleDotDashed,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  DONE: {
    icon: CircleCheck,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
};

function DroppableColumn({
  status,
  children,
}: {
  status: TodoStatus;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id: status });
  return (
    <div ref={setNodeRef} className="flex flex-col gap-4">
      {children}
    </div>
  );
}

export default function TodoBoard({
  initialColumnsData,
  allTags,
}: TodoBoardProps) {
  const t = useTranslations("todos");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [columnsData, setColumnsData] =
    useState<Record<TodoStatus, ColumnData>>(initialColumnsData);
  const [pages, setPages] = useState<Record<TodoStatus, number>>({
    NOT_STARTED: 1,
    IN_PROGRESS: 1,
    DONE: 1,
  });
  const [isPending, startTransition] = useTransition();
  const [pendingDeletionTodoIds, setPendingDeletionTodoIds] = useState<
    string[]
  >([]);

  const [activeTodo, setActiveTodo] = useState<TodoWithTags | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    setColumnsData(initialColumnsData);
    setPages({ NOT_STARTED: 1, IN_PROGRESS: 1, DONE: 1 });
    setPendingDeletionTodoIds([]);
    window.scrollTo(0, 0);
  }, [initialColumnsData]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const todo = active.data.current?.todo as TodoWithTags;
    setActiveTodo(todo);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTodo(null);
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString() as TodoStatus;

    let draggedTodo: TodoWithTags | undefined;
    let startColumn: TodoStatus | undefined;

    Object.entries(columnsData).forEach(([status, column]) => {
      const found = column.tasks.find((task) => task.id === activeId);
      if (found) {
        draggedTodo = found;
        startColumn = status as TodoStatus;
      }
    });

    const endColumn = overId;

    if (!draggedTodo || !startColumn || startColumn === endColumn) {
      return;
    }

    startTransition(() => {
      setColumnsData((prev) => {
        const newColumns = { ...prev };
        newColumns[startColumn!].tasks = newColumns[startColumn!].tasks.filter(
          (task) => task.id !== activeId
        );
        newColumns[endColumn].tasks.unshift({
          ...draggedTodo!,
          status: endColumn,
        });
        return newColumns;
      });

      updateTodoStatusByDrag(activeId, endColumn).then((result) => {
        if (result?.error) {
          router.refresh();
        }
      });
    });
  };

  const handleOptimisticDelete = (todoId: string, isPermanent: boolean) => {
    startTransition(async () => {
      setPendingDeletionTodoIds((prev) => [...prev, todoId]);
      const action = isPermanent ? permanentDeleteTodo : softDeleteTodo;
      await action(todoId);
      router.refresh();
    });
  };

  const loadMore = (status: TodoStatus) => {
    startTransition(async () => {
      const nextPage = pages[status] + 1;
      const query = searchParams.get("q") || undefined;
      const tagId = searchParams.get("tag") || undefined;

      const result = await fetchTodos({
        page: nextPage,
        query,
        tagId,
        status,
      });

      if (result && Array.isArray(result.todos)) {
        setColumnsData((prev) => ({
          ...prev,
          [status]: {
            ...prev[status],
            tasks: [...prev[status].tasks, ...(result.todos as TodoWithTags[])],
          },
        }));
        setPages((prev) => ({ ...prev, [status]: nextPage }));
      }
    });
  };

  const columnsOrder: TodoStatus[] = [
    TodoStatus.NOT_STARTED,
    TodoStatus.IN_PROGRESS,
    TodoStatus.DONE,
  ];

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {columnsOrder.map((status) => {
          const column = columnsData[status];
          const config = statusConfig[status];
          const hasMore = column.tasks.length < column.total;

          return (
            <DroppableColumn key={status} status={status}>
              <div className="flex items-center gap-2">
                <config.icon className={`h-5 w-5 ${config.color}`} />
                <h2 className="text-lg font-semibold tracking-tight">
                  {t(`status_${status.toLowerCase()}` as string)} (
                  {column.total})
                </h2>
              </div>
              <div
                className={cn(
                  "flex flex-1 flex-col gap-4 rounded-lg p-2 min-h-[200px] transition-colors",
                  config.bgColor
                )}
              >
                {column.tasks.length === 0 ? (
                  <div className="flex flex-1 items-center justify-center text-center p-4">
                    <p className="text-sm text-muted-foreground">
                      {t("empty_column_placeholder")}
                    </p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {column.tasks.map((todo) =>
                      activeTodo?.id !== todo.id ? (
                        <TodoCard
                          key={todo.id}
                          todo={todo}
                          allTags={allTags}
                          onDelete={handleOptimisticDelete}
                          isPendingDeletion={pendingDeletionTodoIds.includes(
                            todo.id
                          )}
                        />
                      ) : null
                    )}
                  </AnimatePresence>
                )}
                {hasMore && (
                  <Button
                    onClick={() => loadMore(status)}
                    disabled={isPending}
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-muted-foreground cursor-pointer"
                  >
                    {isPending ? (
                      <ButtonSpinner className="text-muted-foreground" />
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        {t("load_more_button")}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </DroppableColumn>
          );
        })}
      </div>

      <DragOverlay>
        {activeTodo ? (
          <TodoCard todo={activeTodo} allTags={allTags} onDelete={() => {}} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
