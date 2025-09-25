"use client";

import { useState } from "react";
import type { Tag, Todo } from "@prisma/client";
import { useLocale, useTranslations } from "next-intl";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { PriorityLevel, TodoStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { updateTodo } from "@/actions/todos";
import ButtonSpinner from "../spinner";
import TagSelector from "../tags/TagSelector";
import { toast } from "sonner";

type TodoWithTags = Todo & { tags: Tag[] };

interface EditTodoDialogProps {
  todo: TodoWithTags;
  allTags: Tag[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditTodoDialog({
  todo,
  allTags,
  open,
  onOpenChange,
}: EditTodoDialogProps) {
  const t_todos = useTranslations("todos");
  const t_notify = useTranslations("notifications");
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(todo.dueDate || undefined);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    if (date) {
      formData.set("dueDate", date.toISOString());
    } else {
      formData.delete("dueDate");
    }

    const result = await updateTodo(todo.id, formData);
    setIsLoading(false);

    if (result?.error) {
      toast.error(t_notify(result.error as string));
    } else {
      toast.success(t_notify(result.success as string));
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t_todos("edit_todo_dialog_title")}</DialogTitle>
          <DialogDescription>
            {t_todos("edit_todo_dialog_desc")}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          id="edit-todo-form"
          className="grid gap-4 py-4"
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              {t_todos("title_label")}
            </Label>
            <Input
              id="title"
              name="title"
              defaultValue={todo.title}
              required
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              {t_todos("description_label")}
            </Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={todo.description || ""}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              {t_todos("status_label")}
            </Label>
            <Select name="status" defaultValue={todo.status}>
              <SelectTrigger className="col-span-3 cursor-pointer">
                <SelectValue placeholder={t_todos("pick_a_status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value={TodoStatus.NOT_STARTED}
                  className="cursor-pointer"
                >
                  {t_todos("status_not_started")}
                </SelectItem>
                <SelectItem
                  value={TodoStatus.IN_PROGRESS}
                  className="cursor-pointer"
                >
                  {t_todos("status_in_progress")}
                </SelectItem>
                <SelectItem value={TodoStatus.DONE} className="cursor-pointer">
                  {t_todos("status_done")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              {t_todos("priority_label")}
            </Label>
            <Select name="priority" defaultValue={todo.priority}>
              <SelectTrigger className="col-span-3 cursor-pointer">
                <SelectValue placeholder={t_todos("pick_a_priority")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value={PriorityLevel.LOW}
                  className="cursor-pointer"
                >
                  {t_todos("priority_low")}
                </SelectItem>
                <SelectItem
                  value={PriorityLevel.MEDIUM}
                  className="cursor-pointer"
                >
                  {t_todos("priority_medium")}
                </SelectItem>
                <SelectItem
                  value={PriorityLevel.HIGH}
                  className="cursor-pointer"
                >
                  {t_todos("priority_high")}
                </SelectItem>
                <SelectItem
                  value={PriorityLevel.URGENT}
                  className="cursor-pointer"
                >
                  {t_todos("priority_urgent")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right">
              {t_todos("dueDate_label")}
            </Label>
            <Popover>
              <PopoverTrigger asChild className="cursor-pointer">
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "PPP", {
                      locale: locale === "tr" ? tr : undefined,
                    })
                  ) : (
                    <span>{t_todos("pick_a_date")}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  autoFocus
                  locale={locale === "tr" ? tr : undefined}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">{t_todos("tags_label")}</Label>
            <div className="col-span-3">
              <TagSelector
                allTags={allTags}
                initialSelectedTagIds={todo.tags.map((tag) => tag.id)}
              />
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button
            type="submit"
            form="edit-todo-form"
            disabled={isLoading}
            className="w-full cursor-pointer"
          >
            {isLoading && <ButtonSpinner />}
            {t_todos("save_changes_button")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
