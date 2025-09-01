"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export type ItemType = "note" | "todo" | "tag";

// Trash - Restore Item
export async function restoreItem(itemId: string, type: ItemType) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "session_not_found" };

  try {
    const model = prisma[type];
    // @ts-expect-error Prisma client does not support dynamic model access with a string variable.
    await model.update({
      where: { id: itemId, userId: session.user.id },
      data: { softDelete: false },
    });
  } catch (error) {
    console.error("Unexpected error during restoring item:", error);
    return { error: "restore_item_unexpected_err" };
  }

  revalidatePath("/dashboard/trash");
  revalidatePath(`/dashboard/${type}s`);
  return { success: "restore_item_success" };
}

// Trash - Delete Item Permanently
export async function permanentDeleteItem(itemId: string, type: ItemType) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "session_not_found" };

  try {
    const model = prisma[type];
    // @ts-expect-error Prisma client does not support dynamic model access with a string variable.
    await model.delete({
      where: { id: itemId, userId: session.user.id },
    });
  } catch (error) {
    console.error("Unexpected error during delete item permanently:", error);
    return { error: "permanent_delete_item_unexpected_err" };
  }

  revalidatePath("/dashboard/trash");
  return { success: "permanent_delete_item_success" };
}

// Trash - Empty Trash by Group
export async function emptyTrashByType(type: ItemType) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "session_not_found" };

  try {
    const model = prisma[type];
    // @ts-expect-error - Prisma model'ine dinamik olarak erişiyoruz
    await model.deleteMany({
      where: {
        userId: session.user.id,
        softDelete: true,
      },
    });
  } catch (error) {
    console.error("Unexpected error during empty trash:", error);
    return { error: "empty_trash_unexpected_err" };
  }

  revalidatePath("/dashboard/trash");
  return { success: "empty_trash_success" };
}
