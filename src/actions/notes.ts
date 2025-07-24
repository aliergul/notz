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
