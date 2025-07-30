"use server";

import { authOptions } from "@/lib/auth";
import { PriorityLevel, TodoStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import z from "zod";

// Data Validation
const todoSchema = z.object({
  title: z.string().min(1, "title_required"),
  description: z.string().optional(),
  priority: z.enum(PriorityLevel).optional(),
  dueDate: z.date().optional().nullable(),
  status: z.enum(TodoStatus).optional(),
});

// Todo - Create
export async function createTodo(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "session_not_found" };

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    priority: formData.get("priority"),
    status: formData.get("status"),
    dueDate: formData.get("dueDate")
      ? new Date(formData.get("dueDate") as string)
      : null,
  };

  const validatedFields = todoSchema.safeParse(rawData);

  if (!validatedFields.success) {
    console.error(
      "Validation errors:",
      validatedFields.error.flatten().fieldErrors
    );
    return { error: "invalid_data_error" };
  }

  try {
    await prisma?.todo.create({
      data: {
        ...validatedFields.data,
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

// Todo - Update
export async function updateTodo(todoId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "session_not_found" };

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    priority: formData.get("priority"),
    status: formData.get("status"),
    dueDate: formData.get("dueDate")
      ? new Date(formData.get("dueDate") as string)
      : null,
  };

  const validatedFields = todoSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { error: "invalid_data_error" };
  }

  try {
    const todo = await prisma?.todo.findUnique({ where: { id: todoId } });
    if (!todo || todo.userId !== session.user.id) {
      return { error: "not_found_or_unauthorized" };
    }

    await prisma?.todo.update({
      where: { id: todoId },
      data: validatedFields.data,
    });
  } catch (error) {
    console.error("Unexpected error during update todo:", error);
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

// Todo - Permanent Delete
export async function permanentDeleteTodo(todoId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "session_not_found" };

  try {
    const todo = await prisma?.todo.findUnique({ where: { id: todoId } });
    if (!todo || todo.userId !== session.user.id) {
      return { error: "not_found_or_unauthorized" };
    }

    await prisma?.todo.delete({
      where: { id: todoId },
    });
  } catch (error) {
    console.error("Unexpected error during permanent delete todo:", error);
    return { error: "permanent_delete_todo_unexpected_err" };
  }

  revalidatePath("/dashboard/todos");
  revalidatePath("/dashboard/trash");
  return { success: "permanent_delete_todo_success" };
}
