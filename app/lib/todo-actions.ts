"use server";

import { PrismaClient, PriorityLevel } from "../generated/prisma";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function getTodos() {
  "use server";

  try {
    const todos = await prisma.todo.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return todos;
  } catch (error) {
    console.error("error:", error);
    throw new Error("Görevler çekilemedi.");
  }
}

export async function createTodo(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;
  const dueDateString = formData.get("dueDate") as string | null;
  const priorityString = formData.get("priority") as string; // Formdan priority gelecek

  let dueDate: Date | null = null;
  if (dueDateString) {
    try {
      dueDate = new Date(dueDateString);
      if (isNaN(dueDate.getTime())) {
        dueDate = null;
      }
    } catch (error) {
      console.error("dueDate parse hatası:", error);
      dueDate = null;
    }
  }

  let priority: PriorityLevel | null = null;
  if (Object.values(PriorityLevel).includes(priorityString as PriorityLevel)) {
    priority = priorityString as PriorityLevel;
  } else {
    priority = PriorityLevel.MEDIUM;
  }

  try {
    await prisma.todo.create({
      data: {
        title: title,
        description: description,
        status: false,
        dueDate: dueDate,
        priority: priority,
        // tags eklenecek
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/todos");
    redirect("/todos");
  } catch (error: unknown) {
    if (isRedirectError(error)) {
      throw error;
    }
  }
}
