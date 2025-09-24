"use client";

import { useState } from "react";
import type { Todo, Tag } from "@prisma/client";
import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { Pencil, Trash2, Flag, Calendar, Tag as TagIcon } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import EditTodoDialog from "./EditTodoDialog";
import clsx from "clsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import ButtonSpinner from "@/components/spinner";
import { motion } from "framer-motion";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

type TodoWithTags = Todo & { tags: Tag[] };

interface TodoCardProps {
  todo: TodoWithTags;
  allTags: Tag[];
  onDelete: (todoId: string, isPermanent: boolean) => void;
  isPendingDeletion?: boolean;
}

const priorityColors = {
  LOW: "text-green-500",
  MEDIUM: "text-yellow-500",
  HIGH: "text-orange-500",
  URGENT: "text-red-500",
};

export default function TodoCard({
  todo,
  allTags,
  onDelete,
  isPendingDeletion,
}: TodoCardProps) {
  const t = useTranslations("todos");
  const format = useFormatter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: todo.id,
      data: { todo },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    zIndex: isDragging ? 10 : undefined,
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(todo.id, isPermanentDelete);
  };

  const handleAlertOpenChange = (open: boolean) => {
    if (!open) {
      setIsPermanentDelete(false);
    }
    setIsAlertOpen(open);
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        height: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
        border: 0,
      }}
      transition={{ duration: 0.3 }}
      className="relative touch-none"
    >
      {isPendingDeletion && (
        <div className="absolute inset-0 z-30 flex items-center justify-center rounded-lg backdrop-blur-xs"></div>
      )}

      <div
        className={clsx(
          "group relative flex items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:bg-muted w-full",
          isDragging && "shadow-lg"
        )}
      >
        <div className="flex-1 min-w-0">
          <div className="truncate font-medium">{todo.title}</div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2 flex-wrap min-h-6">
            {todo.priority && (
              <div className="flex items-center gap-1">
                <Flag className={`h-3 w-3 ${priorityColors[todo.priority]}`} />
                <span>
                  {t(`priority_${todo.priority.toLowerCase()}` as string)}
                </span>
              </div>
            )}
            {todo.dueDate ? (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {format.dateTime(todo.dueDate, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>-</span>
              </div>
            )}
            {todo.tags.length > 0 ? (
              <>
                {todo.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="text-xs"
                    style={{
                      borderColor: tag.color || undefined,
                      color: tag.color || undefined,
                    }}
                  >
                    {tag.name}
                  </Badge>
                ))}
                {todo.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{todo.tags.length - 3}
                  </Badge>
                )}
              </>
            ) : (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TagIcon className="h-3 w-3" />
                <span>0</span>
              </div>
            )}
          </div>
        </div>

        <div className="relative z-20 flex items-center gap-2 ml-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 cursor-pointer text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setIsEditOpen(true)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <AlertDialog open={isAlertOpen} onOpenChange={handleAlertOpenChange}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 cursor-pointer text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("delete_todo_confirmation_title")}
                </AlertDialogTitle>
                <AlertDialogDescription
                  className={clsx(isPermanentDelete ? "line-through" : "")}
                >
                  {t("delete_todo_confirmation_desc")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex items-center space-x-2 my-4">
                <Checkbox
                  id={`permanent-delete-${todo.id}`}
                  className="cursor-pointer"
                  checked={isPermanentDelete}
                  onCheckedChange={(checked) =>
                    setIsPermanentDelete(Boolean(checked))
                  }
                />
                <Label
                  htmlFor={`permanent-delete-${todo.id}`}
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

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/dashboard/todos/${todo.id}`}
                className="absolute inset-0 z-10 rounded-lg"
              >
                <span className="sr-only">View todo</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("view_todo_details")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <EditTodoDialog
        todo={todo}
        allTags={allTags}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </motion.div>
  );
}
