"use client";

import { useTransition } from "react";
import type { Todo } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { updateTodoStatus, softDeleteTodo } from "@/actions/todos";
import { Trash2 } from "lucide-react";

interface TodoListProps {
  todos: Todo[];
}

export default function TodoList({ todos }: TodoListProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (todoId: string, isCompleted: boolean) => {
    startTransition(() => {
      updateTodoStatus(todoId, isCompleted);
    });
  };

  const handleDelete = (todoId: string) => {
    startTransition(() => {
      softDeleteTodo(todoId);
    });
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg border p-4">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50"
        >
          <Checkbox
            id={`todo-${todo.id}`}
            checked={todo.status === "DONE"}
            onCheckedChange={(checked) =>
              handleStatusChange(todo.id, Boolean(checked))
            }
            disabled={isPending}
          />
          <label
            htmlFor={`todo-${todo.id}`}
            className={`flex-1 text-sm font-medium leading-none cursor-pointer ${
              todo.status === "DONE" ? "line-through text-muted-foreground" : ""
            }`}
          >
            {todo.title}
          </label>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 cursor-pointer"
            onClick={() => handleDelete(todo.id)}
            disabled={isPending}
          >
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      ))}
    </div>
  );
}
