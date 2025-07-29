"use server";

import { authOptions } from "@/lib/auth";
import { TodoStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import z from "zod";

// Data Validation
const createTodoSchema = z.object({
  title: z.string().min(1, "title_required"),
});

// Todo - Create
export async function createTodo(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "session_not_found" };

  const validatedFields = createTodoSchema.safeParse({
    title: formData.get("title"),
  });

  if (!validatedFields.success) return { error: "invalid_data_error" };

  try {
    await prisma?.todo.create({
      data: {
        title: validatedFields.data.title,
        userId: session.user.id,
      },
    });
  } catch (error) {
    console.error("Unexpected error during create todo:", error);
    return { error: "create_todo_unexpected_err" };
  }

  revalidatePath("/dashboard/todos");
  return { success: "create_todo_success" };
}

// Todo - Update Status
export async function updateTodoStatus(todoId: string, isCompleted: boolean) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "session_not_found" };

  try {
    const todo = await prisma?.todo.findUnique({ where: { id: todoId } });
    if (!todo || todo.userId !== session.user.id) {
      return { error: "not_found_or_unauthorized" };
    }

    await prisma?.todo.update({
      where: { id: todoId },
      data: { status: isCompleted ? TodoStatus.DONE : TodoStatus.IN_PROGRESS },
    });
  } catch (error) {
    console.error("Unexpected error during update status todo:", error);
    return { error: "update_todo_unexpected_err" };
  }

  revalidatePath("/dashboard/todos");
  return { success: "update_todo_success" };
}

// Todo - Soft Delete
export async function softDeleteTodo(todoId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "session_not_found" };

  try {
    const todo = await prisma?.todo.findUnique({ where: { id: todoId } });
    if (!todo || todo.userId !== session.user.id) {
      return { error: "not_found_or_unauthorized" };
    }

    await prisma?.todo.update({
      where: { id: todoId },
      data: { softDelete: true },
    });
  } catch (error) {
    console.error("Unexpected error during soft delete todo:", error);
    return { error: "soft_delete_todo_unexpected_err" };
  }

  revalidatePath("/dashboard/todos");
  revalidatePath("/dashboard/trash");
  return { success: "soft_delete_todo_success" };
}
