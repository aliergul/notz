"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { format } from "date-fns";
import { Calendar as CalendarIcon, PlusCircle } from "lucide-react";
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
  DialogTrigger,
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
import { createTodo } from "@/actions/todos";
import ButtonSpinner from "../spinner";
import { tr } from "date-fns/locale";

export default function NewTodoDialog() {
  const t = useTranslations("todos");
  const t_notify = useTranslations("notifications");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>();
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    if (date) {
      formData.set("dueDate", date.toISOString());
    }

    const result = await createTodo(formData);
    setIsLoading(false);

    if (result.error) {
      setError(t_notify(result.error as string));
    } else {
      setOpen(false);
      setDate(undefined);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="ml-auto gap-1 cursor-pointer">
          <PlusCircle className="h-4 w-4" />
          {t("new_todo_button")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("new_todo_dialog_title")}</DialogTitle>
          <DialogDescription>{t("new_todo_dialog_desc")}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          id="todo-form"
          className="grid gap-4 py-4"
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              {t("title_label")}
            </Label>
            <Input id="title" name="title" required className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              {t("description_label")}
            </Label>
            <Textarea
              id="description"
              name="description"
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              {t("status_label")}
            </Label>
            <Select name="status" defaultValue={TodoStatus.NOT_STARTED}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Durum seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TodoStatus.NOT_STARTED}>
                  {t("status_not_started")}
                </SelectItem>
                <SelectItem value={TodoStatus.IN_PROGRESS}>
                  {t("status_in_progress")}
                </SelectItem>
                <SelectItem value={TodoStatus.DONE}>
                  {t("status_done")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              {t("priority_label")}
            </Label>
            <Select name="priority" defaultValue={PriorityLevel.MEDIUM}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Öncelik seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PriorityLevel.LOW}>
                  {t("priority_low")}
                </SelectItem>
                <SelectItem value={PriorityLevel.MEDIUM}>
                  {t("priority_medium")}
                </SelectItem>
                <SelectItem value={PriorityLevel.HIGH}>
                  {t("priority_high")}
                </SelectItem>
                <SelectItem value={PriorityLevel.URGENT}>
                  {t("priority_urgent")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right">
              {t("dueDate_label")}
            </Label>
            <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal cursor-pointer",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "PPP", {
                      locale: locale === "tr" ? tr : undefined,
                    })
                  ) : (
                    <span>{t("pick_a_date")}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  autoFocus
                  locale={locale === "tr" ? tr : undefined}
                  onSelect={(value) => {
                    setOpenCalendar(false);
                    setDate(value);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          {error && (
            <p className="col-span-4 text-center text-sm font-medium text-red-500">
              {error}
            </p>
          )}
        </form>
        <DialogFooter>
          <Button
            type="submit"
            form="todo-form"
            disabled={isLoading}
            className="w-full cursor-pointer"
          >
            {isLoading && <ButtonSpinner />}
            {t("save_button")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
