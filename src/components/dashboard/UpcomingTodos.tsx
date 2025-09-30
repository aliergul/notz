"use client";

import { Todo, Tag } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

type TodoWithTags = Todo & { tags: Tag[] };

interface UpcomingTodosProps {
  initialTodos: TodoWithTags[];
}

export default function UpcomingTodos({ initialTodos }: UpcomingTodosProps) {
  const t_dashboard = useTranslations("dashboard");
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t_dashboard("active_todos")}</CardTitle>
        <CardDescription>{t_dashboard("active_todos_info")}</CardDescription>
      </CardHeader>
      <CardContent>
        {initialTodos.length > 0 ? (
          <div className="space-y-4">
            {initialTodos.map((todo) => (
              <div key={todo.id} className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium leading-none truncate">
                    {todo.title}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/todos`}>
                    {t_dashboard("link_to_todos")}
                    <ArrowUpRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t_dashboard("no_todos_yet")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
