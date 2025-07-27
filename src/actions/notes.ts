"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const noteSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, "İçerik boş olamaz."),
});

export async function createNote(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { error: "session_not_found" };
  }

  const validatedFields = noteSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!validatedFields.success) {
    return {
      error: "invalid_data_error",
    };
  }

  const { title, content } = validatedFields.data;

  try {
    await prisma?.note.create({
      data: {
        title,
        content,
        userId: session.user.id,
      },
    });
  } catch (error) {
    console.error("Unexpected error during create note:", error);
    return { error: "create_note_unexpected_err" };
  }

  revalidatePath("/dashboard/notes");
  return { success: "create_note_success" };
}

export async function deleteNote(noteId: string) {
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
    console.error("Unexpected error during delete note:", error);
    return { error: "delete_note_unexpected_err" };
  }

  revalidatePath("/dashboard/notes");
  return { success: "delete_note_success" };
}
