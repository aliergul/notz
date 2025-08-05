"use client";

import { useState } from "react";
import type { Tag, Todo } from "@prisma/client";
import { useFormatter, useTranslations } from "next-intl";
import { MoreHorizontal, Flag, Calendar, Pencil, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { permanentDeleteTodo, softDeleteTodo } from "@/actions/todos";
import EditTodoDialog from "./EditTodoDialog";
import ButtonSpinner from "@/components/spinner";
import clsx from "clsx";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "../ui/badge";

type TodoWithTags = Todo & { tags: Tag[] };

interface TodoCardProps {
  todo: TodoWithTags;
  allTags: Tag[];
}

const priorityColors = {
  LOW: "text-green-500",
  MEDIUM: "text-yellow-500",
  HIGH: "text-orange-500",
  URGENT: "text-red-500",
};

export default function TodoCard({ todo, allTags }: TodoCardProps) {
  const format = useFormatter();
  const t = useTranslations("todos");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    if (isPermanentDelete) {
      await permanentDeleteTodo(todo.id);
    } else {
      await softDeleteTodo(todo.id);
    }
    setIsDeleting(false);
  };

  return (
    <>
      <Card className="hover:bg-muted/50 transition-colors">
        <CardHeader className="p-4">
          <div className="flex items-start justify-between">
            <CardTitle className="text-base">{todo.title}</CardTitle>
            <AlertDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 cursor-pointer"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onSelect={() => setIsEditOpen(true)}
                    className="cursor-pointer"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>{t("edit")}</span>
                  </DropdownMenuItem>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="text-red-500 cursor-pointer">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>{t("delete")}</span>
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("delete_todo_confirmation_title")}
                  </AlertDialogTitle>
                  <AlertDialogDescription
                    className={clsx(
                      "cursor-pointer",
                      isPermanentDelete ? "line-through" : ""
                    )}
                  >
                    {t("delete_todo_confirmation_desc")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex items-center space-x-2 my-4">
                  <Checkbox
                    id="permanent-delete"
                    className="cursor-pointer"
                    onCheckedChange={(checked) =>
                      setIsPermanentDelete(Boolean(checked))
                    }
                  />
                  <Label
                    htmlFor="permanent-delete"
                    className="text-sm font-medium leading-none text-red-600 cursor-pointer"
                  >
                    {t("permanent_delete_checkbox")}
                  </Label>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer">
                    {t("cancel")}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="cursor-pointer"
                  >
                    {isDeleting && <ButtonSpinner />} {t("delete")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex flex-col gap-2">
          {todo.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {todo.description}
            </p>
          )}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {todo.priority && (
              <div className="flex items-center gap-1">
                <Flag className={`h-3 w-3 ${priorityColors[todo.priority]}`} />
                <span>
                  {t(`priority_${todo.priority.toLowerCase()}` as string)}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                {todo.dueDate
                  ? format.dateTime(todo.dueDate, {
                      month: "short",
                      day: "numeric",
                    })
                  : "-"}
              </span>
            </div>
          </div>
        </CardContent>
        {todo.tags.length > 0 && (
          <CardFooter className="flex flex-wrap gap-1 p-4 pt-0">
            {todo.tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                style={{
                  borderColor: tag.color || undefined,
                  color: tag.color || undefined,
                }}
              >
                {tag.name}
              </Badge>
            ))}
          </CardFooter>
        )}
      </Card>

      <EditTodoDialog
        todo={todo}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        allTags={allTags}
      />
    </>
  );
}
