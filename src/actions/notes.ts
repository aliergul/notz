"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Data Validation
const noteSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, "İçerik boş olamaz."),
  tagIds: z.array(z.string()).optional(),
});

// Note - Create
export async function createNote(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { error: "session_not_found" };
  }

  const validatedFields = noteSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    tagIds: formData.getAll("tagIds"),
  });

  if (!validatedFields.success) {
    return {
      error: "invalid_data_error",
    };
  }

  const { title, content, tagIds } = validatedFields.data;

  try {
    await prisma?.note.create({
      data: {
        title,
        content,
        userId: session.user.id,
        tags: {
          connect: tagIds?.map((id) => ({ id })),
        },
      },
    });
  } catch (error) {
    console.error("Unexpected error during create note:", error);
    return { error: "create_note_unexpected_err" };
  }

  revalidatePath("/dashboard/notes");
  return { success: "create_note_success" };
}

// Note - Update
export async function updateNote(noteId: string, formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { error: "session_not_found" };
  }

  const validatedFields = noteSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    tagIds: formData.getAll("tagIds"),
  });

  if (!validatedFields.success) {
    return {
      error: "invalid_data_error",
    };
  }

  const { title, content, tagIds } = validatedFields.data;

  try {
    const note = await prisma?.note.findUnique({
      where: { id: noteId },
    });

    if (!note || note.userId !== session.user.id) {
      return { error: "not_found_or_unauthorized" };
    }

    await prisma?.note.update({
      where: { id: noteId },
      data: {
        title,
        content,
        tags: {
          set: tagIds?.map((id) => ({ id })),
        },
      },
    });
  } catch (error) {
    console.error("Unexpected error during update note:", error);
    return { error: "update_note_unexpected_err" };
  }

  revalidatePath("/dashboard/notes");
  return { success: "edit_note_success" };
}

// Note - Soft Delete
export async function softDeleteNote(noteId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { error: "session_not_found" };
  }

  try {
    const note = await prisma?.note.findUnique({
      where: { id: noteId },
    });

    if (!note || note.userId !== session.user.id) {
      return { error: "not_found_or_unauthorized" };
    }

    await prisma?.note.update({
      where: {
        id: noteId,
      },
      data: {
        softDelete: true,
      },
    });
  } catch (error) {
    console.error("Unexpected error during soft delete note:", error);
    return { error: "soft_delete_note_unexpected_err" };
  }

  revalidatePath("/dashboard/notes");
  return { success: "soft_delete_note_success" };
}

// Note - Permanent Delete
export async function permanentDeleteNote(noteId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "session_not_found" };

  try {
    const note = await prisma?.note.findUnique({ where: { id: noteId } });
    if (!note || note.userId !== session.user.id) {
      return { error: "not_found_or_unauthorized" };
    }

    await prisma?.note.delete({
      where: { id: noteId },
    });
  } catch (error) {
    console.error("Unexpected error during permanent delete note:", error);
    return { error: "permanent_delete_note_unexpected_err" };
  }

  revalidatePath("/dashboard/notes");
  revalidatePath("/dashboard/trash");
  return { success: "permanent_delete_note_success" };
}
