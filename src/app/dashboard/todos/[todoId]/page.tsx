import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TodoDetailPageProps {
  params: Promise<{ todoId: string }>;
}

export default async function TodoDetailPage({ params }: TodoDetailPageProps) {
  const t = await getTranslations("todos");
  const format = await getFormatter();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/");
  }

  const { todoId } = await params;

  const todo = await prisma.todo.findFirst({
    where: {
      id: todoId,
      userId: session.user.id,
    },
    include: {
      tags: {
        where: { softDelete: false },
      },
    },
  });

  if (!todo) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <Link href="/dashboard/todos">
        <Button variant="outline" size="sm" className="gap-1 cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
          {t("back_to_todos")}
        </Button>
      </Link>

      <div className="space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">{todo.title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {t("status_label")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{t(`status_${todo.status.toLowerCase()}` as string)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {t("priority_label")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{t(`priority_${todo.priority.toLowerCase()}` as string)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {t("dueDate_label")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {todo.dueDate
                  ? format.dateTime(todo.dueDate, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "-"}
              </p>
            </CardContent>
          </Card>
        </div>

        {todo.tags.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">{t("tags_label")}</h2>
            <div className="flex flex-wrap gap-2">
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
            </div>
          </div>
        )}

        {todo.description && (
          <div>
            <h2 className="text-lg font-semibold mb-2">
              {t("description_label")}
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p>{todo.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
