import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { NotebookPen, CheckSquare } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import RecentNotes from "@/components/dashboard/RecentNotes";
import UpcomingTodos from "@/components/dashboard/UpcomingTodos";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/");
  }

  const t = await getTranslations("sidebar_navbar");
  const t_dashboard = await getTranslations("dashboard");

  const [noteCount, todoCount, recentNotes, upcomingTodos] = await Promise.all([
    prisma.note.count({
      where: { userId: session.user.id, softDelete: false },
    }),
    prisma.todo.count({
      where: {
        userId: session.user.id,
        softDelete: false,
        NOT: { status: "DONE" },
      },
    }),
    prisma.note.findMany({
      where: { userId: session.user.id, softDelete: false },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { tags: true },
    }),
    prisma.todo.findMany({
      where: {
        userId: session.user.id,
        softDelete: false,
        NOT: { status: "DONE" },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { tags: true },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {t_dashboard("welcome")}, {session.user.name?.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground">
          {t_dashboard("activity_summary")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          title={t("notes_page")}
          value={noteCount}
          icon={<NotebookPen className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title={t_dashboard("active_todos")}
          value={todoCount}
          icon={<CheckSquare className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RecentNotes initialNotes={recentNotes} />
        <UpcomingTodos initialTodos={upcomingTodos} />
      </div>
    </div>
  );
}
