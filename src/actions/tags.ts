"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import z from "zod";

// Data Validation
const tagSchema = z.object({
  name: z.string().min(1, "name_required"),
  description: z.string().optional(),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "invalid_color_format")
    .optional(),
});

// Tag - Create
export async function createTag(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "session_not_found" };

  const validatedFields = tagSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    color: formData.get("color"),
  });

  if (!validatedFields.success) {
    return { error: "invalid_data_error" };
  }

  try {
    await prisma?.tag.create({
      data: {
        ...validatedFields.data,
        userId: session.user.id,
      },
    });
  } catch (error) {
    console.error("Unexpected error during create tag:", error);
    return { error: "create_tag_unexpected_err" };
  }

  revalidatePath("/dashboard/tags");
  return { success: "create_tag_success" };
}

// Tag - Update
export async function updateTag(tagId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "session_not_found" };

  const validatedFields = tagSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    color: formData.get("color"),
  });

  if (!validatedFields.success) {
    return { error: "invalid_data_error" };
  }

  try {
    const tag = await prisma?.tag.findUnique({ where: { id: tagId } });
    if (!tag || tag.userId !== session.user.id) {
      return { error: "not_found_or_unauthorized" };
    }
    await prisma?.tag.update({
      where: { id: tagId },
      data: validatedFields.data,
    });
  } catch (error) {
    console.error("Unexpected error during update tag:", error);
    return { error: "update_tag_unexpected_err" };
  }

  revalidatePath("/dashboard/tags");
  revalidatePath("/dashboard/notes");
  revalidatePath("/dashboard/todos");
  return { success: "update_tag_success" };
}

// Tag - Soft Delete
export async function softDeleteTag(tagId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "session_not_found" };

  try {
    const tag = await prisma?.tag.findUnique({
      where: { id: tagId },
    });
    if (!tag || tag.userId !== session.user.id) {
      return { error: "not_found_or_unauthorized" };
    }

    await prisma?.tag.update({
      where: { id: tagId },
      data: {
        softDelete: true,
      },
    });
  } catch (error) {
    console.error("Unexpected error during soft delete tag:", error);
    return { error: "soft_delete_tag_unexpected_err" };
  }

  revalidatePath("/dashboard/tags");
  revalidatePath("/dashboard/notes");
  revalidatePath("/dashboard/todos");
  revalidatePath("/dashboard/trash");
  return { success: "soft_delete_tag_success" };
}

// Tag - Permanent Delete
export async function deleteTagPermanent(tagId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "session_not_found" };

  try {
    const tag = await prisma?.tag.findUnique({
      where: { id: tagId },
    });
    if (!tag || tag.userId !== session.user.id) {
      return { error: "not_found_or_unauthorized" };
    }

    await prisma?.tag.delete({
      where: { id: tagId },
    });
  } catch (error) {
    console.error("Unexpected error during permanent delete tag:", error);
    return { error: "permanent_delete_tag_unexpected_err" };
  }

  revalidatePath("/dashboard/tags");
  revalidatePath("/dashboard/notes");
  revalidatePath("/dashboard/todos");
  revalidatePath("/dashboard/trash");
  return { success: "permanent_delete_tag_success" };
}
