"use client";

import type { Todo } from "@prisma/client";
import { useFormatter, useTranslations } from "next-intl";
import { MoreHorizontal, Flag, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TodoCardProps {
  todo: Todo;
}

const priorityColors = {
  LOW: "text-green-500",
  MEDIUM: "text-yellow-500",
  HIGH: "text-orange-500",
  URGENT: "text-red-500",
};

export default function TodoCard({ todo }: TodoCardProps) {
  const format = useFormatter();
  const t = useTranslations("todos");

  return (
    <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{todo.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>{t("edit")}</DropdownMenuItem>
              <DropdownMenuItem className="text-red-500">Sil</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
              <span>{todo.priority}</span>
            </div>
          )}
          {todo.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                {format.dateTime(todo.dueDate, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
