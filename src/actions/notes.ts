"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const NOTES_PER_PAGE = 10;

// Data Validation
const noteSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, "İçerik boş olamaz."),
  tagIds: z.array(z.string()).optional(),
});

// Note - Fetch
export async function fetchNotes({
  page = 1,
  query,
  tagId,
}: {
  page: number;
  query?: string;
  tagId?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "session_not_found", notes: [] };

  const whereCondition: Prisma.NoteWhereInput = {
    userId: session.user.id,
    softDelete: false,
  };

  if (query) {
    whereCondition.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { content: { contains: query, mode: "insensitive" } },
    ];
  }

  if (tagId) {
    whereCondition.tags = {
      some: { id: tagId },
    };
  }

  try {
    const notes = await prisma?.note.findMany({
      where: whereCondition,
      include: { tags: { where: { softDelete: false } } },
      orderBy: { updatedAt: "desc" },
      take: NOTES_PER_PAGE,
      skip: (page - 1) * NOTES_PER_PAGE,
    });
    return { notes };
  } catch (error) {
    console.error("Error fetching notes:", error);
    return { error: "fetch_notes_unexpected_err", notes: [] };
  }
}

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
