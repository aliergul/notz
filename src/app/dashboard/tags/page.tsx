import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import TagList from "@/components/tags/TagList";

export const dynamic = "force-dynamic";

interface TagsPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function TagsPage({ searchParams }: TagsPageProps) {
  const t = await getTranslations("tags");
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/");

  const { q } = await searchParams;

  const whereCondition: Prisma.TagWhereInput = {
    userId: session.user.id,
    softDelete: false,
  };
  if (q) {
    whereCondition.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const tags = await prisma.tag.findMany({
    where: whereCondition,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">{t("title")}</h1>
      </div>
      <TagList initialTags={tags} />
    </>
  );
}
