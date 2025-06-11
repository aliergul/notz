"use server";

import { PrismaClient } from "../generated/prisma";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createNote(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title) {
    return { message: "Başlık boş olamaz!", status: "error" };
  }

  try {
    await prisma.note.create({
      data: {
        title,
        content,
      },
    });
    // Next.js'in önbelleğini yenile
    revalidatePath("/"); // Ana sayfayı veya notların listelendiği sayfayı yenile
    return { message: "Not başarıyla oluşturuldu.", status: "success" };
  } catch (error) {
    console.error("Not oluşturma hatası:", error);
    return { message: "Not oluşturulurken bir hata oluştu.", status: "error" };
  }
}
